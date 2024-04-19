
# 一、权限（`Permissions`）
在使用插件的 `API` 时，大多数的时候都需要在 `manifest.json` 文件中声明 `permissions` 字段。

## 一、权限类型
在 `V3` 版本中可以声明以下类别的权限：
- `permissions`：
	- 包含下面 `permissions` 权限列表中的项；
- `optional_permissions`：
	- 由用户在运行时（而不是在安装时）授予；
- `content_scripts.matches`：
	- 包含一个或多个匹配模式，可允许内容脚本注入到一个或多个主机中；
- `host_permissions`：
	- 包含一个或多个匹配模式，可提供对一个或多个主机的访问权限；
- `optional_host_permissions`：
	- 由用户在运行时（而不是在安装时）授予。

> 如果插件遭到恶意软件入侵，设置权限有助于限制对插件造成的破坏。在安装之前或运行时，系统会向用户显示一些权限警告，以征求用户同意

## 二、`Manifest.json` 示例
```json
{
  "name": "Permissions Extension",
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
  ],
  "manifest_version": 3
}
```
## 三、主机权限（`Host permissions`）
主机权限允许插件与网址的匹配格式进行交互。有些 `Chrome API` 不仅需要拥有自己的 `API` 权限，还需要主机权限。

需要主机权限的 `API`：
- 从插件 `Service Worker` 和插件页面发出 `fetch()` 请求。
- 使用 `chrome.tabs API` 读取和查询敏感的标签页属性（网址、标题和 `favIconUrl`）。
- 以编程方式注入内容脚本。
- 使用 `chrome.webRequest API` 监控和控制网络请求。
- 使用 `chrome.cookies API` 访问 `Cookie`。
- 使用 `chrome.declarativeNetRequest API` 重定向和修改请求及响应标头。

## 四、包含警告的权限
如果插件请求多项权限，并且其中的许多权限会在安装时显示警告，用户会看到警告列表
示例：

![alt text](/core-permission-warn.png)

如果插件只显示少量警告或向用户说明权限，用户更有可能信任该插件。请考虑实现可选权限或功能略弱的 `API`，以避免收到警告。
在 `host_permissions` 和 `content_scripts.matches` 字段中添加或更改匹配模式也会触发警告。

