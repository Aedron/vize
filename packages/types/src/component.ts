import { ReactElement, ComponentType } from 'react';
import { MaterialsInfo } from './materials';
import { MaterialsForm } from './form';
import { MaterialsCustomEvent } from './events';
import { EventInstance } from './events';
import { CommonStyleMeta, Percent } from './styles';
import { GlobalMeta } from './global';
import { PageRouter } from './router';

export interface MaterialsComponentMeta {
  identityName: string;
  lib: string;
  name: string;
  readonly info: MaterialsInfo;
  readonly dataForm?: MaterialsForm;
  readonly styleForm?: MaterialsForm;
  readonly enableStyleGroup?: CommonStyleMeta | '*';
  readonly enableWrapperStyleGroup?: CommonStyleMeta | '*';
  readonly thumb?: string;
  readonly preview?: string;
  readonly isContainer?: boolean;
  readonly hotArea?: boolean;
  readonly runtime?: 'react' | 'rax';
  readonly onEvents?: MaterialsCustomEvent[];
  readonly emitEvents?: MaterialsCustomEvent[];
  readonly hideEditMask?: boolean;
  readonly isBuildIn?: boolean;
  readonly enableStyleInject?: boolean;
}

export interface ComponentPosition {
  x: number;
  y: number;
}

export interface ComponentSize {
  width: number;
  height: number;
}

export interface HotAreaPosition {
  x: Percent;
  y: Percent;
}

export interface HotAreaSize {
  width: Percent;
  height: Percent;
}

export interface HotArea {
  key: number;
  position: HotAreaPosition;
  size: HotAreaSize;
  events: EventInstance[];
  parent: ComponentInstance;
}

export interface ComponentInstance {
  key: Readonly<number>;
  component: Readonly<string>;
  lib: Readonly<string>;
  data: { [key: string]: any };
  style: { [key: string]: any };
  commonStyle: { [key: string]: any };
  wrapperStyle: { [key: string]: any };
  events: EventInstance[];
  children?: ComponentInstance[];
  parent?: ComponentInstance;
  layout?: {
    position: ComponentPosition;
    size?: ComponentSize;
  };
  hotAreas?: HotArea[];
  shared: boolean;
}

export interface ComponentSelectedCallbackParams {
  selected: boolean;
  asContainer?: boolean;
  asHotAreaContainer?: boolean;
  asHotAreaParentContainer?: boolean;
}

export type ComponentSelectedCallback = (params: ComponentSelectedCallbackParams) => unknown;

export interface ComponentProps<
  D extends object = ComponentInstance['data'],
  S extends object = ComponentInstance['style']
> extends Pick<ComponentInstance, 'commonStyle'> {
  componentKey: Readonly<number>;
  data: D;
  style: S;
  meta: GlobalMeta;
  globalData: object;
  globalStyle: object;
  pageData: object;
  pageStyle: object;
  instance: ComponentInstance;
  hotAreas?: ReactElement;
  on: (eventName: string, callback: Function) => void;
  cancel: (eventName: string, callback: Function) => void;
  emit: (eventName: string) => void;
  onSelected: (callback: ComponentSelectedCallback) => void;
  router: PageRouter;
  children?: any;
}

export type MaterialsComponent = ComponentType<ComponentProps>;
