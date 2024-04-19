# 一、 `Chrome` 插件术语
> Chrome 插件由担任不同角色的组件组成。


## 1. 清单（`Manifest`）

`Chrome` 插件的清单是唯一且必须具有特定文件名的必需文件：**`manifest.json`**；

该文件列出了有关该插件的结构和行为的重要信息。

### 1.1 示例展示

```json
{
  "manifest_version": 3,
  "name": "My Chrome Extension",
  "version": "0.0.1",
  "description": "My Chrome Extension Description"
}
```

### 1.2 `manifest.json` 文件必需的字段

1.  `manifest_version`：用于指定插件使用的清单文件格式版本，目前是 3
2.  `name`：插件名称，一般情况下 `hover` 插件图标展示的文案也是 `name`
3.  `version`：插件版本

### 1.3 发布 `Chrome` 应用商店需要的字段

1.  `description`：插件描述
2.  `icons`：图标

![manifest](/image-7.png)

1.  `name`
2.  `version`
3.  `description`
4.  `icons`

## 2. 操作项（`Action`）

控制插件在 `Chrome` 浏览器工具栏中的图标。

### 2.1 示例
```json
{
  "manifest_version": 3,
  "name": "My Chrome Extension",
  "version": "0.0.1",
  "description": "My Chrome Extension Description",
  "icons": {
    "16": "icons/icon_16.png",
    "32": "icons/icon_32.png",
    "48": "icons/icon_48.png",
    "128": "icons/icon_128.png"
  },
  "action": {
    "default_icon": "icons/icon.png",
    "default_title": "Popup Title",
    "default_popup": "popup.html"
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    *{
      padding: 0;
      margin: 0;
    }
    div{
      width: 300px;
      height: 300px;
      text-align: center;
      line-height: 300px;
      background: gray;
    }
  </style>
</head>
<body>
  <div>popup html</div>
</body>
</html>
```

### 2.2 `Action` 字段

![action](/image-8.png)

1.  `default_icon`：工具栏展示的图片
2.  `default_title`：`hover` 插件图标展示的文案
3.  `default_popup`：点击图标弹出的页面

## 3. 背景（`Background - Service Worker`）

`Service Worker` 在后台运行并处理浏览器事件

> 在 `V3` 中使用 `service worker` 替换 `background` 页面

### 3.1 `Background` 在 `manifest V2 V3` 版本中的不同之处

1.  `V2` 版本 `background`

```json
{
  "background": {
    "scripts": [
      "backgroundContextMenus.js",
      "backgroundOauth.js"
    ],
    "persistent": false
  },
}
```

2.  `V3` 版本 `background`

```json
{
  "background": {
    "service_worker": "service_worker.js",
    "type": "module"
  }
}
```

### 3.2 示例

在上面的 `Action` 示例中添加以下代码

```json
"background": {
  "service_worker": "service_worker.js"
}
```

1.  激活 `Service Worker`

![active service worker](/image-9.png)

2.  终止 `Service Worker`

![kill service worker](/image-10.png)

### 3.3 终止 `Service Worker`

1.  无操作 30 秒后。
2.  单个请求的处理用时超过 5 分钟。
3.  `fetch` 响应的传递时间超过 30 秒时。

### 3.4 `Service Worker DevTools`

点击 `Chrome Service Worker` 即可弹出 `DevTools`
![click service worker](/image-11.png)

![service worker dev tools](/image-12.png)

## 4. 内容脚本（`Content scripts`）

在网页环境中运行 `JavaScript` 或 `CSS`。
通过 `content_scripts` 进行注册。

### 4.1 示例

1.  在上面的 `Service Worker` 示例中添加以下代码

```json
"content_scripts": [
  {
    "matches": ["https://www.taobao.com/"],
    "js": ["content_scripts.js"]
  }
]
```

2.  `content_scripts.js` 文件代码

```typescript
console.log('this is content scripts')
```

### 4.2 页面注入

1.  打开 <https://www.taobao.com/>，并打开控制台

![content scripts](/image-13.png)

2.  点击 `content_scripts.js`

![content script source](/image-14.png)


# 二、`Chrome` 插件核心概念
## 1. `Service Worker`
`Service Worker (service-worker.js)` 是一种基于事件的脚本，在浏览器后台运行。

