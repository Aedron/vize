import * as React from 'react';
import { message } from 'antd';
import { parseUrl } from 'query-string';
import { JsonSchemaProperties } from 'types';
import getDefaults from 'json-schema-defaults';
import { createSchema } from './create';

message.config({
    top: 60,
    duration: 2,
    maxCount: 3,
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

interface QueryParams {
    libs: string[];
    debugPorts: number[];
}

export function getQueryParams(): QueryParams {
    const {
        query: { libs, debugPorts },
    } = parseUrl(window.location.href);

    if (!libs) {
        throw new Error('No materials libs');
    }

    return {
        libs: libs
            .toString()
            .split(',')
            .map(i => i.trim()),
        debugPorts: debugPorts
            ? debugPorts
                  .toString()
                  .split(',')
                  .map(i => parseInt(i.trim(), 10))
            : [],
    };
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

export function injectGlobalReadonlyGetter(key: string, getter: () => any) {
    return injectReadonlyGetter(window, key, getter);
}

export function injectReadonly(target: object, key: string, value: any): void {
    if (target.hasOwnProperty(key)) {
        console.info(`Skip inject "${key}" on ${target.toString()}, it's already exists.`);
        return;
    }

    Object.defineProperty(target, key, {
        value,
        writable: false,
        configurable: false,
    });
}

export function injectReadonlyGetter(target: object, key: string, getter: () => any): void {
    if (target.hasOwnProperty(key)) {
        console.info(`Skip inject "${key}" on ${target.toString()}, it's already exists.`);
        return;
    }

    Object.defineProperty(target, key, {
        get: getter,
        configurable: false,
    });
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

export function getSchemaDefault(schema: JsonSchemaProperties) {
    return getDefaults(createSchema(schema));
}

export function preventSyntheticEvent<T = HTMLElement, E = Event>(e: React.SyntheticEvent<T, E> | Event) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

export function withPreventEvent<T = HTMLElement, E = Event>(action: Function) {
    return (e: React.SyntheticEvent<T, E> | Event) => {
        action();
        return preventSyntheticEvent(e);
    };
}

type ReactEventHandler<T> = (e: T) => void;
export function withPersistReactEvent<T extends React.BaseSyntheticEvent = React.SyntheticEvent>(
    handler: ReactEventHandler<T>,
): ReactEventHandler<T> {
    return (e: T) => {
        e.persist();
        return handler(e);
    };
}

export function getMaterialsIdentityName(libName: string, name: string) {
    return `${libName}_${name}`.toLocaleLowerCase();
}
