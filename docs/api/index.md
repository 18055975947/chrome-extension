# `Chrome API` 概览

插件 `API` 有着丰富的功能，开发插件的时候，基本上都需要用到插件 `API`

## 一、插件 `API` 功能

插件 `API` 一般包含一个命名空间，用于执行插件工作的方法和属性，一般是 `manifest.json` 文件中的字段，许多 `API` 需要在文件中指定权限(`permissions`)

除非另有说明，否则插件 `API` 中的方法都是异步的，可以使用 `promise` 进行链式调用，或者用 `async await` 字段进行方法调用

## 二、插件 `API`

### 1. `accessibilityFeatures`
#### 1.1 功能

- 使用 `chrome.accessibilityFeatures API` 管理 `Chrome` 的无障碍功能

#### 1.2 所需权限
- `accessibilityFeatures.modify`
  - 如需获取功能状态，插件需要 `accessibilityFeatures.read` 权限
- `accessibilityFeatures.read`
  - 如需修改功能状态，插件需要 `accessibilityFeatures.modify` 权限

```json
{
  "name": "My extension",
  "permissions": [
    "accessibilityFeatures.modify",
    "accessibilityFeatures.read"
  ],
}
```

#### 1.3 属性
- `animationPolicy`: 枚举 动画策略
  - `allowed`
  - `once`
  - `none`
- `autoclick`: `boolean` 鼠标停止移动后自动点击鼠标功能是否已启用
- `caretHighlight`: `boolean` 插入符突出显示功能是否已启用
- `cursorColor`: `boolean` 光标颜色功能是否已启用，不表示颜色
- `cursorHighlight`: `boolean` 光标突出显示功能是否已启用
- `dictation`: `boolean` 语音功能是否启用
- `dockedMagnifier`: `boolean` 是否启用放大镜功能
- `focusHighlight`: `boolean` 焦点突出功能是否启用
- `highContrast`: `boolean` 高度对比渲染模式是否已启用
- `largeCursor`: `boolean` 放大光标功能是否启用
- `screenMagnifier`: `boolean` 全屏方法功能是否启用
- `selectToSpeak`: `boolean` 选择朗读功能是否启用
- `spokenFeedback`: `boolean` 语音反馈功能是否启用
- `stickyKeys`: `boolean` 固定辅助键功能是否启用
- `switchAccess`: `boolean` 开关控制功能是否启用
- `virtualKeyboard`: `boolean` 虚拟屏幕键盘功能是否启用

### 2. `action`
#### 2.1 功能
- 使用 `chrome.action API` 可控制插件在 `Google Chrome` 工具栏中的图标

#### 2.2 所需权限
- `action`

```json
{
  "name": "My extension",
  "permissions": [
    "action"
  ],
}
```

#### 2.3 `Demo`

```js
// 设置颜色
chrome.action.setBadgeBackgroundColor(
  {color: [0, 255, 0, 0]},
  () => { /* ... */ },
)
// 设置标记文字
chrome.action.setBadgeText()
// 点击监听
chrome.action.onClicked.addListener()
```

### 3. `alarms`
#### 3.1 功能
- 使用 `chrome.alarms API` 安排代码定期运行，或安排在未来指定时间运行
- 从 `Chrome 117` 开始，有效闹钟数量上限为 500 个。达到此上限后，`chrome.alarms.create()` 将失败
- 从 `Chrome 120` 开始，最小闹钟间隔已从 1 分钟缩短为 30 秒。如需让闹钟在 30 秒后触发，请设置 `periodInMinutes: 0.5`

#### 3.2 所需权限
- `alarms`

```json
{
  "name": "My extension",
  "permissions": [
    "alarms"
  ],
}
```

#### 3.3 `Demo`

```js
// 创建闹钟
chrome.alarms.create('demo-default-alarm', {
  delayInMinutes: 1,
  periodInMinutes: 1
});
```

### 4. `audio`
#### 4.1 功能
- `chrome.audio API` 是为了让用户能够了解和控制连接到系统的音频设备。此 `API` 目前仅适用于 `ChromeOS` 的自助服务终端模式
#### 4.2 所需权限
- `audio`
```json
{
  "name": "My extension",
  "permissions": [
    "audio"
  ],
}
```

#### 4.3 `Demo`
```js
// 获取音频设备列表
chrome.audio.getDevices()
// 监听音频设备变化
chrome.audio.onDeviceListChanged.addListener()
```

