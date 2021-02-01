/* eslint-disable max-lines */
import * as path from 'path';
import { DSL } from '@vize/types';
import Generator from '../src';

const dsl = {
  pageKey: 'test',
  container: { lib: 'universal', name: 'universal' },
  global: {
    globalProps: {},
    globalStyle: {
      margin: { top: 11, right: 0, bottom: 0, left: 0 },
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      border: { type: 'none', color: '#161616', width: 1 },
      background: { color: '#ffffff', image: '', size: 'auto', position: 'center top', repeat: 'repeat-y' },
    },
    metaInfo: {
      id: 1,
      key: 'test',
      isTemplate: false,
      isEditor: false,
      title: 'vize page',
      desc: '',
      duration: null,
      expiredJump: '',
    },
  },
  pageInstances: [
    {
      key: 1,
      name: '我的',
      path: '1',
      isHome: true,
      componentInstances: [
        {
          key: 22,
          component: 'universal_text',
          lib: 'universal',
          data: { text: '输入文本内容...' },
          style: {},
          commonStyle: {
            size: { autoWidth: true, width: 200, autoHeight: true, height: 80 },
            transform: { rotate: 0, opacity: 1, scale: 1, radius: 0 },
            text: { color: '#161616', fontSize: 14, lineHeight: 20, textAlign: 'center', weight: 'normal' },
            border: { type: 'none', color: '#161616', width: 1 },
            background: { color: 'transparent', image: '', size: 'auto', position: 'center top', repeat: 'repeat-y' },
            margin: { top: 63, left: 0, bottom: 12, right: 0 },
            padding: { top: 0, left: 8, bottom: 0, right: 8 },
            zIndex: true,
            position: true,
          },
          wrapperStyle: {},
          events: [],
          shared: false,
        },
      ],
    },
    {
      key: 2,
      name: '看点',
      path: '2',
      isHome: false,
      componentInstances: [
        {
          key: 23,
          component: 'universal_image',
          lib: 'universal',
          data: { src: 'https://img.alicdn.com/tfs/TB1PibhR4D1gK0jSZFsXXbldVXa-512-416.png' },
          style: {},
          commonStyle: {
            size: { autoWidth: true, width: 200, autoHeight: true, height: 80 },
            transform: { rotate: 0, opacity: 1, scale: 1, radius: 0 },
            border: { type: 'none', color: '#161616', width: 1 },
            margin: { top: 75, left: 'auto', bottom: 0, right: 'auto' },
            padding: { top: 0, left: 0, bottom: 0, right: 0 },
            zIndex: true,
            position: true,
          },
          wrapperStyle: {
            background: { color: 'transparent', image: '', size: 'auto', position: 'center top', repeat: 'repeat-y' },
          },
          events: [],
          hotAreas: [],
          shared: false,
        },
      ],
    },
    {
      key: 3,
      name: '俱乐部',
      path: '3',
      isHome: false,
      componentInstances: [
        {
          key: 24,
          component: 'universal_text',
          lib: 'universal',
          data: { text: '233fdsfsad' },
          style: {},
          commonStyle: {
            size: { autoWidth: true, width: 200, autoHeight: true, height: 80 },
            transform: { rotate: 0, opacity: 1, scale: 1, radius: 0 },
            text: { color: '#161616', fontSize: 14, lineHeight: 20, textAlign: 'center', weight: 'normal' },
            border: { type: 'none', color: '#161616', width: 1 },
            background: { color: 'transparent', image: '', size: 'auto', position: 'center top', repeat: 'repeat-y' },
            margin: { top: 84, left: 0, bottom: 12, right: 0 },
            padding: { top: 0, left: 8, bottom: 0, right: 8 },
            zIndex: true,
            position: true,
          },
          wrapperStyle: {},
          events: [],
          shared: false,
        },
      ],
    },
  ],
  pluginInstances: [],
  sharedComponentInstances: [
    {
      key: 19,
      component: 'universal_containerwithtitle',
      lib: 'universal',
      data: {},
      style: {},
      commonStyle: { position: { top: 0, left: 0, bottom: 0, right: 0, outset: 'BottomLeft' } },
      wrapperStyle: {},
      events: [],
      shared: true,
      children: [
        {
          key: 20,
          component: 'universal_text',
          lib: 'universal',
          data: { text: '输入文本内容...' },
          style: {},
          commonStyle: {
            size: { autoWidth: true, width: 200, autoHeight: true, height: 80 },
            transform: { rotate: 0, opacity: 1, scale: 1, radius: 0 },
            text: { color: '#161616', fontSize: 14, lineHeight: 20, textAlign: 'center', weight: 'normal' },
            border: { type: 'none', color: '#161616', width: 1 },
            background: { color: 'transparent', image: '', size: 'auto', position: 'center top', repeat: 'repeat-y' },
            margin: { top: 12, left: 0, bottom: 12, right: 0 },
            padding: { top: 0, left: 8, bottom: 0, right: 8 },
            zIndex: true,
            position: true,
          },
          wrapperStyle: {},
          events: [],
          shared: false,
        },
        {
          key: 21,
          component: 'universal_text',
          lib: 'universal',
          data: { text: '输入文本内容...' },
          style: {},
          commonStyle: {
            size: { autoWidth: true, width: 200, autoHeight: true, height: 80 },
            transform: { rotate: 0, opacity: 1, scale: 1, radius: 0 },
            text: { color: '#161616', fontSize: 14, lineHeight: 20, textAlign: 'center', weight: 'normal' },
            border: { type: 'none', color: '#161616', width: 1 },
            background: { color: 'transparent', image: '', size: 'auto', position: 'center top', repeat: 'repeat-y' },
            margin: { top: 12, left: 0, bottom: 12, right: 0 },
            padding: { top: 0, left: 8, bottom: 0, right: 8 },
            zIndex: true,
            position: true,
          },
          wrapperStyle: {},
          events: [],
          shared: false,
        },
      ],
    },
    {
      key: 25,
      component: 'universal_topnavigatorbar',
      lib: 'universal',
      data: {},
      style: {},
      commonStyle: { position: { top: 0, left: 0, bottom: 0, right: 0, outset: 'TopLeft' } },
      wrapperStyle: {},
      events: [],
      shared: true,
    },
  ],
  editInfo: {
    layoutMode: 'stream',
    pageMode: 'single',
    maxKeys: { page: 3, component: 25, 'hot-area': 1, plugin: 1, action: 1 },
  },
} as DSL;

// const generator = new WebPageGenerator({
//   dsl,
//   libsPath: path.resolve(__dirname, './libs'),
//   depsPath: path.resolve(__dirname, './deps'),
//   targetPath: path.resolve(__dirname, './dist'),
//   useSWC: false,
// });

const generator = Generator.generator({
  dsl,
  workspacePath: '/Users/huqingyang/Desktop/Proj/vize/packages/cgi/workspace',
  isPreview: false,
}).then(console.log);