### 1. 权限警告列表
| 权限 | 说明 | 警告 | 
| -- | -- | -- |
| `http://*/*` <br /> `https://*/*` <br />  `*://*/*` <br /> `<all_urls>`	| 对所有主机的访问权限| 读取和更改在所有网站上的所有数据 |
`https://HostName.com/`	| 对 `https://HostName.com/` 的访问权限 | 读取和更改在 `HostName.com` 上的数据|
`accessibilityFeatures.modify` | 允许此插件修改个别无障碍功能的状态 | 更改无障碍设置|
| `accessibilityFeatures.read` | 允许此插件读取各个无障碍功能状态 | 查看无障碍设置|
| `bookmarks`|	对 `chrome.bookmarks API` 的访问权限 |读取和更改书签 |
| `clipboardRead` |	如果插件使用 `document.execCommand('paste')`，则必须提供 |	读取复制和粘贴的数据
| `clipboardWrite` |	表示该插件使用 `document.execCommand('copy')` 或 `document.execCommand('cut')` | 修改复制和粘贴的数据
| `contentSettings` |	对 `chrome.contentSettings API` 的访问权限 |	更改用于控制网站对 `Cookie`、`JavaScript`、插件、地理定位、麦克风、摄像头等功能的使用权限的设置。
| `debugger`| 	对 `chrome.debugger API` 的访问权限 | 访问页面调试程序后端 <br /><br />读取和更改在所有网站上的所有数据 |
|`declarativeNetRequest`	| 对 `chrome.declarativeNetRequest API` 的访问权限 |屏蔽任何网页上的内容
|`declarativeNetRequestFeedback`|	函数和事件的访问权限，这些函数和事件会返回匹配的声明式规则的相关信息 |	读取浏览记录
|`desktopCapture`|	对 `chrome.desktopCapture API` 的访问权限|	截取屏幕上的内容
|`downloads` |	对 `chrome.downloads API` 的访问权限 |	管理下载内容
|`favicon`|	对 `Favicon API` 的访问权限 |	读取访问的网站的图标
|`geolocation`	| 允许插件在不提示用户授予权限的情况下使用 `HTML5 geolocation API` |检测实际位置
| `history` |	对 `chrome.history API` 的访问权限 |	读取和更改所有已登录设备上的浏览记录
| `identity.email` |	通过 `chrome.identity API` 对电子邮件地址的访问权限 |	获取电子邮件地址
|`management`|	对 `chrome.management API` 的访问权限 |	管理应用、插件和主题背景
| `nativeMessaging` |	对 `Native Messaging API` 的访问权限 |	与协作的原生应用通信
| `notifications` |	对 `chrome.notifications API` 的访问权限 |	显示通知
|`pageCapture`	| 对 `chrome.pageCapture API` 的访问权限 |	读取和更改在所有网站上的所有数据
| `privacy`|	对 `chrome.privacy API` 的访问权限 |	更改与隐私相关的设置
| `proxy`|	对 `chrome.proxy API` 的访问权限 |	读取和更改在所有网站上的所有数据
|`readingList`|	对 `chrome.readingList API` 的访问权限 |	读取和更改阅读清单中的条目
|`sessions` 和 `history`|	对 `chrome.sessionsAPI` 和 `chrome.history API` 的访问权限 |	读取和更改所有已登录设备上的浏览记录
| `sessions` 和 `tabs` |	对 `chrome.sessions API` 以及 `Tab` 对象的特权字段的访问权限 |读取在所有已登录账号设备上的浏览记录
|`system.storage` |	对 `chrome.system.storage API `的访问权限 |	识别和弹出存储设备
|`tabCapture`	 |对 `chrome.tabCapture API` 的访问权限 |	读取和更改在所有网站上的所有数据
|`tabGroups`|	对 `chrome.tabGroups API` 的访问权限|	查看和管理标签页分组
|`tabs`|	对多个 `API`（包括 `chrome.tabs` 和 `chrome.windows`）使用的 `Tab` 对象的特权字段的访问权限 |	读取浏览记录
|`topSites`	|对 `chrome.topSites API` 的访问权限|	读取最常访问的网站列表
|`ttsEngine` |	对 `chrome.ttsEngine API` 的访问权限 |	朗读使用合成语音说出的所有文字
|`webAuthenticationProxy`|	对 `chrome.webAuthenticationProxy API` 的访问权限|	读取和更改在所有网站上的所有数据
|`webNavigation`	|对 `chrome.webNavigation API` 的访问权限|	读取浏览记录

## 五、权限列表