### 5. `bookmarks`
#### 5.1 功能
- 使用 `chrome.bookmarks API` 创建、整理书签以及以其他方式操纵书签
#### 5.2 所需权限
- `bookmarks`
```json
{
  "name": "My extension",
  "permissions": [
    "bookmarks"
  ],
}
```
#### 5.3 `Demo`

```js
// 创建书签/文件夹
chrome.bookmarks.create()
```

### 6. `browsingData`
#### 6.1 功能
- 使用 `chrome.browsingData API` 从用户的本地个人资料中移除浏览数据
#### 6.2 所需权限
- `browsingData`

```json
{
  "name": "My extension",
  "permissions": [
    "browsingData"
  ],
}
```
#### 6.2 `Demo`
```js
// 移除各类浏览记录
chrome.browsingData.remove()
```

### 7. `certificateProvider`
#### 7.1 功能
- 使用此 `API` 向平台公开证书，平台可以使用这些证书进行 `TLS` 身份验证
#### 7.2 所需权限
- `certificateProvider`
```json
{
  "name": "My extension",
  "permissions": [
    "certificateProvider"
  ],
}
```
#### 7.3 `Demo`
```js
// 设置要在浏览器中使用的证书列表
chrome.certificateProvider.setCertificates()
```

### 8. `commands`

#### 8.1 功能
- 使用 `Command API` 添加可在插件中触发操作的键盘快捷键
#### 8.2 所需权限
- `commands`
```json
{
  "name": "My extension",
  "permissions": [
    "commands"
  ],
}
```
#### 8.3 `Demo`
```js
// 快捷键键盘监听
chrome.commands.onCommand.addListener()
```

### 9. `contentSettings`

#### 9.1 功能
- chrome.contentSettings API 可用于更改相关设置，以控制网站是否可以使用 Cookie、JavaScript 和插件等功能
#### 9.2 所需权限
- `contentSettings`
```json
{
  "name": "My extension",
  "permissions": [
    "contentSettings"
  ],
}
```


### 10. `contextMenus`


#### 10.1 功能
- 使用 chrome.contextMenus API 向 Google Chrome 的上下文菜单添加项。可以选择要在上下文菜单中添加的对象的类型，例如图片、超链接和页面
#### 10.2 所需权限
- `contextMenus`
```json
{
  "name": "My extension",
  "permissions": [
    "contextMenus"
  ],
}
```
#### 10.3 属性
- `ACTION_MENU_TOP_LEVEL_LIMIT`: 6
  - 可以添加到插件操作上下文菜单的数量上限
#### 10.4 `Demo`
```js
// 创建菜单
chrome.contextMenus.create()
```

### 11. `Cookie`


#### 11.1 功能
- 使用 chrome.cookies API 查询和修改 Cookie，并在发生变化时收到通知
#### 11.2 所需权限
- `cookies`
```json
{
  "name": "My extension",
  "permissions": [
    "cookies"
  ],
}
```
#### 11.3 `Demo`
```js
// 获取单个 cookie
chrome.cookies.get()
// 获取所有 cookie
chrome.cookies.getAll()
```

### 12. `debugger`

#### 12.1 功能
- chrome.debugger API 可作为 Chrome 远程调试协议的替代传输协议
- 使用 chrome.debugger 附加到一个或多个标签页，以对网络交互进行插桩、调试 JavaScript、改变 DOM 和 CSS 等
- 使用 Debuggee tabId 可通过 sendCommand 定位标签页，并通过 tabId 从 onEvent 回调中路由事件
#### 12.2 所需权限
- `debugger`
```json
{
  "name": "My extension",
  "permissions": [
    "debugger"
  ],
}
```
#### 12.3 `Demo`
```js
// 将调试程序连接到给定目标
chrome.debugger.attach()
```


### 13. `declarativeContent`


#### 13.1 功能
- 使用 chrome.declarativeContent API 可根据网页内容执行操作，而无需读取网页内容的权限
#### 13.2 所需权限
- `declarativeContent`
```json
{
  "name": "My extension",
  "permissions": [
    "declarativeContent"
  ],
}
```
#### 13.3 `Demo`
```js
// 页面改变
chrome.declarativeContent.onPageChanged
```

### 14. `declarativeNetRequest`

#### 14.1 功能
- chrome.declarativeNetRequest API 用于通过指定声明性规则来屏蔽或修改网络请求
#### 14.2 所需权限
- `declarativeNetRequest`
  - 在安装时触发权限警告，但提供对 allow、allowAllRequests 和 block 规则的隐式访问
