---
meta:
  - name: description
    content: 页面容器
  - name: keywords
    content: 开发 快速上手
---

# 开发页面容器

## 1. 创建页面容器

在物料库根目录下执行 `vize create-container MyFirstContainer`

## 2. 编辑容器表单

编辑 `src/containers/MyFirstContainer/config.ts`:

```ts
// 全局数据配置表单
// 将展示在编辑器全局属性编辑栏的【数据】Tab 中
const globalDataForm = {
  text: {
    title: '内容',
    description: '请输入内容',
    type: 'string',
    default: 'Hello Vize!',
  },
};

// 全局样式配置表单
// 将展示在编辑器全局属性编辑栏的【样式】Tab 中
const globalStyleForm = {
  backgroundColor: {
    title: '全局背景色',
    type: 'string',
    default: '#fff',
    'x-component': 'Color',
  },
};

// 页面数据配置表单
// 将展示在编辑器页面属性编辑栏的【数据】Tab 中
const pageDataForm = {
  text: {
    title: '内容',
    description: '请输入内容',
    type: 'string',
    default: 'Hello Vize Page!',
  },
};

// 页面样式配置表单
// 将展示在编辑器页面属性编辑栏的【样式】Tab 中
const pageStyleForm = {
  backgroundColor: {
    title: '页面背景色',
    type: 'string',
    'x-component': 'Color',
    default: '#fff',
  },
};


export default {
  info: { ... },
  globalDataForm,
  globalStyleForm,
  pageDataForm,
  pageStyleForm
}
```

## 3. 编辑容器模板

编辑 `src/containers/MyFirstContainer/index.html.ejs`:

```ejs
<!DOCTYPE html>
<!--【数据】表单的内容在模板中通过 `globalData` 获取-->
<!--【样式】表单的内容在模板中通过 `globalStyle` 获取-->
<!--在模板中通过 `meta` 获取页面元数据-->
<html>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <meta charset="utf-8"/>
        <meta name="format-detection" content="telephone=no"/>
        <meta
            name="viewport"
            content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no"
        />
        <title><%= meta.title %></title>
        <desc><%= meta.desc %></desc>
    </head>

    <body>
        <div id="vize-main-entry" style="background-color: <%= globalStyle.backgroundColor %>">
            <!-- DO NOT MODIFY! HTML_PLACEHOLDER -->
        </div>
    </body>
</html>
```

## 4. 编辑容器入口

编辑 `src/containers/MyFirstContainer/index.ts`:

```ts
// 全局【数据】表单的内容作为 data 传入入口函数
// 全局【样式】表单的内容作为 style 传入入口函数

// 可以在这里执行初始化操作，如引入全局样式、执行上报等

export default function({ render, data, style, meta }) {
  console.log(data.text);
  // 执行页面渲染
  render();
}
```