### 1. `accessibilityFeatures.modify`
允许插件在使用 `chrome.accessibilityFeatures API` 时修改无障碍功能状态。
### 2. `accessibilityFeatures.read`
允许插件在使用 `chrome.accessibilityFeatures API` 时读取无障碍功能状态。
### 3. `activeTab`
通过用户手势对活动标签页的临时访问权限。
###  4. `alarms`
对 `chrome.alarms API` 的访问权限。
###  5. `audio`
对 `chrome.audio API` 的访问权限。
###  6. `background`
让 `Chrome` 尽早启动（用户登录计算机、启动 `Chrome` 之前）和延迟关闭（即使最后一个窗口已关闭，直到用户明确退出 `Chrome`）。
### 7. `bookmarks`
对 `chrome.bookmarks API` 的访问权限。
###  8. `browsingData`
对 `chrome.browsingData API` 的访问权限。
###  9. `certificateProvider`
对 `chrome.certificateProvider API` 的访问权限。
###  10. `contentSettings`
对 `chrome.contentSettings API` 的访问权限。
###  11. `contextMenus`
对 `chrome.contextMenus API` 的访问权限。
###  12. `cookies`
对 `chrome.cookies API` 的访问权限。
### 13. `debugger`
对 `chrome.debugger API` 的访问权限。
###  14. `declarativeContent`
对 `chrome.declarativeContent API` 的访问权限。
###  15. `declarativeNetRequest`
对 `chrome.declarativeNetRequest API` 的访问权限。
###  16. `declarativeNetRequestWithHostAccess`
在需要主机权限时对 `chrome.declarativeNetRequest API` 的访问权限。
###  17. `declarativeNetRequestFeedback`
使用 `chrome.declarativeNetRequest API` 时向开发者工具控制台写入错误和警告的权限。
###  18. `dns`
对 `chrome.dns API` 的访问权限。
###  19. `desktopCapture`
对 `chrome.desktopCapture API` 的访问权限。
###  20. `documentScan`
对 `chrome.documentScan API` 的访问权限。
###  21. `downloads`
对 `chrome.downloads API` 的访问权限。
###  22. `downloads.open`
允许使用 `chrome.downloads.open()`。
###  23. `downloads.ui`
允许使用 `chrome.downloads.setUiOptions()`。
###  24. `enterprise.deviceAttributes`
对 `chrome.enterprise.deviceAttributes API` 的访问权限。
### 25. `enterprise.hardwarePlatform`
对 `chrome.enterprise.hardwarePlatform API` 的访问权限。
###  26. `enterprise.networkingAttributes`
对 `chrome.enterprise.networkingAttributes API` 的访问权限。
###  27. `enterprise.platformKeys`
对 `chrome.enterprise.platformKeys API` 的访问权限。
###  28. `favicon`
对 `Favicon API` 的访问权限。
###  29. `fileBrowserHandler`
对 `chrome.fileBrowserHandler API` 的访问权限。
###  30. `fileSystemProvider`
对 `chrome.fileSystemProvider API` 的访问权限。
###  31. `fontSettings`
对 `chrome.fontSettings API` 的访问权限。
###  32. `gcm`
对 `chrome.gcm` 和 `chrome.instanceID API` 的访问权限。
###  33. `geolocation`
允许插件在不提示用户授予权限的情况下使用 `geolocation API`。
###  34. `history`
对 `chrome.history API` 的访问权限。
###  35. `identity`
对 `chrome.identity API` 的访问权限。
###  36. `idle`
对` chrome.idle API` 的访问权限。
###  37. `loginState`
对 `chrome.loginState API` 的访问权限。
### 38. `management`
对 `chrome.management API` 的访问权限。
### 39. `nativeMessaging`
对 `Native Messaging API` 的访问权限。
### 40. `notifications`
对 `chrome.notifications API` 的访问权限。
### 41. `offscreen`
对 `chrome.offscreen API` 的访问权限。
### 42. `pageCapture`
对 `chrome.pageCapture API` 的访问权限。
### 43. `platformKeys`
对 `chrome.platformKeys API` 的访问权限。
### 44. `power`
对 `chrome.power API` 的访问权限。
### 45. `printerProvider`
对 `chrome.printerProvider API` 的访问权限。
### 46. `printing`
对 `chrome.printing API` 的访问权限。
### 47. `printingMetrics`
对 `chrome.printingMetrics API` 的访问权限。
### 48. `privacy`
对 `chrome.privacy API` 的访问权限。
### 49. `processes`
对 `chrome.processes API` 的访问权限。
### 50. `proxy`
对 `chrome.proxy API` 的访问权限。
### 51. `runtime`
对 `runtime.connectNative()` 和 `runtime.sendNativeMessage()` 的访问权限。对于 `runtime` 命名空间的所有其他功能，无需任何权限。
### 52. `scripting`
对 `chrome.scripting API` 的访问权限。
### 53. `search`
对 `chrome.search API` 的访问权限。
### 54. `sessions`
对 `chrome.sessions API` 的访问权限。
### 55. `sidePanel`
对 `chrome.sidePanel API` 的访问权限。
### 56. `storage`
对 `chrome.storage API` 的访问权限。
### 57. `system.cpu`
对 `chrome.system.cpu API` 的访问权限。
### 58. `system.display`
对 `chrome.system.display API` 的访问权限。
### 59. `system.memory`
对 `chrome.system.memory API` 的访问权限。
###  60. `system.storage`
对 `chrome.system.storage API` 的访问权限。
###  61. `tabCapture`
对 `chrome.tabCapture API` 的访问权限。
###  62. `tabGroups`
对 `chrome.tabGroups API` 的访问权限。
###  63. `tabs`
对多个 `API`（包括 `chrome.tabs` 和 `chrome.windows`）使用的 `Tab` 对象的特权字段的访问权限。
###  64. `topSites`
对 `chrome.topSites API` 的访问权限。
### 65. `tts`
对 `chrome.tts API` 的访问权限。
###  66. `ttsEngine`
对 `chrome.ttsEngine API` 的访问权限。
### 67. `unlimitedStorage`
针对 `chrome.storage.local`、`IndexedDB` 提供无限制的配额，
为 `chrome.storage.local`、`IndexedDB`、`Cache Storage` 和 `Origin Private File System` 提供无限制的配额。
### 68. `vpnProvider`
对 `chrome.vpnProvider API` 的访问权限。
### 69. `wallpaper`
对 `chrome.wallpaper API` 的访问权限。
### 70. `webAuthenticationProxy`
对 `chrome.webAuthenticationProxy API` 的访问权限。
### 71. `webNavigation`
对 `chrome.webNavigation API` 的访问权限。
### 72. `webRequest`
对 `chrome.webRequest API` 的访问权限。
### 73. `webRequestBlocking`
允许使用 `chrome.webRequest API` 进行屏蔽。