- `declarativeNetRequestWithHostAccess`
  - 在安装时不会显示权限警告，但必须先请求主机权限，然后才能对主机执行任何操作
- `declarativeNetRequestFeedback`
  - 为已解压的插件启用调试功能
- `declarativeNetRequest` 和 `declarativeNetRequestWithHostAccess` 权限提供相同的功能。它们之间的区别在于请求或授予权限的时间
```json
{
  "name": "My extension",
  "permissions": [
    "declarativeNetRequest",
    "declarativeNetRequestFeedback"
  ],
}
```


### 15. `desktopCapture`

#### 15.1 功能
- Desktop Capture API 可捕获屏幕、单个窗口或单个标签页的内容
#### 15.2 所需权限
- `desktopCapture`
```json
{
  "name": "My extension",
  "permissions": [
    "desktopCapture"
  ],
}
```
#### 15.3 `Demo`
```js
// 隐藏对话框
chrome.desktopCapture.cancelChooseDesktopMedia()
```


### 16. `devtools.inspectedWindow`

#### 16.1 功能
- 使用 chrome.devtools.inspectedWindow API 与检查的窗口进行交互：获取所检查页面的标签页 ID、在所检查窗口的上下文中评估代码、重新加载页面，或获取页面中的资源列表
#### 16.2 所需字段
需要在 `manifest.json` 中声明 `devtools_page` 才能使用此 `API`
```json
{
  "name": "My extension",
  "devtools_page": "devtools.html",
}
```
#### 16.3 `Demo`
```js
// 在新资源添加到检查的网页时触发
chrome.devtools.inspectedWindow.onResourceAdded.addListener()
```


### 17. `devtools.network`

#### 17.1 功能
- 使用 chrome.devtools.network API 检索开发者工具在“Network”面板中显示的网络请求的相关信息
#### 17.2 所需字段
需要在 `manifest.json` 中声明 `devtools_page` 才能使用此 `API`
```json
{
  "name": "My extension",
  "devtools_page": "devtools.html",
}
```
#### 17.3 `Demo`
```js
// 在网络请求完成且所有请求数据均可用时触发
chrome.devtools.network.onRequestFinished.addListener()
```

### 18. `devtools.panels`

#### 18.1 功能
- 使用 chrome.devtools.panels API 将插件集成到开发者工具窗口界面中：可以创建自己的面板、访问现有面板以及添加边栏
#### 18.2 所需字段
需要在 `manifest.json` 中声明 `devtools_page` 才能使用此 `API`
```json
{
  "name": "My extension",
  "devtools_page": "devtools.html",
}
```
#### 18.3 `Demo`
```js
// 创建程序面板
chrome.devtools.panels.create()
```


### 19. `devtools.recorder`

#### 19.1 功能
- 使用 chrome.devtools.recorder API 自定义开发者工具中的 `Recorder` 面板
#### 19.2 所需字段
需要在 `manifest.json` 中声明 `devtools_page` 才能使用此 `API`
```json
{
  "name": "My extension",
  "devtools_page": "devtools.html",
}
```
#### 19.3 `Demo`
```js
// 创建可以处理重放的视图
chrome.devtools.recorder.createView()
```


### 20. `dns`

#### 20.1 功能
- 使用此 `API` 向平台公开证书，平台可以使用这些证书进行 `TLS` 身份验证使用 chrome.dns API 进行 DNS 解析
#### 20.2 所需权限
- `dns`
```json
{
  "name": "My extension",
  "permissions": [
    "dns"
  ],
}
```
#### 20.3 `Demo`
```js
// 解析给定的主机名
chrome.dns.resolve()
```


### 21. `documentScan`

#### 21.1 功能
- 使用 chrome.documentScan API 从连接的纸质文件扫描器中发现和检索图片
#### 21.2 所需权限
- `documentScan`
```json
{
  "name": "My extension",
  "permissions": [
    "documentScan"
  ],
}
```
#### 21.3 `Demo`
```js
// 执行文档扫描
chrome.documentScan.scan()
```


### 22. `dom`

#### 22.1 功能
- 使用 chrome.dom API 访问插件的特殊 DOM API
#### 22.2 `Demo`
```js
chrome.dom.openOrClosedShadowRoot()
```


### 23. `downloads`

