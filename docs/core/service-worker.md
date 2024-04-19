# `Service Worker`

插件 `Service Worker` 是插件的核心事件处理脚本。这使得它们与 `Web Service Worker` 明显不同

`Extension Service Worker` 与 `Web Service Worker` 有一些共同点。 `Service Worker` 在需要时加载，并在其进入休眠状态时取消加载。只要插件 `Service Worker` 在加载后还会主动接收事件，它就会运行，不过它可以关闭。与对应的 `Web` 应用一样， `Service Worker` 无法访问 `DOM`，不过可以根据需要将其用于 `offscreen`。

插件 `Service Worker` 不只是网络代理（因为经常会提到 `Web Service Worker`）。除了标准 `Service Worker` 事件之外，它们还会响应插件事件，例如导航到新页面、点击通知或关闭标签页。它们的注册和更新方式也与 `Web Service Worker` 不同。

## 一、注册 `Service Worker`

要注册 `Service Worker`，先在 `manifest.json` 文件的 `"background"` 字段中指定它。使用 `"service_worker"` 字段，该字段会指定单个 `JavaScript` 文件。

```josn
{
  "name": "Awesome Test Extension",
  "background": {
    "service_worker": "service-worker.js"
  },

}
```

## 二、导入脚本

将脚本导入 `Service Worker` 的方法有两种：`import` 语句和 `importScripts()` 方法。

如需使用 `import` 语句，请将 `"type"` 字段添加到 `manifest.json` 文件中并指定 `"module"`。

```json
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  }
```

然后，像往常一样使用 `import`。请注意，不支持导入断言。

```ts
import { tldLocales } from './locales.js';
```

像在 `Web Service Worker` 中一样使用 `importScripts()`。

```ts
importScripts('locales.js');
```

#### 1.1. 导入多个 `Service Worker` 模块

