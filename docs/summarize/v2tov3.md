# 一、Chrome 插件 V2 迁移至 V3 版本

## 一、`Manifest V3`

### 1. 什么是 `Manifest V3`

Manifest V3 是最新版插件平台。对可用的 API 做出了一些更改，并添加了一些新功能。

### 2. `Manifest V3` 目标

Manifest V3 旨在成为我们的平台愿景的第一步，加强插件的隐私保护、安全性和性能。随着平台的变化，也在努力让用户更好地了解和控制哪些插件的功能。

## 二、`Manifest V2` 支持时间表

`Chrome` 浏览器官方已经给出确定的时间来弃用 `V2` 版本的插件了。

> 最早从 **2024 年 6 月**的 `Chrome` 127 开始，我们将开始停用 Chrome 的不稳定版本（开发者版、`Canary` 版和 `Beta` 版）中的 `Manifest V2` 插件。受此变化影响的用户会在浏览器中看到 `Manifest V2` 插件自动停用，并且无法再从 `Chrome` 应用商店安装 `Manifest V2` 插件。此外，`Manifest V2` 插件在 `Chrome` 应用商店中将不再拥有“精选”徽章（如果目前已有该徽章）。

> 如果企业如果使用 `ExtensionManifestV2Availability` 政策确保其组织中的 `Manifest V2` 插件能持续正常运行，则其组织中还有一年的时间（即在 2025 年 6 月之前）迁移 `Manifest V2` 插件。在此之前，已启用此政策的浏览器不会受到弃用安排的影响。

> 如果插件发布商目前仍在发布 `Manifest V2` 插件，我们强烈建议您在 2024 年 6 月之前完成向 `Manifest V3` 的迁移。

> 官方时间线

### 1、2022 年 6 月：`Chrome` 应用商店 - 不再有新的专用插件

`Chrome` 应用商店不再接受公开范围设为“不公开”的新 `Manifest V2` 插件。

### 2、2024 年 6 月：在稳定发布前弃用 `Chrome MV2`

### 3、2024 年 6 月 + 1-X 个月：弃用 `Chrome MV2` 并稳定发布

### 4、2025 年 6 月：`Chrome MV2` 弃用（企业版）

# 二、`Manifest V3` 迁移核对列表

## 1、`Manifest.json` 文件

### 1. 更新 `manifest_version` 版本号

将 `manifest_version` 字段的值从 2 更改为 3。

```json
{
  "manifest_version": 3
}
```

### 2. 更新 `permissions` 和 `host_permissions` 字段

`Manifest V3` 中的主机权限是一个单独的字段；

不需要在 `permissions` 或 `optional_permissions` 中指定这些权限；

有单独的字段 `host_permissions` 来表示。

#### 2.1. `V2` 版本

```json
{
  "permissions": [
    "tabs",
    "bookmarks",
    "https://www.blogger.com/",
  ],
  "optional_permissions": [
    "unlimitedStorage",
    "*://*/*",
  ]
}
```

#### 2.2. `V3` 版本

```json
{
  "permissions": [
    "tabs",
    "bookmarks"
  ],
  "optional_permissions": [
    "unlimitedStorage"
  ],
  "host_permissions": [
    "https://www.blogger.com/",
  ],
  "optional_host_permissions": [
    "*://*/*",
  ]
}
```

### 3. 更新 `web_accessible_resources` 字段

`Manifest V3` 会限制哪些网站和插件可以访问插件中的资源，以此来限制数据公开范围；

在 `Manifest V2` 中，默认情况下，指定资源可供所有网站访问；

在下面的 `Manifest V3` 示例中，这些资源仅可供匹配的网站使用，而只有某些图片可供所有网站使用。

#### 3.1. `V2` 版本

```json
{
  "web_accessible_resources": [
    "images/*",
    "style/extension.css",
    "script/extension.js"
  ],
}
```

#### 3.2. `V3` 版本

```json
{
    "web_accessible_resources": [
    {
      "resources": [
        "images/*"
      ],
      "matches": [
        "*://*/*"
      ]
    },
    {
      "resources": [
        "style/extension.css",
        "script/extension.js"
      ],
      "matches": [
        "https://example.com/*"
      ]
    }
  ],
}
```

## 2、迁移到 `Service Worker`