#### 23.1 功能
- 使用 chrome.downloads API 以编程方式启动、监控、操纵和搜索下载内容
#### 23.2 所需权限
- `downloads`
```json
{
  "name": "My extension",
  "permissions": [
    "downloads"
  ],
}
```
#### 23.3 `Demo`
```js
chrome.downloads.onChanged.addListener()
```


### 24. `enterprise.deviceAttributes`

#### 24.1 功能
- 使用 chrome.enterprise.deviceAttributes API 读取设备属性
#### 24.2 所需权限
- `enterprise.deviceAttributes`
```json
{
  "name": "My extension",
  "permissions": [
    "enterprise.deviceAttributes"
  ],
}
```
#### 24.3 `Demo`
```js
chrome.enterprise.deviceAttributes.getDeviceHostname()
```

### 25. `enterprise.hardwarePlatform`


#### 25.1 功能
- 使用 chrome.enterprise.hardwarePlatform API 获取运行浏览器的硬件平台的制造商和型号
#### 25.2 所需权限
- `enterprise.hardwarePlatform`
```json
{
  "name": "My extension",
  "permissions": [
    "enterprise.hardwarePlatform"
  ],
}
```
#### 25.3 `Demo`
```js
chrome.enterprise.hardwarePlatform.getHardwarePlatformInfo
```


### 26. `enterprise.networkingAttributes`

#### 26.1 功能
- 使用 chrome.enterprise.networkingAttributes API 读取有关当前网络的信息
#### 26.2 所需权限
- `enterprise.networkingAttributes`
```json
{
  "name": "My extension",
  "permissions": [
    "enterprise.networkingAttributes"
  ],
}
```
#### 26.3 `Demo`
```js
chrome.enterprise.networkingAttributes.getNetworkDetails()
```


### 27. `enterprise.platformKeys`

#### 27.1 功能
- 用 chrome.enterprise.platformKeys API 生成密钥并为这些密钥安装证书
#### 27.2 所需权限
- `enterprise.platformKeys`
```json
{
  "name": "My extension",
  "permissions": [
    "enterprise.platformKeys"
  ],
}
```
#### 27.3 `Demo`
```js
chrome.enterprise.platformKeys.challengeKey()
```


### 28. `events`

#### 28.1 功能
- chrome.events 可以在发生事件时进行通知


### 29. `extension`

#### 29.1 功能
- chrome.extension API 具有可供任何插件页面使用的实用程序。它还支持在插件与其内容脚本之间或插件之间交换消息


### 30. `extensionTypes`

#### 30.1 功能
- chrome.extensionTypes API 包含 Chrome 插件的类型声明


### 31. `fileBrowserHandler`

#### 31.1 功能
- 使用 chrome.fileBrowserHandler API 扩展 ChromeOS 文件浏览器
#### 31.2 所需权限
- `fileBrowserHandler`
```json
{
  "name": "My extension",
  "permissions": [
    "fileBrowserHandler"
  ],
}
```
#### 31.3 `Demo`
```js
chrome.fileBrowserHandler.onExecute.addListener()
```


### 32. `fileSystemProvider`

#### 32.1 功能
- 使用 chrome.fileSystemProvider API 创建可通过 ChromeOS 上的文件管理器访问的文件系统
#### 32.2 所需权限
- `fileSystemProvider`
```json
{
  "name": "My extension",
  "permissions": [
    "fileSystemProvider"
  ],
}
```
#### 32.3 `Demo`
```js
// 获取插件装载的所有文件系统
chrome.fileSystemProvider.getAll()
```


### 33. `fontSettings`

#### 33.1 功能
- 使用 chrome.fontSettings API 管理 Chrome 的字体设置
#### 33.2 所需权限
- `fontSettings`
```json
{
  "name": "My extension",
  "permissions": [
    "fontSettings"
  ],
}
```
#### 33.3 `Demo`
```js
// 字体设置变化时触发
chrome.fontSettings.onFontChanged.addListener()
```


### 34. `gcm`

#### 34.1 功能
- 使用 chrome.gcm 可让应用和插件通过 Firebase Cloud Messaging (FCM) 收发消息
#### 34.2 所需权限
- `gcm`
```json
{
  "name": "My extension",
  "permissions": [
    "gcm"
  ],
}
```
#### 34.3 属性
- `MAX_MESSAGE_SIZE`: 4096
  - 消息中所有键值对的大小