## 六、可选权限
### 1. 确定必需权限和可选权限
- 插件可以声明必需权限和可选权限。
	- 如果插件的基本功能需要用到所需权限，请使用这些权限。
	- 如果插件中的可选功能需要用到可选权限，请使用这些权限。
- 必需权限的优点：
	- 提示更少：插件可以提示用户接受所有权限一次。
	- 开发更简单：必要权限必定存在。
- 可选权限的优点：
	- 安全性更高：由于用户仅启用所需的权限，因此插件能够以更少的权限运行。
	- 为用户提供更实用的信息：在用户启用相关功能时，插件可以解释为什么它需要特定权限。
	- 升级更轻松：升级插件时，如果升级过程增加了可选权限而非必需权限，`Chrome` 不会为用户停用该插件。
### 2. 在 `Manifest.json` 中声明可选权限
使用 `optional_permissions` 键在插件清单中声明可选权限，格式与 `permissions` 字段相同：
```json
{
  "name": "My extension",
  "optional_permissions": ["tabs"],
  "optional_host_permissions": ["https://www.google.com/"],
}
```
#### 2.1 无法指定为可选的权限
大多数 `Chrome` 插件权限均可指定为可选权限，但以下权限除外。

- `debugger`
- `declarativeNetRequest"devtools`
- `experimental`
- `geolocation`
- `mdns`
- `proxy`
- `tts`
- `ttsEngine`
- `wallpaper`
### 3. 请求可选权限
示例：
使用 `permissions.request()` 在 `click` 中请求权限：
```json
document.querySelector('#my-button').addEventListener('click', (event) => {
  // Permissions must be requested from inside a user gesture, like a button's
  // 权限必须从用户手势内部请求，比如按钮
  // click handler.
  chrome.permissions.request({
    permissions: ['tabs'],
    origins: ['https://www.google.com/']
  }, (granted) => {
    // The callback argument will be true if the user granted the permissions.
    // 如果用户授予权限，则callback参数将为true。
    if (granted) {
      doSomething();
    } else {
      doSomethingElse();
    }
  });
});
```
### 4. 检查插件的当前权限
如需检查插件是否具有特定权限或一组权限，请使用 `permission.contains()`：
```json
chrome.permissions.contains({
  permissions: ['tabs'],
  origins: ['https://www.google.com/']
}, (result) => {
  if (result) {
    // The extension has the permissions.
    // 扩展具有相应的权限。
  } else {
    // The extension doesn't have the permissions.
  }
});
```
### 5. 移除权限
如果不再需要某些权限，应将其移除。移除权限后，调用 `permissions.request()` 通常会在不提示用户的情况下重新添加该权限。
```json
chrome.permissions.remove({
  permissions: ['tabs'],
  origins: ['https://www.google.com/']
}, (removed) => {
  if (removed) {
    // The permissions have been removed.
    // 权限已被移除。
  } else {
    // The permissions have not been removed (e.g., you tried to remove
    // required permissions).
  }
});
```