使用 `service worker` 替换 `background` 或 `event pages`，以确保后台代码远离主线程，这样可以让插件仅在需要时运行，从而节省资源。

### 1. `Background` 和 `Service Worker` 之间的区别

#### 1.1. `Service Worker` 和 `background` 之间的差异

- 在主线程以外运行，这意味着不会干扰插件内容；
- 具有特殊功能，例如拦截插件来源上的提取事件，例如拦截工具栏弹出式窗口中的提取事件；
- 可以通过客户端界面与其他上下文进行通信和交互。

#### 1.2. 改动点

- 由于它们无法访问 `DOM` 或 `window` 接口，因此需要将此类调用移至其他 `API` 或移至屏幕外文档中；
- 不应注册事件监听器来响应返回的 `promise` 或在事件回调内部；
- 不向后兼容 `XMLHttpRequest()`，因此需要将接口的调用替换为 `fetch()`；
- 由于它们在不使用时终止，因此需要保留应用状态，而不是依赖于全局变量；
- 终止 `Service Worker` 还可以在计时器完成之前结束计时器。需要将其替换为 `alarms`。

### 2. 更新 `manifest.json` 中的 `background` 字段

在 `Manifest V3` 中，background 页面被 `Service Worker` 所取代：

- 将 `manifest.json` 中的 `"background.scripts"` 替换为 `"background.service_worker"`；
- `"service_worker"` 字段接受**字符串**，而不是字符串数组；
- 从 `manifest.json` 中移除 `"background.persistent"`。

#### 2.1. `V2` 版本

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

#### 2.2. `V3` 版本

```
{
  "background": {
    "service_worker": "service_worker.js",
    "type": "module"
  }
}
```

`"service_worker"` 字段接受单个字符串。只有使用 `ES module` （使用 `import` 关键字）时，才需要 `"type"` 字段。其值将始终为 `"module"`。

### 3. 将 `DOM` 和 `window` 调用移至屏幕外文档

某些插件需要访问 `DOM` 和 `window` 对象，无需打开新的窗口或标签页。`Offscreen API` 支持这类使用情形，因为这类 `API` 可以打开和关闭与插件打包在一起的未显示文档，而不会干扰用户体验。除了消息传递之外，屏幕外文档不会与其他插件上下文共享 `API`，而是起到完整网页的作用，供插件进行互动。

如需使用 `Offscreen API`，请通过 `Service Worker` 创建屏幕外文档。

```ts
chrome.offscreen.createDocument({
  url: chrome.runtime.getURL('offscreen.html'),
  reasons: ['CLIPBOARD'],
  justification: 'testing the offscreen API',
});
```

### 4. 将 `localStorage` 转换为其他类型

`Web` 平台的 `Storage` 接口（可从 `window.localStorage` 访问）无法在 `Service Worker` 中使用。

请使用 `chrome.storage.local`

### 5. 同步注册监听器

异步注册监听器（例如在 `promise` 或 `callback` 中）注册并不一定能在 `Manifest V3` 中有效。

#### 5.1. `V2` 版本

```ts
chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.browserAction.setBadgeText({ text: badgeText });
  chrome.browserAction.onClicked.addListener(handleActionClick);
});
```

在 `Manifest V3` 中，系统会在分派事件时重新初始化 `Service Worker`。这意味着当事件触发时，系统不会注册监听器（因为它们是异步添加的），系统还会错过事件。

#### 5.2. `V3` 版本

改为将事件监听器注册移至脚本的顶层。这样可以确保 `Chrome` 能够立即找到并调用操作的点击处理程序，即使插件尚未执行其启动逻辑也是如此。

```ts
chrome.action.onClicked.addListener(handleActionClick);

chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.action.setBadgeText({ text: badgeText });
});
```

### 6. 将 `XMLHttpRequest()` 替换为全局 `fetch()`

无法从 `Service Worker`、插件或其他方法调用 `XMLHttpRequest()`。将后台脚本对 `XMLHttpRequest()` 的调用替换为对 `fetch()` 的调用。

```ts
const response = await fetch('https://www.example.com/greeting.json');
console.log(response.statusText);
```

### 7. 保存状态

`Service Worker` 是临时的，这意味着它们可能会在用户的浏览器会话期间反复启动、运行和终止。这也意味着，自之前的上下文销毁后，数据并非立即在全局变量中可用。如需解决此问题，请使用存储 `API`。

