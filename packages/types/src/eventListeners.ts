/**
 * @desc Component Events
 */
export enum ComponentEventListenerTypes {
  INIT = 'afterRender',
  CLICK = 'click',
  MOUSE_ENTER = 'mouseEnter',
  MOUSE_LEAVE = 'mouseLeave',
  DOUBLE_CLICK = 'doubleClick',
  LONG_PRESS = 'longPress',
  ENTER_VIEW = 'enterView',
  LEAVE_VIEW = 'leaveView',
}

export type HotAreaEventListenerTypes = ComponentEventListenerTypes;
export const HotAreaEventListenerTypes = ComponentEventListenerTypes;