#### 34.4 `Demo`
```js
// 发送消息
chrome.gcm.send()
// 接收消息
chrome.gcm.onMessage.addListener
```


### 35. `history`

#### 35.1 功能
- 使用 chrome.history API 与浏览器的访问过网页记录进行交互
#### 35.2 所需权限
- `history`
```json
{
  "name": "My extension",
  "permissions": [
    "history"
  ],
}
```
#### 35.3 `Demo`
```js
// 添加历史记录
chrome.history.addUrl()
```


### 36. `i18n`

#### 36.1 功能
- 使用 chrome.i18n 基础架构在整个应用或插件中实现国际化
#### 36.2 用法
如果插件具有 `/_locales` 目录，则 `manifest.json` 必须定义 `default_locale`


### 37. `identity`

#### 37.1 功能
- 使用 chrome.identity API 获取 OAuth2 访问令牌
#### 37.2 所需权限
- `identity`
```json
{
  "name": "My extension",
  "permissions": [
    "identity"
  ],
}
```
#### 37.3 `Demo`
```js
// 获取 token 值
chrome.identity.getAuthToken()
```


### 38. `idle`

#### 38.1 功能
- 使用 chrome.idle API 检测机器的空闲状态何时发生变化
#### 38.2 所需权限
- `idle`
```json
{
  "name": "My extension",
  "permissions": [
    "idle"
  ],
}
```
#### 38.3 `Demo`
```js
chrome.idle.getAutoLockDelay()
chrome.idle.queryState()
```


### 39. `input.ime`

#### 39.1 功能
- 使用 chrome.input.ime API 为 Chrome 操作系统实现自定义 IME
#### 39.2 所需权限
- `input`
```json
{
  "name": "My extension",
  "permissions": [
    "input"
  ],
}
```
#### 39.3 `Demo`
```js
// 监听焦点离开文本框
chrome.input.ime.onBlur.addListener()
```


### 40. `instanceID`

#### 40.1 功能
- 使用 chrome.instanceID 访问实例 ID 服务
#### 40.2 所需权限
- `gcm`
```json
{
  "name": "My extension",
  "permissions": [
    "gcm"
  ],
}
```
#### 40.3 `Demo`
```js
chrome.instanceID.deleteID()
chrome.instanceID.getID()
```


### 41. `loginState`


#### 41.1 功能
- 使用 chrome.loginState API 读取和监控登录状态
#### 41.2 所需权限
- `loginState`
```json
{
  "name": "My extension",
  "permissions": [
    "loginState"
  ],
}
```
#### 41.3 `Demo`
```js
chrome.loginState.getProfileType()
chrome.loginState.getSessionState()
```


### 42. `management`

#### 42.1 功能
- chrome.management API 提供了管理已安装和正在运行的插件/应用列表的方法
#### 42.2 所需权限
- `management`
```json
{
  "name": "My extension",
  "permissions": [
    "management"
  ],
}
```
#### 42.3 `Demo`
```js
chrome.management.getAll()
chrome.management.get()
```


### 43. `notifications`

#### 43.1 功能
- 借助 chrome.notifications API，可以使用模板创建内容丰富的通知，并在系统任务栏中向用户显示这些通知
#### 43.2 所需权限
- `notifications`
```json
{
  "name": "My extension",
  "permissions": [
    "notifications"
  ],
}
```
#### 43.3 `Demo`
```js
// 创建消息通知
chrome.notifications.create()
```

### 44. `offscreen`

#### 44.1 功能
- 使用 offscreen API 创建和管理屏幕外文档
#### 44.2 所需权限
- `offscreen`
```json
{
  "name": "My extension",
  "permissions": [
    "offscreen"
  ],
}
```
#### 44.3 `Demo`
```js
// 创建新的屏幕外文档
chrome.offscreen.createDocument()
```


### 45. `omnibox`

#### 45.1 功能
- 多功能框 API 可在 Google Chrome 的地址栏（也称为多功能框）中注册关键字
#### 45.2 所需字段
需要在 `manifest.json` 中声明 `omnibox` 才能使用此 `API`
```json
{
  "name": "My extension",
  "omnibox": { "keyword" : "aaron" }
}
```
#### 45.3 `Demo`
```js
// 监听关键字输入会话
chrome.omnibox.onInputStarted.addListener()
```


### 46. `pageCapture`