对于 `Manifest V3` 来说，要将全局变量替换为对 `Storage API` 的调用。

```ts
chrome.runtime.onMessage.addListener(({ type, name }) => {
  if (type === "set-name") {
    chrome.storage.local.set({ name });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  const { name } = await chrome.storage.local.get(["name"]);
  chrome.tabs.sendMessage(tab.id, { name });
});
```

### 8. 把计时器/定时器替换为 `alarms`

`setTimeout()` 或 `setInterval()` 在 `Web` 开发中比较常见。不过，在 `Service Worker` 中可能会失败，因为每当 `Service Worker` 终止时，计时器就会取消。

#### 8.1. `V2` 版本

```ts
// 3 minutes in milliseconds
const TIMEOUT = 3 * 60 * 1000;
setTimeout(() => {
  chrome.action.setIcon({
    path: getRandomIconPath(),
  });
}, TIMEOUT);
```

#### 8.2. `V3` 版本

```ts
async function startAlarm(name, duration) {
  await chrome.alarms.create(name, { delayInMinutes: 3 });
}

chrome.alarms.onAlarm.addListener(() => {
  chrome.action.setIcon({
    path: getRandomIconPath(),
  });
});
```

## 3、`API` 调用

### 1. 将 `tab.executeScript()` 替换为 `scripting.executeScript()`

在 `Manifest V3` 中，`executeScript()` 从 `tabs API` 移至 `scripting` `API`。这就需要在实际的代码更改的基础上更改 `manifest.json` 文件中的权限。

对于 `executeScript()` 方法：

- `"scripting"` 权限；
- `host permissions` 权限或 `"activeTab"` 权限。

`scripting.executeScript()` 方法与其使用 `tabs.executeScript()` 的方式类似。但还是有一些区别。

- 旧方法只能接受一个文件，而新方法可以接受一组文件；
- 还将传递 `ScriptInjection` 对象，而不是 `InjectDetails`。

#### 1.1. `V2` 版本

```ts
async function getCurrentTab() {/* ... */}
let tab = await getCurrentTab();

chrome.tabs.executeScript(
  tab.id,
  {
    file: 'content-script.js'
  }
);
```

> 代码在 `background` 脚本中

#### 1.2. `V3` 版本

```ts
async function getCurrentTab()
let tab = await getCurrentTab();

chrome.scripting.executeScript({
  target: {tabId: tab.id},
  files: ['content-script.js']
});
```

> 代码在 service worker 中

### 2. 将 `tab.insertCSS()` 和 `tab.removeCSS()` 替换为 `scripting.insertCSS()` 和 `scripting.removeCSS()`

在 `Manifest V3` 中，`insertCSS()` 和 `removeCSS()` 已从 `tabs API` 移至 `scriptingAPI`。不仅需要更改代码，还需要对 `manifest.json` 文件中的权限进行更改：

- `"scripting"` 权限；
- `host permissions` 权限或 `"activeTab"` 权限。

`scripting API` 上的函数与 `tabs` 上的函数类似。但还是有一些区别。

- 调用这些方法时，需要传递 `CSSInjection` 对象，而不是 `InjectDetails`；
- `tabId` 作为 `CSSInjection.target` 的成员（而不是方法参数）进行传递。

#### 2.1. `V2` 版本

```ts
chrome.tabs.insertCSS(tabId, injectDetails, () => {
  // callback code
});
```

> 代码在 `background` 脚本中

#### 2.2. `V3` 版本

```ts
const insertPromise = await chrome.scripting.insertCSS({
  files: ["style.css"],
  target: { tabId: tab.id }
});
// Remaining code. 
```

> 代码在 `service worker` 中

### 3. 将 `Browser Actions` 和 `Page Actions` 替换为 `Actions`

在 `Manifest V2` 中，`Browser Actions` 和 `Page Actions` 是两个单独的概念。虽然一开始他们扮演的角色不同，但随着时间的推移，它们之间的差异越来越小。在 `Manifest V3` 中，这些概念已整合到 `Action` `API` 中。这需要更改 `manifest.json` 和插件代码。

`Manifest V3` 中的操作与浏览器操作最为相似；不过，`action API` 不像 `pageAction` 那样提供 `hide()` 和 `show()`。如果仍需要页面操作，可以使用声明性内容模拟这些操作，也可以使用标签页 `ID` 调用 `enable()` 或 `disable()`。

