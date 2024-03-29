import * as React from 'react';
import { message } from 'antd';
import { parseUrl } from 'query-string';
import { ComponentInstance, JsonSchemaProperties, MaterialsForm, Maybe } from '@vize/types';
import { createSchema } from 'libs';
import { editStore } from 'states';
import { i18n } from '@vize/i18n';
import getDefaults from 'json-schema-defaults';
import { isFunction } from './is';

message.config({
  top: 80,
  duration: 2,
  maxCount: 3,
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export function isMacOS() {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

export function isDev() {
  return import.meta.env.DEV;
}

export function isDebugMode() {
  const {
    debugPorts: [debugPort],
  } = editStore;
  return !!debugPort;
}

interface QueryParams {
  id: Maybe<number>;
  key: string;
  libs: string[];
  debugPorts: number[];
  container: string;
  playground?: string;
}

export function getQueryParams(): QueryParams {
  const { query } = parseUrl(window.location.href);
  const { id, key, libs, debugPorts, container, playground } = query;

  const requiredParams = ['libs', 'container'];
  if (!playground) {
    requiredParams.push('key');
  }
  for (const k of requiredParams) {
    if (!query[k]) {
      throw new Error(`Missing require params: "${k}"`);
    }
  }

  return {
    id: id ? parseInt(id as string, 10) : undefined,
    key: playground ? 'playground' : key!.toString(),
    libs: libs!
      .toString()
      .split(',')
      .map(i => i.trim()),
    debugPorts: debugPorts
      ? debugPorts
          .toString()
          .split(',')
          .map(i => parseInt(i.trim(), 10))
      : [],
    container: container!.toString(),
    playground: playground as string,
  };
}

// TODO: Refactor
export function getImageSrc({ data }: ComponentInstance): Maybe<string> {
  if ('src' in data) {
    if (Array.isArray(data.src)) {
      return data.src[0] as string;
    }
    return data.src as string;
  }
  return null;
}

export type PromiseResult<T> = Promise<[null, T] | [Error, null]>;

export function promiseWrapper<T>(p: Promise<T>): PromiseResult<T> {
  return new Promise(resolve => {
    try {
      p.then(i => resolve([null, i as T])).catch(e => resolve([e, null]));
    } catch (e) {
      resolve([e, null]);
    }
  });
}

export function wait(time: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, time));
}

export function downloadString(text: string, fileType: string, fileName: string) {
  const blob = new Blob([text], { type: fileType });

  const a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() {
    URL.revokeObjectURL(a.href);
  }, 1500);
}

export function getFormDefaultValue(form?: MaterialsForm) {
  return !form || isFunction(form) ? {} : getSchemaDefaultValue(form as JsonSchemaProperties);
}

export function getSchemaDefaultValue(schema: JsonSchemaProperties) {
  return getDefaults(createSchema(schema));
}

export function getHotAreaId(key: number): string {
  return `__vize-hotarea-wrapper-${key}`;
}

export function toggleFullScreen() {
  if (!!document.fullscreenElement) {
    return document.exitFullscreen();
  }
  return document.body.requestFullscreen();
}

export function withMessage(
  operation: (...args: any[]) => any,
  msg: string | (() => string),
  type: 'success' | 'warn' | 'error' | 'open' = 'open',
) {
  return () => {
    const content = typeof msg === 'string' ? msg : msg();
    message.destroy();
    if (type === 'open') {
      message.open({
        content,
        icon: React.createElement('span', {}),
        duration: 2,
        type: 'success',
      });
    } else {
      message[type](content);
    }
    return operation();
  };
}

export function camelize(str: string, upper = false) {
  const result = str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
  if (!upper) {
    return result;
  }
  return `${result[0].toUpperCase()}${result.substring(1)}`;
}

export function downloadFile(src: string, fileName: string) {
  const a = document.createElement('a');
  a.href = src;
  a.download = fileName;
  a.style.zIndex = '-1';
  a.style.position = 'fixed';

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(function() {
    URL.revokeObjectURL(a.href);
  }, 1500);
}

const protocolAndDomainRE = /^(?:\w+:)?\/\/(\S+)$/;
const localhostDomainRE = /^localhost[\:?\d]*(?:[^\:?\d]\S*)?$/;
const nonLocalhostDomainRE = /^[^\s\.]+\.\S{2,}$/;

export function isUrl(str: any): boolean {
  if (typeof str !== 'string') {
    return false;
  }

  const match = str.match(protocolAndDomainRE);
  if (!match) {
    return false;
  }

  const everythingAfterProtocol = match[1];
  if (!everythingAfterProtocol) {
    return false;
  }

  return localhostDomainRE.test(everythingAfterProtocol) || nonLocalhostDomainRE.test(everythingAfterProtocol);
}

export const unImplemented = withMessage(noop, i18n.t('This feature is still under development'), 'warn');