#### 46.1 功能
- 使用 chrome.pageCapture API 可将标签页另存为 MHTML
#### 46.2 所需权限
- `pageCapture`
```json
{
  "name": "My extension",
  "permissions": [
    "pageCapture"
  ],
}
```
#### 46.3 `Demo`
```js
chrome.pageCapture.saveAsMHTML()
```

### 47. `permissions`

#### 47.1 功能
- 请使用 chrome.permissions API 在运行时（而不是安装时）请求声明的可选权限，以便用户了解需要相关权限的原因，并仅授予必要的权限
#### 47.2 所需字段
需要在 `manifest.json` 中声明 `permissions` 才能使用此 `API`
```json
{
  "name": "My extension",
  "permissions": []
}
```
#### 47.3 `Demo`
```js
chrome.permissions.getAll()
```


### 48. `platformKeys`

#### 48.1 功能
- 使用 chrome.platformKeys API 访问由平台管理的客户端证书
#### 48.2 所需权限
- `platformKeys`
```json
{
  "name": "My extension",
  "permissions": [
    "platformKeys"
  ],
}
```
#### 48.3 `Demo`
```js
chrome.platformKeys.getKeyPair()
```

### 49. `power`

#### 49.1 功能
- 使用 chrome.power API 可替换系统的电源管理功能
#### 49.2 所需权限
- `power`
```json
{
  "name": "My extension",
  "permissions": [
    "power"
  ],
}
```
#### 49.3 `Demo`
```js
chrome.power.releaseKeepAwake()
chrome.power.reportActivity()
```


### 50. `printerProvider`

#### 50.1 功能
- 使用此 `API` 向平台公开证书，平台可以使用这些证书进行 `TLS` 身份验证chrome.printerProvider API 提供打印管理器使用的事件，以便查询由插件控制的打印机、查询其功能以及向这些打印机提交打印任务
#### 50.2 所需权限
- `printerProvider`
```json
{
  "name": "My extension",
  "permissions": [
    "printerProvider"
  ],
}
```
#### 50.3 `Demo`
```js
// 监听打印机请求
chrome.printerProvider.onGetCapabilityRequested.addListener()
```
### 52. `printing`

#### 51.1 功能
- 使用 chrome.printing API 可将打印任务发送到 Chromebook 上安装的打印机
#### 51.2 所需权限
- `printing`
```json
{
  "name": "My extension",
  "permissions": [
    "printing"
  ],
}
```
#### 51.3 `Demo`
```js
chrome.printing.submitJob()
```


### 52. `printingMetrics`


#### 52.1 功能
- 使用 chrome.printingMetrics API 提取有关打印使用情况的数据
#### 52.2 所需权限
- `printingMetrics`
```json
{
  "name": "My extension",
  "permissions": [
    "printingMetrics"
  ],
}
```
#### 52.3 `Demo`
```js
chrome.printingMetrics.getPrintJobs()
```


### 53. `privacy`

#### 53.1 功能
- 使用 chrome.privacy API 来控制 Chrome 中可能会影响用户隐私的功能的使用
#### 53.2 所需权限
- `privacy`
```json
{
  "name": "My extension",
  "permissions": [
    "privacy"
  ],
}
```
#### 53.3 `Demo`
```js
chrome.privacy.services
```


### 54. `processes`

#### 54.1 功能
- 使用 chrome.processes API 与浏览器的进程进行交互
#### 54.2 所需权限
- `processes`
```json
{
  "name": "My extension",
  "permissions": [
    "processes"
  ],
}
```
#### 54.3 `Demo`
```js
chrome.processes.onCreated.addListener()
```


### 55. `proxy`

#### 55.1 功能
- 使用 chrome.proxy API 管理 Chrome 的代理设置
#### 55.2 所需权限
- `proxy`
```json
{
  "name": "My extension",
  "permissions": [
    "proxy"
  ],
}
```
#### 55.3 `Demo`
```js
chrome.proxy.onProxyError.addListener()
```


### 56. `readingList`

#### 56.1 功能
- 使用 chrome.readingList API 读取和修改阅读清单中的项
#### 56.2 所需权限
- `readingList`
```json
{
  "name": "My extension",
  "permissions": [
    "readingList"
  ],
}
```
#### 56.3 `Demo`
```js
chrome.readingList.addEntry()
```


### 57. `runtime`

#### 57.1 功能
- 使用 chrome.runtime API 检索 Service Worker，返回有关清单的详细信息，并监听和响应应用或插件生命周期中的事件

#### 57.2 所需权限
- 此 `API` 不需要任何权限