#### 3.1. 将 `"browser_action"` 和 `"page_action"` 替换为 `"action"`

在 `manifest.json` 中，将 `"browser_action"` 和 `"page_action"` 字段替换为 `"action"` 字段

##### 3.1.1. `V2` 版本

```json
{
  "page_action": { ... },
  "browser_action": {
    "default_popup": "popup.html"
   }

}
```

##### 3.1.2. `V3` 版本

```json
{
  "action": {
    "default_popup": "popup.html"
  }
}
```

#### 3.2. 将 `BrowserAction API` 和 `pageAction API` 替换为 `Action API`

如果 `Manifest V2` 使用 `browserAction` 和 `pageAction API`，现在应使用 `action API`。

##### 3.2.1. `V2` 版本

```ts
chrome.browserAction.onClicked.addListener(tab => { ... });
chrome.pageAction.onClicked.addListener(tab => { ... });
```

##### 3.2.2. `V3` 版本

```ts
chrome.action.onClicked.addListener(tab => { ... });
```

### 4. 将 `callback` 替换为 `promise`

在 `Manifest V3` 中，许多插件 `API` 方法都会返回 `promise`。

为了实现向后兼容性，许多方法在添加 `promise` 支持后会继续支持回调。需要注意的是，不能在同一函数调用中同时使用这两者。如果传递回调，则函数不会返回 `promise`；如果希望返回 `promise`，则也不要传递回调。某些 `API` 功能（例如事件监听器）将继续需要回调。

如需从回调转换为 `promise`，请移除回调并处理返回的 `promise`。

#### 4.1. `Callback`

```ts
chrome.permissions.request(newPerms, (granted) => {
  if (granted) {
    console.log('granted');
  } else {
    console.log('not granted');
  }
});
```

#### 4.2. `Promise`

```ts
const newPerms = { permissions: ['topSites'] };
chrome.permissions.request(newPerms)
.then((granted) => {
  if (granted) {
    console.log('granted');
  } else {
    console.log('not granted');
  }
});
```

### 5. 替换需要 `Manifest V2 background` 上下文的函数

其他插件上下文只能使用消息传递与插件 `Service Worker` 交互。因此，需要替换需要后台上下文的调用，具体而言：
- `chrome.runtime.getBackgroundPage()`
- `chrome.extension.getBackgroundPage()`
- `chrome.extension.getExtensionTabs()`

插件脚本应使用消息传递在 `Service Worker` 和插件的其他部分之间进行通信。目前，这需要使用 `sendMessage()`，并在插件 `Service Worker` 中实现 `chrome.runtime.onMessage`。从长远来看，应计划将这些调用替换为 `postMessage()` 和 `Service Worker` 的消息事件处理程序。

### 6. 替换不受支持的 `API`

需要在 `Manifest V3` 中更改下列方法和属性。

| `Manifest V2` 方法或属性                  | 替换为 `Manifest V3` 方法或属性             |
| --------------------------------------- | ----------------------------------------------- |
| `chrome.extension.connect()`             | `chrome.runtime.connect()                `        |
| `chrome.extension.connectNative()`       | `chrome.runtime.connectNative()           `       |
| `chrome.extension.getExtensionTabs()`    | `chrome.extension.getViews()             `        |
| `chrome.extension.getURL()   `            | `chrome.runtime.getURL()  `                       |
| `chrome.extension.lastError `             | 如果方法返回 `promise`，请使用 `promise.catch()   `           |
| `chrome.extension.onConnect `             | `chrome.runtime.onConnect   `                     |
| `chrome.extension.onConnectExternal`      | `chrome.runtime.onConnectExternal`               |
| `chrome.extension.onMessage `             | `chrome.runtime.onMessage`                        |
| `chrome.extension.onRequest`              | `chrome.runtime.onRequest`                        |
| `chrome.extension.onRequestExternal `     | `chrome.runtime.onMessageExternal`                |
| `chrome.extension.sendMessage() `         | `chrome.runtime.sendMessage()`                    |
| `chrome.extension.sendNativeMessage()`    | `chrome.runtime.sendNativeMessage()`              |
| `chrome.extension.sendRequest() `         | `chrome.runtime.sendMessage() `                   |
| `chrome.runtime.onSuspend`（`background` 脚本） | 在插件 `Service Worker` 中不受支持。请改用 `beforeunload` 文档事件。 |
| `chrome.tabs.getAllInWindow() `           | `chrome.tabs.query()  `                           |
| `chrome.tabs.getSelected()`               | `chrome.tabs.query()  `                           |
| `chrome.tabs.onActiveChanged`             | `chrome.tabs.onActivated  `                       |
| `chrome.tabs.onHighlightChanged `         | `chrome.tabs.onHighlighted  `                     |
| `chrome.tabs.onSelectionChanged  `        | `chrome.tabs.onActivated  `                       |
| `chrome.tabs.sendRequest()`               | `chrome.runtime.sendMessage() `                   |
| `chrome.tabs.Tab.selected`                | `chrome.tabs.Tab.highlighted  `                   |