它通常用于处理数据、协调插件不同部分中的任务，以及用作插件的事件管理器。

示例

```json
{
  "background": {
    "service_worker": "service_worker.js",
    "type": "module"
  }
}
```

## 2. `Permissions` 权限

若要使用插件 API 和功能，必须在 `manifest.json` 的权限字段中声明意图。

插件可以请求使用相应键指定的以下类别的权限：

- `permissions`
  - 包含已知字符串列表中的项(后面章节会细讲)
- `optional_permissions`
  - 由用户在运行时（而不是在安装时）授予
- `content_scripts.matches`
  - 包含一个或多个匹配模式，允许内容脚本注入到一个或多个主机中
- `host_permissions`
  - 包含一个或多个匹配格式，可授予对一个或多个主机的访问权限
- `optional_host_permissions`
  - 由用户在运行时（而不是在安装时）授予

示例
```json
{
  "permissions": [
    "activeTab",
    "contextMenus",
    "storage"
  ],
  "optional_permissions": [
    "topSites",
  ],
  "host_permissions": [
    "https://www.developer.chrome.com/*"
  ],
  "optional_host_permissions":[
    "https://*/*",
    "http://*/*"
  ]
}
```

## 3. `Message passing`（消息传递）

任一端都可以监听另一端发送的消息，并在同一通道上做出响应

- 一次性请求
  - `runtime.sendMessage()` 或 `tabs.sendMessage()` 发送消息，`runtime.onMessage` 监听消息
- 长期有效的连接
  - `runtime.connect()` 或 `tabs.connect() ` 发送消息，`runtime.onConnect` 监听消息
- 与其他插件进行通信
  - `runtime.sendMessage` 或 `runtime.connect` 发送消息，`runtime.onMessageExternal` 或 `runtime.onConnectExternal` 监听消息
- 接收从网页发送的消息
  - `manifest.json` 中使用 `externally_connectable` 指定与哪些网站通信
- 原生消息传递
  - 启用插件即可与原生应用交换消息

## 4. `Storage` 存储空间

`Chrome` 插件有一个专门的 `Storage API`，适用于所有插件组件

`Storage API` 提供一种特定于插件的方法来保留用户数据和状态

`manifest.json` 中需要 `storage` 权限
```json
"permissions": [
  "storage"
]
```

主要功能：
- 所有插件上下文都可以访问 `Storage API`
- 可序列化的 `JSON` 值存储为对象属性
- `Storage API` 是异步的，支持批量读取和写入操作
- 即使用户清除缓存和浏览记录，这些数据仍会保留
- 即使在无痕模式拆分后，存储的设置也会保留
- 包含一个用于企业政策的专属只读代管式存储区域

## 5. `Cookie`

`Cookie` 提供了一种存储与特定网域和路径相关联的键值对的方法

插件页面无法使用需要 `Secure` 属性的其他 `Cookie` 属性

`chrome.cookies` 不支持分区，因此它的所有方法都会从所有分区读取和写入 `Cookie`

`manifest.json` 中需要 `cookies` 权限
```json
"permissions": [
  "cookies"
]
```

## 6. `Offscreen documents`（屏外文档）
使用 chrome.offscreen 创建和管理屏外文档

`manifest.json` 中需要 `offscreen` 权限
```json
"permissions": [
  "offscreen"
]
```

屏外文档与普通页面的区别：
- 屏幕外文档的网址必须是与插件名捆绑的静态 `HTML` 文件
- 无法聚焦屏幕外的文档
- 屏幕外文档是 `window` 的实例，但其 `opener` 属性的值始终为 `null`
- 虽然一个插件软件包可以包含多个屏幕外文档，但一个已安装的插件一次只能打开一个

## 7. `Cross origin isolation` 跨域隔离

跨域隔离使网页可以使用 `SharedArrayBuffer` 等强大的功能

插件可以通过为 `cross_origin_embedder_policy` 和 `cross_origin_opener_policy` 清单键指定适当的值来选择启用跨域隔离

```json
"cross_origin_embedder_policy": {
  "value": "require-corp"
},
"cross_origin_opener_policy": {
  "value": "same-origin"
}
```