#### 57.3 `Demo`
```js
chrome.runtime.getManifest()
```


### 58. `scripting`

#### 58.1 功能
- 使用 chrome.scripting API 在不同上下文中执行脚本
#### 58.2 所需权限
- `scripting`
```json
{
  "name": "My extension",
  "permissions": [
    "scripting"
  ],
}
```
#### 58.3 `Demo`
```js
chrome.scripting.executeScript()
chrome.scripting.insertCSS()
```


### 59. `search`

#### 59.1 功能
- 使用 chrome.search API 通过默认提供程序进行搜索
#### 59.2 所需权限
- `search`
```json
{
  "name": "My extension",
  "permissions": [
    "search"
  ],
}
```
#### 59.3 `Demo`
```js
chrome.search.query()
```


### 60. `sessions`

#### 60.1 功能
- 使用 chrome.sessions API 可查询和恢复浏览会话中的标签页及窗口
#### 60.2 所需权限
- `sessions`
```json
{
  "name": "My extension",
  "permissions": [
    "sessions"
  ],
}
```
#### 60.3 `Demo`
```js
chrome.sessions.getDevices()
chrome.sessions.onChanged.addListener()
```


### 61. `sidePanel`

#### 61.1 功能
- 使用 chrome.sidePanel API 可将内容托管在浏览器侧边栏中的网页主要内容旁边
#### 61.2 所需权限
- `sidePanel`
```json
{
  "name": "My extension",
  "permissions": [
    "sidePanel"
  ],
}
```
#### 61.3 `Demo`
```js
chrome.sidePanel.open()
```


### 62. `storage`

#### 62.1 功能
- 使用 chrome.storage API 存储、检索和跟踪用户数据的更改
#### 62.2 所需权限
- `storage`
```json
{
  "name": "My extension",
  "permissions": [
    "storage"
  ],
}
```
#### 62.3 `Demo`
```js
chrome.storage.local.set()
chrome.storage.local.get()
```


### 63. `system.cpu`

#### 63.1 功能
- 使用 system.cpu API 查询 CPU 元数据
#### 63.2 所需权限
- `system.cpu`
```json
{
  "name": "My extension",
  "permissions": [
    "system.cpu"
  ],
}
```
#### 63.3 `Demo`
```js
chrome.system.cpu.getInfo()
```


### 64. `system.display`

#### 64.1 功能
- 使用 system.display API 查询屏幕元数据
#### 64.2 所需权限
- `system.display`
```json
{
  "name": "My extension",
  "permissions": [
    "system.display"
  ],
}
```
#### 64.3 `Demo`
```js
chrome.system.display.getInfo()
```


### 65. `system.memory`

#### 65.1 功能
- chrome.system.memory API
#### 65.2 所需权限
- `system.memory`
```json
{
  "name": "My extension",
  "permissions": [
    "system.memory"
  ],
}
```
#### 65.3 `Demo`
```js
chrome.system.memory.getInfo()
```


### 66. `system.storage`

#### 66.1 功能
- 使用 chrome.system.storage API 查询存储设备信息，并在连接和分离可移动存储设备时接收通知
#### 66.2 所需权限
- `system.storage`
```json
{
  "name": "My extension",
  "permissions": [
    "system.storage"
  ],
}
```
#### 66.3 `Demo`
```js
chrome.system.storage.getInfo()
```


### 67. `tabCapture`

#### 67.1 功能
- 使用 chrome.tabCapture API 与标签页媒体流交互
#### 67.2 所需权限
- `tabCapture`
```json
{
  "name": "My extension",
  "permissions": [
    "tabCapture"
  ],
}
```
#### 67.3 `Demo`
```js
chrome.tabCapture.capture()
```


### 68. `tabGroups`

#### 68.1 功能
- 使用 chrome.tabGroups API 与浏览器的标签页分组系统进行交互
#### 68.2 所需权限
- `tabGroups`
```json
{
  "name": "My extension",
  "permissions": [
    "tabGroups"
  ],
}
```
#### 68.3 `Demo`
```js
chrome.tabGroups.get()
chrome.tabGroups.move()
```


### 69. `tabs`

#### 69.1 功能
- 使用 chrome.tabs API 与浏览器的标签页系统进行交互。可以使用此 API 在浏览器中创建、修改和重新排列标签页
#### 69.2 所需权限
- `tabs`
```json
{
  "name": "My extension",
  "permissions": [
    "tabs"
  ],
}
```
#### 69.3 `Demo`
```js
chrome.tabs.create()
chrome.tabs.get()
```


