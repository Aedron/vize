import * as React from 'react';
import { ComponentInstance } from '@vize/types';
import { PropsWithChildren } from 'react';
import { observer } from 'mobx-react';
import { ComponentView as RuntimeComponentView } from '@vize/runtime-web';
import { editStore, globalStore, pagesStore } from 'states';
import { MaterialsErrorBoundary } from 'components/MaterialsErrorBoundary';

interface Props {
  instance: ComponentInstance;
}

const ObservedComponentView = observer(RuntimeComponentView);

function IComponentView({ instance, children }: PropsWithChildren<Props>) {
  const { previewMode } = editStore;
  const { metaInfo, globalData, globalStyle } = globalStore;
  const {
    router,
    currentPage: { data: pageData, style: pageStyle },
  } = pagesStore;

  return (
    <MaterialsErrorBoundary type="component" identityName={instance.component}>
      <ObservedComponentView
        instance={instance}
        previewMode={previewMode}
        router={router}
        meta={metaInfo}
        globalData={globalData}
        globalStyle={globalStyle}
        pageData={pageData}
        pageStyle={pageStyle}
      >
        {children}
      </ObservedComponentView>
    </MaterialsErrorBoundary>
  );
}

export const ComponentView = observer(IComponentView);