## 4、替换屏蔽 `Web` 请求监听器

`Manifest V3` 更改了插件处理网络请求修改的方式。插件会指定规则来描述在满足一组给定条件时要执行的操作，而不是拦截网络请求并在运行时使用 `chrome.webRequest` 更改请求。

`Web Request API` 和声明式网络请求 `API` 有很大的区别。需要根据用例重新编写代码，而不是将一个函数调用替换为另一个函数调用。

### 1. 更新 `permissions`

对 `manifest.json` 中的 `"permissions"` 字段进行以下更改。

- 如果不再需要观察网络请求，请移除 `"webRequest"` 权限；
- 将匹配模式从 `"permissions"` 移至 `"host_permissions"`。

需要根据使用场景添加其他权限。这些权限通过其支持的用例进行描述。

### 2. 创建声明性网络请求规则

如需创建声明性 `net` 请求规则，需要向 `manifest.json` 添加 `"declarative_net_request"` 对象。`"declarative_net_request"` 代码块包含指向规则文件的 `"rule_resource"` 对象数组。规则文件包含一组对象，用于指定操作以及调用这些操作的条件。

### 3. 常见使用场景

#### 3.1. 屏蔽单个网址

`Manifest V2` 中的一个常见用例是在后台脚本中使用 `onBeforeRequest` 事件来屏蔽网络请求。

##### 3.1.1. `Background` 脚本改为 `V3` 规则文件

###### 3.1.1.1. 规则文件
1. `rule.json`
```json
[
  {
    "id": 1,
    "priority": 1,
    "action": { "type": "block" },
    "condition": {
      "urlFilter": "||example.com",
      "resourceTypes": ["main_frame"]
    }
  }
]
```
2. 示例

![示例](/image-48.png)

3. `Manifest.json` 文件引入
```json
{
  "name": "URL Blocker",
  "version": "0.1",
  "manifest_version": 3,
  "description": "Uses the chrome.declarativeNetRequest API to block requests.",
  "background": {
    "service_worker": "service_worker.js"
  },
  "declarative_net_request": {
    "rule_resources": [
      {
        "id": "ruleset_1",
        "enabled": true,
        "path": "rules_1.json"
      }
    ]
  },
  "permissions": ["declarativeNetRequest", "declarativeNetRequestFeedback"]
}
```

###### 3.1.1.2. `V2` 版本

```ts
chrome.webRequest.onBeforeRequest.addListener((e) => {
    return { cancel: true };
}, { urls: ["https://www.example.com/*"] }, ["blocking"]);
```

###### 3.1.1.3. `V3` 版本

对于 `Manifest V3`，请使用 `"block"` 操作类型创建新的 `declarativeNetRequest` 规则。请注意示例规则中的 `"condition"` 对象。其 `"urlFilter"` 取代了传递给 `webRequest` 监听器的 `urls` 选项。`"resourceTypes"` 数组指定要屏蔽的资源的类别。

```json
[
  {
    "id" : 1,
    "priority": 1,
    "action" : { "type" : "block" },
    "condition" : {
      "urlFilter" : "||example.com",
      "resourceTypes" : ["main_frame"]
    }
  }
]
```

##### 3.1.2. 需要更新该插件的权限。

在 `manifest.json 中`，将 `"webRequestBlocking"` 权限替换为 `"declarativeNetRequest"` 权限。请注意，由于屏蔽内容不需要主机权限，因此该网址已从 `"permissions"` 字段中移除。

###### 3.1.2.1. `V2` 版本