### 70. `topSites`

#### 70.1 功能
- 使用 chrome.topSites API 访问新标签页中显示的热门网站（即最常访问的网站）。不包括用户自定义的快捷方式
#### 70.2 所需权限
- `topSites`
```json
{
  "name": "My extension",
  "permissions": [
    "topSites"
  ],
}
```
#### 70.3 `Demo`
```js
chrome.topSites.get()
```


### 71. `tts`

#### 71.1 功能
- 使用 chrome.tts API 播放合成的文字转语音 (TTS)
#### 71.2 所需权限
- `tts`
```json
{
  "name": "My extension",
  "permissions": [
    "tts"
  ],
}
```
#### 71.3 `Demo`
```js
chrome.tts.speak()
chrome.tts.stop()
```


### 72. `ttsEngine`

#### 72.1 功能
- 使用 chrome.ttsEngine API 通过插件实现文字转语音(TTS) 引擎
#### 72.2 所需权限
- `ttsEngine`
```json
{
  "name": "My extension",
  "permissions": [
    "ttsEngine"
  ],
}
```
#### 72.3 `Demo`
```js
chrome.ttsEngine.onSpeak.addListener()
chrome.ttsEngine.onStop.addListener
```


### 73. `types`
#### 73.1 功能
- chrome.types API 包含 Chrome 的类型声明


### 74. `userScripts`

#### 74.1 功能
- 使用 userScripts API 在用户脚本上下文中执行用户脚本
#### 74.2 所需权限
- `userScripts`
```json
{
  "name": "My extension",
  "permissions": [
    "userScripts"
  ],
}
```
#### 74.3 `Demo`
```js
chrome.userScripts.register()
chrome.userScripts.getScripts()
```


### 75. `vpnProvider`

#### 75.1 功能
- 使用 chrome.vpnProvider API 实现 VPN 客户端
#### 75.2 所需权限
- `vpnProvider`
```json
{
  "name": "My extension",
  "permissions": [
    "vpnProvider"
  ],
}
```
#### 75.3 `Demo`
```js
chrome.vpnProvider.createConfig()
```


### 76. `wallpaper`

#### 76.1 功能
- 使用 chrome.wallpaper API 更改 ChromeOS 壁纸
#### 76.2 所需权限
- `wallpaper`
```json
{
  "name": "My extension",
  "permissions": [
    "wallpaper"
  ],
}
```
#### 76.3 `Demo`
```js
chrome.wallpaper.setWallpaper()
```


### 77. `webAuthenticationProxy`

#### 77.1 功能
- 借助 chrome.webAuthenticationProxy API，在远程主机上运行的远程桌面软件可以拦截 Web Authentication API (WebAuthn) 请求，以便在本地客户端上处理请求
#### 77.2 所需权限
- `webAuthenticationProxy`
```json
{
  "name": "My extension",
  "permissions": [
    "webAuthenticationProxy"
  ],
}
```
#### 77.3 `Demo`
```js
chrome.webAuthenticationProxy.attach()
```


### 78. `webNavigation`

#### 78.1 功能
- 使用 chrome.webNavigation API 接收有关传输中的导航请求状态的通知
#### 78.2 所需权限
- `webNavigation`
```json
{
  "name": "My extension",
  "permissions": [
    "webNavigation"
  ],
}
```
#### 78.3 `Demo`
```js
chrome.webNavigation.getAllFrames()
chrome.webNavigation.onCompleted.addListener()
```


### 79. `webRequest`

#### 79.1 功能
- 使用 chrome.webRequest API 可以观察和分析流量，以及拦截、屏蔽或修改运行中的请求
#### 79.2 所需权限
- `webRequest`
```json
{
  "name": "My extension",
  "permissions": [
    "webRequest"
  ],
}
```
#### 79.3 `Demo`
```js
chrome.webRequest.onCompleted.addListener()
```


### 80. `windows`

#### 80.1 功能
- 使用 chrome.windows API 与浏览器窗口交互。可以使用此 API 在浏览器中创建、修改和重新排列窗口
#### 80.2 所需权限
- `tabs`
```json
{
  "name": "My extension",
  "permissions": [
    "tabs"
  ],
}
```
#### 80.3 `Demo`
```js
chrome.windows.create()
chrome.windows.getAll()
```
