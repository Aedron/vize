import './index.scss';
import * as React from 'react';
import { RenderSandbox } from 'widgets/RenderSandbox';
import { observer } from 'mobx-react';
import { contextMenu } from 'react-contexify';
import { componentsStore, editStore, globalStore, materialsStore, pagesStore, sharedStore } from 'states';
import {
  MaterialsMain,
  Maybe,
  ContainerRenderEntry,
  ComponentInstance,
  Router,
  GlobalUniversalEventTrigger,
  RenderTemplateParams,
} from '@vize/types';
import { loadUMDModuleFromString, injectStyle, registerHotkey, initDocument } from 'libs';
import {
  setMaterialsMap,
  executePlugins,
  onCustomEvent,
  cancelCustomEvent,
  emitCustomEvent,
  generateGlobalEventHandlers,
  setIframeWindow,
} from '@vize/runtime-web';
import tpl from 'lodash.template';
import { LayoutRender } from '../LayoutRender';
import { InjectedStylesRender } from '../InjectedStylesRender';
import { injectRuntime, setUserAgent } from './utils';

import iframeStyle from './index.iframe.scss';

editStore.setIframeStyle('Renderer', iframeStyle);

@observer
export class Renderer extends React.Component {
  constructor(props: {}) {
    super(props);
    const { containerHTML } = materialsStore;
    const { globalData, globalStyle, metaInfo } = globalStore;
    const params: RenderTemplateParams = { globalData, globalStyle, meta: metaInfo };
    this.containerHTML = tpl(containerHTML)(params);
  }

  private readonly containerHTML: string;

  public state = {
    ready: false,
  };

  private iframeDidMount = async (doc: Document, win: Window) => {
    this.initIframeDocument(doc, win);

    const renderEntry = await this.initMaterials(doc, win);
    if (!renderEntry) {
      throw new Error('No renderEntry');
    }
    this.callContainerRenderEntry(renderEntry);

    await this.execPlugins();

    await this.execGlobalInitCallbacks();
  };

  private execPlugins = () => {
    const { metaInfo: meta, globalData, globalStyle } = globalStore;
    const {
      router,
      currentPage: { data: pageData, style: pageStyle, pluginInstances },
    } = pagesStore;

    return executePlugins({
      pluginInstances,
      meta,
      globalData,
      globalStyle,
      pageData,
      pageStyle,
      router,
    });
  };

  private execGlobalInitCallbacks = async () => {
    const { globalEvents, globalData, globalStyle, metaInfo: meta } = globalStore;
    const {
      router,
      currentPage: { data: pageData, style: pageStyle },
    } = pagesStore;
    const handlers = generateGlobalEventHandlers(globalEvents, router);
    if (handlers[GlobalUniversalEventTrigger.INIT]) {
      await handlers[GlobalUniversalEventTrigger.INIT]!(null, { globalData, globalStyle, pageData, pageStyle, meta });
    }
  };

  private initIframeDocument = (doc: Document, win: Window) => {
    injectRuntime(win);
    setUserAgent(win);
    setIframeWindow(win);
    initDocument(doc);
    registerHotkey(doc);
    win.addEventListener('click', contextMenu.hideAll);
  };

  private initMaterials = async (doc: Document, win: Window): Promise<Maybe<ContainerRenderEntry>> => {
    let renderEntry: Maybe<ContainerRenderEntry> = null;

    await Promise.all(
      editStore.libNames.map(async libName => {
        const [main, entry] = await this.initMaterialsWithIframeContext(libName, doc, win);

        setMaterialsMap(libName, main);

        if (entry) {
          renderEntry = entry;
        }
      }),
    );

    return renderEntry;
  };

  private initMaterialsWithIframeContext = async (
    libName: string,
    doc: Document,
    win: Window,
  ): Promise<[MaterialsMain, Maybe<ContainerRenderEntry>, void, void]> => {
    const {
      isMainLib,
      mainScript,
      mainStyle,
      mainEntryName,
      entryScript,
      entryStyle,
      entryEntryName,
    } = materialsStore.materialsLibs[libName]!;

    return Promise.all([
      loadUMDModuleFromString<MaterialsMain>(mainScript, mainEntryName, win),
      isMainLib
        ? loadUMDModuleFromString<ContainerRenderEntry>(entryScript!, entryEntryName!, win)
        : Promise.resolve(null),
      mainStyle ? injectStyle(mainStyle, win) : Promise.resolve(),
      isMainLib && entryStyle ? injectStyle(entryStyle, win) : Promise.resolve(),
    ]);
  };

  private onGlobalEvent = (eventName: string, callback: Function) => {
    return onCustomEvent('global', eventName, callback);
  };

  private cancelGlobalEvent = (eventName: string, callback: Function) => {
    return cancelCustomEvent('global', eventName, callback);
  };

  private emitGlobalEvent = (eventName: string) => {
    const { globalEvents, globalData, globalStyle, metaInfo: meta } = globalStore;
    const {
      router,
      currentPage: { data: pageData, style: pageStyle },
    } = pagesStore;
    return emitCustomEvent({
      events: globalEvents,
      eventName,
      router,
      meta,
      globalData,
      globalStyle,
      pageData,
      pageStyle,
    });
  };

  // TODO: implementRouterController
  private implementRouterController = (CustomRouter: Router) => {
    console.warn('"implementRouterController" not supported in editor for now...', CustomRouter);
  };

  private callContainerRenderEntry = (renderEntry: ContainerRenderEntry) => {
    const { globalData, globalStyle, metaInfo: meta } = globalStore;
    renderEntry({
      globalData,
      globalStyle,
      meta,
      implementRouterController: this.implementRouterController,
      render: () => this.setState({ ready: true }),
      on: this.onGlobalEvent,
      cancel: this.cancelGlobalEvent,
      emit: this.emitGlobalEvent,
    });
  };

  private renderContent = (
    doc: Document,
    win: Window,
    mountTarget: HTMLDivElement,
    componentInstances: ComponentInstance[],
    sharedComponentInstances: ComponentInstance[],
  ) => {
    if (!this.state.ready) {
      return null;
    }

    return (
      <>
        <InjectedStylesRender />
        <LayoutRender
          mountTarget={mountTarget}
          componentInstances={componentInstances}
          sharedComponentInstances={sharedComponentInstances}
        />
      </>
    );
  };

  public render() {
    const { componentInstances } = componentsStore;
    const { sharedComponentInstances } = sharedStore;

    return (
      <RenderSandbox
        mountTarget="#vize-main-entry"
        htmlContent={this.containerHTML}
        iframeDidMount={this.iframeDidMount}
        componentInstances={componentInstances}
        sharedComponentInstances={sharedComponentInstances}
      >
        {this.renderContent}
      </RenderSandbox>
    );
  }
}

export * from './WithRerender';