我们的 `Service Worker` 实现了两项功能。为了提高可维护性，我们将在单独的模块中实现每项功能。首先，我们需要在 `manifest.json` 文件中将 `Service Worker` 声明为一个 [`ES module`](https://web.dev/es-modules-in-sw/?hlen)，这样我们就可以将模块导入到 `Service Worker` 中：

1. `manifest.json`:

```json
{
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  },
}
```

2.  创建 `service-worker.js` 文件并导入两个模块：

```ts
import './sw-omnibox.js';
import './sw-tips.js';
```

3.  创建这些文件并为每个文件添加控制台日志。

- sw-omnibox.js:

```ts
console.log("sw-omnibox.js")
```


- sw-tips.js:
 

```ts
console.log("sw-tips.js")
```

## 三、更新

要更新 `Service Worker`，向 `Chrome` 应用商店发布新版本的插件。无法通过从服务器加载插件来解决此问题。出于安全原因，`Manifest V3` 不支持远程托管的代码。

**`Service Worker` 必须是插件软件包的一部分。**

## 四、`Service Worker` 事件

插件 `Service Worker` 同时支持标准 `Service Worker` 事件和插件 `API` 中的许多事件。

### 1. 声明插件事件

`Service Worker` 中的事件处理脚本需要在全局范围内声明，这意味着它们应该位于脚本的顶层，而不应嵌套在函数内。这样可以确保它们在脚本初始执行时同步注册，从而使 `Chrome` 能够在 `Service Worker` 启动后立即将事件分派给它。

```ts
chrome.action.onClicked.addListener(handleActionClick);

chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
  chrome.action.setBadgeText({ text: badgeText });
});
```

### 2. 常见事件

#### 2.1. `chrome.action`

当有用户与插件的工具栏图标互动时触发，无论该操作是针对特定网页（标签页）还是整个插件。

#### 2.2. `chrome.management`

提供与安装、卸载、启用和停用插件相关的事件。

#### 2.3. `chrome.notifications`

提供与用户与插件生成的系统通知互动相关的事件。

#### 2.4. `chrome.permissions`

指示用户何时授予或撤消插件权限。

#### 2.5. `chrome.runtime`

提供与插件生命周期相关的事件、插件的其他部分发送的消息，以及可用插件或 Chrome 更新的通知。

#### 2.6. `chrome.storage.onChanged`

每当任何 `StorageArea` 对象被清除或某个键的值被更改或设置时触发。请注意，每个 `StorageArea` 实例都有自己的 `onChanged` 事件。

#### 2.7. `chrome.webNavigation`

提供有关飞行中导航请求状态的信息。

### 3. 过滤 `Filter`

要将事件限制为特定用例，或消除不必要的事件调用，请使用支持事件过滤器的 `API`。例如，假设某个插件会监听 `tabs.onUpdated` 事件，以检测用户何时导航到特定网站。系统会在每个标签页上的每次导航时调用此事件。请改为搭配使用 `webNavigation.onCompleted` 和过滤条件。

```ts
const filter = {
  url: [
    {
      urlMatches: 'https://www.google.com/',
    },
  ],
};

chrome.webNavigation.onCompleted.addListener(() => {
  console.info("The user has loaded my favorite website!");
}, filter);
```

## 五、`Service Worker` 生命周期

### 1. 安装

当用户从 `Chrome` 应用商店安装或更新 `Service Worker`，或者用户使用 `chrome://extensions` 页面加载或更新已解压的插件时，就会发生安装。按以下顺序发生三个事件。

#### 1.1. `ServiceWorkerRegistration.install`

安装期间触发的第一个事件是 `Web Service Worker` 的 `install` 事件。

#### 1.2. `chrome.runtime.onInstalled`

接下来是该插件的 `onInstalled` 事件，当该插件（而不是 `Service Worker`）首次安装时、该插件更新到新版本以及 `Chrome` 更新到新版本时，都会触发该事件。使用此事件来设置状态或一次性初始化，例如上下文菜单。

```ts
chrome.runtime.onInstalled.addListener((details) => {
  if(details.reason !== "install" && details.reason !== "update") return;
  chrome.contextMenus.create({
    "id": "sampleContextMenu",
    "title": "Sample Context Menu",
    "contexts": ["selection"]
  });
});
```

#### 1.3. `ServiceWorkerRegistration.active`

最后，系统将触发 `Service Worker` 的 `activate` 事件。请注意，与 `Web Service Worker` 不同，此事件会在安装插件后立即触发，因为没有与插件中的页面重新加载相媲美的功能。

### 2. 插件启动

当 `user profile` 启动时，会触发 `chrome.runtime.onStartup` 事件，但不会调用任何 `Service Worker` 事件。

### 3. 闲置和关闭

通常，`Chrome` 会在满足以下条件之一时终止 `Service Worker`：

-   无操作 30 秒后。收到事件或调用插件 `API` 会重置此计时器。
-   单个请求（例如事件或 API 调用）的处理用时超过 5 分钟。
-   当 `fetch()` 响应的传递时间超过 30 秒时。

事件和对插件 API 的调用会重置这些计时器，如果 `Service Worker` 已休眠，传入事件将使它们恢复。应该将 `Service Worker` 设计为能够灵活应对意外终止。

### 4. 保存数据

如果 `Service Worker` 关闭，设置的任何全局变量都将丢失。将值保存到存储空间，而不是使用全局变量。请注意，`Web Storage API` 不适用于插件 `Service Worker`。

#### 4.1. `chrome.storage API`

一种插件 `API`，提供多种存储类型；本地存储、会话存储、托管（网域）和同步存储。此 `API` 用于存储使用开发者定义的密钥识别和检索的 `JSON` 对象。当用户清除网页缓存时，此类存储空间不会移除。

#### 4.2. `IndexedDB API`

用于在客户端存储结构化数据（包括文件和 `blob`）的低级别 `API`。此 `API` 提供了用于创建事务型数据存储和检索的原语。虽然此 `API` 通常对于简单的使用场景而言过于复杂，但在此基础上构建了许多第三方存储解决方案。

#### 4.3. `CacheStorage API`

请求和响应对象对的永久性存储机制。此 API 专为 Web Service Worker 设计，用于从端点检索数据。可通过多种方式使用此 API，具体取决于用户是否查看最新数据及其重要性。有关详情，请参阅[离线指南](https://web.dev/articles/offline-cookbook?hlen)。除非专门通过提取处理程序来代理网络请求，否则应使用 chrome.storage。