```json
  "permissions": [
    "webRequestBlocking",
    "https://*.example.com/*"
  ]
```

###### 3.1.2.2. `V3` 版本

```json
"permissions": [
  "declarativeNetRequest",
]
```

#### 3.2. 重定向多个网址

`Manifest V2` 中的另一个常见用例是使用 `BeforeRequest` 事件重定向网络请求。

##### 3.2.1. `Background` 脚本改为 `V3` 规则文件

###### 3.2.1.1. `V2` 版本

```ts
chrome.webRequest.onBeforeRequest.addListener((e) => {
    console.log(e);
    return { redirectUrl: "https://developer.chrome.com/docs/extensions/mv3/intro/" };
  }, { 
    urls: [
      "https://developer.chrome.com/docs/extensions/mv2/"
    ]
  }, 
  ["blocking"]
);
```

###### 3.2.1.2. `V3` 版本

对于 `Manifest V3`，请使用 `"redirect"` 操作类型。与之前一样，`"urlFilter"` 会替换传递给 `webRequest` 监听器的 `url` 选项。请注意，在此示例中，规则文件的 `"action"` 对象包含一个 `"redirect"` 字段，其中包含要返回的网址，而不是要过滤的网址。

```json
[
  {
    "id" : 1,
    "priority": 1,
    "action": {
      "type": "redirect",
      "redirect": { "url": "https://developer.chrome.com/docs/extensions/mv3/intro/" }
    },
    "condition": {
      "urlFilter": "https://developer.chrome.com/docs/extensions/mv2/",
      "resourceTypes": ["main_frame"]
    }
  }
```

##### 3.2.2. 需要更改插件的权限

将 `"webRequestBlocking"` 权限替换为 `"declarativeNetRequest"` 权限。系统再次将这些网址从 `manifest.json` 移到了规则文件中。请注意，除了主机权限之外，重定向还需要 `"declarativeNetRequestWithHostAccess"` 权限。

###### 3.2.2.1. `V2` 版本

```json
  "permissions": [
    "webRequestBlocking",
    "https://developer.chrome.com/docs/extensions/*",
    "https://developer.chrome.com/docs/extensions/reference"
  ]
```

###### 3.2.2.2. `V3` 版本

```json
  "permissions": [
    "declarativeNetRequestWithHostAccess"
  ],
  "host_permissions": [
    "https://developer.chrome.com/*"
  ]
```

#### 3.3. 屏蔽 `Cookie`

在 `Manifest V2` 中，要屏蔽 `Cookie`，需要先拦截网络请求标头，然后再发送这些标头并移除特定的 `Cookie`。

##### 3.3.1. `Background` 脚本改为 `V3` 规则文件

###### 3.3.1.1. `V2` 版本

```ts
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    removeHeader(details.requestHeaders, 'cookie');
    return {requestHeaders: details.requestHeaders};
  },
  // filters
  {urls: ['https://*/*', 'http://*/*']},
  // extraInfoSpec
  ['blocking', 'requestHeaders', 'extraHeaders']);
```

###### 3.3.1.2. `V3` 版本

`Manifest V3` 也通过规则文件中的规则实现这一点。这次的操作类型为 `"modifyHeaders"`。该文件接受 `"requestHeaders"` 对象数组，用于指定要修改的标头以及如何修改这些标头。请注意，`"condition"` 对象仅包含 `"resourceTypes"` 数组。它支持的值与前面的示例相同。

```json
[
  {
    "id": 1,
    "priority": 1,
    "action": {
      "type": "modifyHeaders",
      "requestHeaders": [
        { "header": "cookie", "operation": "remove" }
      ]
    },
    "condition": {
      "urlFilter": "|*?no-cookies=1",
      "resourceTypes": ["main_frame"]
    }
  }
]
```

##### 3.3.2. 需要更新该插件的权限。

将 `"webRequestBlocking"` 权限替换为 `"declarativeNetRequest"` 权限。

###### 3.3.2.1. `V2` 版本

```json
  "permissions": [
    "webRequestBlocking",
    "https://developer.chrome.com/docs/extensions/*",
    "https://developer.chrome.com/docs/extensions/reference"
  ]
```

###### 3.3.2.2. `V3` 版本

```json
  "permissions": [
    "declarativeNetRequestWithHostAccess"
  ],
  "host_permissions": [
    "https://developer.chrome.com/*"
  ]
```