# `Chrome.tabs API` 解析

使用 `chrome.tabs API` 与浏览器的标签页系统进行交互，可以使用此 `API` 在浏览器中创建、修改和重新排列标签页

`Tabs API` 不仅提供操作和管理标签页的功能，还可以检测标签页的语言、截取屏幕截图，以及与标签页的内容脚本进行通信

**`Service Worker` 和 `action` 页面可以使用 `Tabs API`，但 `content script` 中不能使用**

## 一、各模块中 `chrome.tabs` 内容

### 1. `Service worker` 中 `tabs` 内容

![service worker tabs](/image-33.png)

### 2. `Action` 中 `tabs` 内容

![action tabs](/image-34.png)

## 二、权限

大多数功能都不需要任何权限即可使用，如创建新标签页、重新加载标签页、导航到其他网址等
使用 `Tabs API` 时需要注意三种权限

- `tabs` 权限
- `host_permissions`
- `activeTab` 权限

### 1. `tabs` 权限

```json
{
  "name": "My extension",
  "permissions": [
    "tabs"
  ],
}
```

此权限不授予对 `chrome.tabs` 命名空间的访问权限。而是会授予插件针对 `tabs.Tab` 实例上的四个敏感属性调用 `tabs.query()` 的权限：`url、pendingUrl、title` 和 `favIconUrl`

### 2. `host_permissions`

```json
{
  "name": "My extension",
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],
}
```

主机权限允许插件读取和查询匹配标签页的四个敏感 `tabs.Tab` 属性。他们还可以使用 `tabs.captureVisibleTab()、tabs.executeScript()、tabs.insertCSS()` 和 `tabs.removeCSS()` 等方法直接与匹配的标签页互动

### 3. `activeTab` 权限

```json
{
  "name": "My extension",
  "permissions": [
    "activeTab"
  ],
}
```

`activeTab` 授予插件对当前标签页的临时主机权限，以响应用户调用。与主机权限不同，`activeTab` 不会触发任何警告

## 三、`chrome.tabs` 类型（`Types`）

### 1. `MutedInfo`
> 标签页的静音状态以及上次状态更改的原因。

#### 1.1. 属性
- `extensionId：string`
  - 更改静音状态的插件的 ID。如果插件不是静音状态上次更改的原因，则不设置。
- `muted：boolean`
  - 标签页是否静音（防止播放声音）。即使该标签页尚未播放或当前未播放声音，它也可能被静音。相当于是否显示“静音”音频指示器。
- `reason：MutedInfoReason`
  - 标签页静音或取消静音的原因。如果标签页的静音状态从未改变，则不设置。

### 2. `MutedInfoReason`

> 导致静音状态更改的事件。

#### 2.1 枚举
- `user`
  - 用户输入操作用于设置静音状态
- `capture`
  - 标签页捕获已开始，强制设为静音状态
- `extension`
  - 由 `extensionId` 字段标识的插件，用于设置静音状态

### 3. `Tab`
#### 3.1. 属性
- `active: boolean`
  - 标签页在其窗口中是否处于活动状态。不一定意味着窗口已聚焦。
- `audible: boolean`
  - 该标签页在过去几秒钟内是否发出声音（但如果也静音，则可能听不到）。相当于是否显示“扬声器音频”指示器。
- `autoDiscardable: boolean`
  - 资源不足时浏览器是否可以自动丢弃标签页。
- `discarded: boolean`
  - 标签是否被丢弃。丢弃的标签页是指其内容已从内存中卸载但在标签页条中仍可见的标签页。下次激活时会重新加载其内容
- `favIconUrl:string`
  - 标签页图标的 URL。此属性仅在插件的清单包含 `tabs` 权限时才存在。如果标签页正在加载，它也可能是一个空字符串
- `groupId: number`
  - 标签页所属的组的 `ID`
- `height: number`
  - 标签页的高度（以像素为单位）
- `highlighted: boolean`
  - 该标签页是否突出显示
- `id: number`
  - 标签页的 `ID`。标签 `ID` 在浏览器会话中是唯一的。在某些情况下，可能不会为标签页分配 `ID`；例如，当使用会话 `API` 查询外部标签页时，在这种情况下可能会出现会话 `session ID`。对于应用程序和开发工具窗口，标签 `ID` 也可以设置为 `chrome.tabs.TAB_ID_NONE`
- `incognito: boolean`
  - 标签页是否在隐身窗口中
- `index: number`
  - 标签页在其窗口中的从零开始的索引
- `mutedInfo: MutedInfo`
  - 标签页的静音状态以及上次状态更改的原因
- `openerTabId: number`
  - 打开此标签页的标签页的 `ID`（如果有）。此属性仅在 `opener` 标签页仍然存在时才存在
- `pendingUrl: string`
  - 标签页在提交之前导航到的 URL。此属性仅在插件的清单包含“标签页”权限并且存在挂起导航时才存在
- `pinned: boolean`
  - 标签页是否固定
- `sessionId: string`
  - 用于唯一标识从会话 `API` 获取的标签页的会话 `sessions ID`
- `status: TabStatus`
  - 标签页的加载状态。
- `title: string`
  - 标签页的标题。此属性仅在插件的清单包含 `tabs` 权限时才存在。
- `url: string `
  - 标签页主框架的最后提交 URL。此属性仅在插件的清单包含 `tabs` 权限时才存在，如果标签页尚未提交，则该属性可能为空字符串。另请参阅 `Tab.pendingUrl`
- `width: number `
  - 标签页的宽度（以像素为单位）。
- `windowId: number`
  - 包含标签页的窗口的 `ID`

### 4. `TabStatus`

> 标签页的加载状态

#### 4.1. 枚举
- `unloaded`
- `loading`
- `complete`

### 5. `WindowType`

> 窗口的类型

#### 5.1. 枚举
- `normal`
- `popup`
- `panel`
- `app`
- `devtools`

### 6. `ZoomSettings`
> 定义如何处理标签页中的缩放更改以及在什么范围内。

#### 6.1. 属性
- `defaultZoomFactor：number `
  - 用于在调用 `tabs.getZoomSettings` 时返回当前标签页的默认缩放级别。
- `mode: ZoomSettingsMode `
  - 定义如何处理缩放更改，即哪个实体负责页面的实际缩放；默认为自动automatic。
- `scope: ZoomSettingsScope `
  - 定义缩放更改是保留页面原点，还是仅在此标签页中生效；在自动automatic模式下默认为 `per-origin`，否则为 `per-tab`。

### 7. `ZoomSettingsMode`

> 定义如何处理缩放更改，即哪个实体负责页面的实际缩放；默认为自动automatic。

#### 7.1. 枚举

- `automatic`
- `manual`
- `disabled`

### 8. `ZoomSettingsScope`
> 定义缩放更改是保留页面原点，还是仅在此标签页中生效；在自动模式(`automatic`)下默认为 `per-origin`，否则为 `per-tab`

#### 8.1. 枚举
- `per-origin`
- `per-tab`

## 四、`chrome.tabs` 属性（`Properties`）

### 1. `MAX_CAPTURE_VISIBLE_TAB_CALLS_PER_SECOND`

> 每秒可以调用 `captureVisibleTab` `的最大次数。captureVisibleTab` 开销比较高，不应过于频繁地调用

#### 1.1. 值
**2**

### 2. `TAB_ID_NONE`

> 表示缺少浏览器标签页的 `ID`

#### 2.1. 值
**-1**

### 3. `TAB_INDEX_NONE`

> 表示 tab_strip 中不存在制表符索引的索引。

#### 3.1. 值

**-1**

## 五、`chrome.tabs` 方法（`Methods`）

### 1. `captureVisibleTab`
> 捕获指定窗口中当前活动标签页的可见区域

要调用此方法，插件必须具有 `<all_urls>` 权限或 `activeTab` 权限。除了插件可以正常访问的站点外，此方法还允许插件捕获其他受限制的敏感站点，包括 `chrome:-scheme` 页面、其他插件的页面和 `data: URL`。这些敏感站点只能使用 `activeTab` 权限进行捕获。仅当插件已被授予文件访问权限时，才可以捕获文件 `URL`

#### 1.1. 示例
```js
chrome.tabs.captureVisibleTab( windowId?: number, options?: ImageDetails, callback?: function, )
```

#### 1.2. 参数
- `windowId: number`
  - 目标窗口。默认为当前窗口current window。
- `options: ImageDetails `
- `callback: function `
  - (dataUrl: string) => void
    - dataUrl: string
      - 对捕获的标签页的可见区域的图像进行编码的数据 `URL`。可以分配给 `HTML img` 元素的 `src` 属性以进行显示。

#### 1.3. 返回
`Promise<string>`

### 2. `connect`

> 连接到指定标签页中的内容脚本。

在当前插件的指定标签页中运行的每个内容脚本中都会触发 `runtime.onConnect` 事件

#### 2.1. 示例

```js
chrome.tabs.connect(
  tabId: number,
  connectInfo?: object,
)
```

#### 2.2. 参数
- `tabId：number`
- `connectInfo：object `
  - `documentId： string`
    - 打开一个指向由 `documentId` 标识的特定文档的端口，而不是标签页中的所有框架
  - `frameId： number `
    - 打开由 `frameId` 标识的特定框架frame的端口，而不是标签页中的所有框架
  - name: string 
    - 传递到 onConnect 用于侦听连接事件的内容脚本。

#### 2.3. 返回
`runtime.Port`

可用于与在指定标签页中运行的内容脚本进行通信的端口。如果标签页关闭或不存在，则会触发端口的 `runtime.Port` 事件。

### 3. `create`

> 创建一个新标签页

#### 3.1. 示例
```js
chrome.tabs.create( createProperties: object, callback?: function, )
```
#### 3.2. 参数

- `createProperties: object`
  - `active: boolean `
    - 该标签页是否应成为窗口中的活动标签页。不影响窗口是否聚焦，默认为 `true`
  - `index: number `
    - 标签页在窗口中应占据的位置。提供的值被限制在零和窗口中的标签页数量之间。
  - `openerTabId: number `
    - 打开此标签页的标签页的 ID。如果指定，opener 标签页必须与新创建的标签页位于同一窗口中。
  - `pinned: boolean `
    - 是否应固定标签页。默认为false。
  - `url: string `
    - 最初将标签页导航到的 URL。默认为新标签页。
  - `windowId: number `
    - 在其中创建新标签页的窗口。默认为当前窗口current window。
- `callback: function `
  - `(tab: Tab) => void`
    - tab: Tab
      - 创建的标签页

#### 3.3. 返回
`Promise<Tab>`


### 4. `detectLanguage`

> 检测标签页中内容的主要语言

#### 4.1. 示例

```js
chrome.tabs.detectLanguage(
  tabId?: number,
  callback?: function,
)
```
#### 4.2. 参数
- `tabId: number `
  - 默认为当前窗口current window的活动标签页。
- `callback: function `
  - `(language: string) => void`
    - `language: string`
      - ISO 语言代码，例如 en 或 fr

#### 4.3. 返回
`Promise<string>`

### 5. `discard`

> 从内存中丢弃一个标签页

#### 5.1. 示例
```js
chrome.tabs.discard(
  tabId?: number,
  callback?: function,
)
```
#### 5.2. 参数
- `tabId: number `
  - 要丢弃的标签页的 ID。如果指定，标签页将被丢弃，除非它处于活动状态或已被丢弃。如果省略，浏览器会丢弃最不重要的标签页
- `callback: function `
  - `(tab?: Tab) => void`
    - `tab: Tab `
      - 丢弃的标签页，如果成功丢弃；否则未定义。
#### 5.3 返回
`Promise<Tab | undefined>`

### 6. `duplicate`

> 复制标签页

#### 6.1. 示例
```js
chrome.tabs.duplicate(
  tabId: number,
  callback?: function,
)
```
#### 6.2. 参数
- `tabId: number`
  - 要复制的标签页的 `ID`
- `callback: function `
  - `(tab?: Tab) => void`
    - tab: Tab 
      - 有关重复标签页的详细信息。如果未请求 `tabs` 权限，则 `tabs.Tab` 对象不包含 `url、pendingUrl、title 和 favIconUrl`。

#### 6.3. 返回
`Promise<Tab | undefined>`

### 7. `get`

> 检索有关指定标签页的详细信息

#### 7.1. 示例
```js
chrome.tabs.get(
  tabId: number,
  callback?: function,
)
```
#### 7.2. 参数
- `tabId: number`
- `callback: function `
  - `(tab: Tab) => void`

#### 7.3. 返回
`Promise<Tab>`

### 8. `getCurrent`

> 获取进行此脚本调用的标签页

#### 8.1. 示例

```js
chrome.tabs.getCurrent(
  callback?: function,
)
```
#### 8.2. 参数
- callback: function 
  - (tab?: Tab) => void
    - tab: Tab 

#### 8.3. 返回
`Promise<Tab | undefined>`

### 9. `getZoom`

> 获取指定标签页的当前缩放系数
#### 9.1. 示例

```js
chrome.tabs.getZoom(
  tabId?: number,
  callback?: function,
)
```
#### 9.2. 参数

- tabId: number 
  - 从中获取当前缩放系数的标签页的 ID；默认为当前窗口的活动标签页。
- callback: function 
  - (zoomFactor: number) => void
    - zoomFactor: number
      - 标签页的当前缩放系数。

#### 9.3. 返回
`Promise<number>`

### 10. `getZoomSettings`
> 获取指定标签页的当前缩放设置
#### 10.1. 示例
```js
chrome.tabs.getZoomSettings(
  tabId?: number,
  callback?: function,
)
```
#### 10.2. 参数
- `tabId: number `
  - 从中获取当前缩放设置的标签页的 ID；默认为当前窗口的活动标签页。
- `callback: function `
  - `(zoomSettings: ZoomSettings) => void`
    - zoomSettings: ZoomSettings
      - 标签页的当前缩放设置

#### 10.3. 返回
`Promise<ZoomSettings>`

### 11. `goBack`
> 如果有，请返回上一页
#### 11.1. 示例
```js
chrome.tabs.goBack(
  tabId?: number,
  callback?: function,
)
```
#### 11.2. 参数
- `tabId： number `
  - 要返回的标签页的 ID；默认为当前窗口的选定标签页。
- `callback： function `
  - `() => void`
#### 11.3. 返回
`Promise<void>`

### 12. `goForward`
> 前进到下一页，如果有的话
#### 12.1. 示例
```js
chrome.tabs.goForward(
  tabId?: number,
  callback?: function,
)
```
#### 12.2. 参数

- `tabId: number `
  - 要向前导航的标签页的 ID；默认为当前窗口的选定标签页
- `callback: function `
  - `() => void`
#### 12.3. 返回
`Promise<void>`

### 13. `group`
> 将一个或多个标签页添加到指定的组，或者如果未指定组，则将给定的标签页添加到新创建的组。
#### 13.1. 示例
```js
chrome.tabs.group(
  options: object,
  callback?: function,
)
```
#### 13.2. 参数

- `options: object`
  - `createProperties: object` 用于创建组的配置。如果已经指定了 groupId，则不能使用
    - `windowId: number `
      - 新组的窗口。默认为当前窗口
  - `groupId: number` 
    - 要将标签页添加到的组的 ID。如果未指定，将创建一个新组
  - `tabIds: number | [number, ...number[]]`
    - 要添加到指定组的标签页 ID 或标签页 ID 列表
- `callback: function `
  - `(groupId: number) => void`
    - `groupId: number`
      - 添加标签页的组的 `ID`

#### 13.3. 返回
`Promise<number>`
### 14. `highlight`
> 突出显示给定的标签页并关注组中的第一个。如果指定的标签页当前处于活动状态，则似乎什么都不做
#### 14.1. 示例
```js
chrome.tabs.highlight(
  highlightInfo: object,
  callback?: function,
)
```
#### 14.2. 参数

- highlightInfo: object
  - tabs: number | number[]
    - 要突出显示的一个或多个标签索引。
  - windowId: number 
    - 包含标签页的窗口。
- callback: function 
  - `(window: Window) => void`

#### 14.3. 返回
`Promise<windows.Window>`

### 15. `move`
> 将一个或多个标签页移动到其窗口内的新位置，或移动到新窗口。请注意，标签页只能移入和移出普通 (window.type === "normal") 窗口
#### 15.1. 示例
```js
chrome.tabs.move(
  tabIds: number | number[],
  moveProperties: object,
  callback?: function,
)
```
#### 15.2. 参数

- tabIds:number | number[]
  - 要移动的标签页 ID 或标签页 ID 列表。
- moveProperties: object
  - index: number
    - 将窗口移动到的位置。使用 -1 将标签页放在窗口的末尾。
  - windowId: number 
    - 默认为标签页当前所在的窗口。
- callback: function 
  - `(tabs: Tab | Tab[]) => void`

#### 15.3. 返回
`Promise<Tab | Tab[]>`


### 16. `query`
> 获取具有指定属性的所有标签页，如果未指定属性，则获取所有标签页
#### 16.1. 示例
```js
chrome.tabs.query(
  queryInfo: object,
  callback?: function,
)
```
#### 16.2. 参数

- `queryInfo: object`
  - `active: boolean `
    - 标签页在其窗口中是否处于活动状态
  - `audible: boolean` 
    - 是否可以听到标签页
  - `autoDiscardable: boolean `
    - 资源不足时浏览器是否可以自动丢弃标签页
  - `currentWindow: boolean` 
    - 标签页是否在当前窗口中current window
  - `discarded: boolean `
    - 标签是否被丢弃。丢弃的标签页是指其内容已从内存中卸载但在标签页条中仍可见的标签页。下次激活时会重新加载其内容
  - `groupId: number `
    - 标签页所在组的 ID，或 tabGroups.TAB_GROUP_ID_NONE 用于未分组的标签页
  - `highlighted: boolean `
    - 标签页是否突出显示
  - `index: number `
    - 标签页在其窗口中的位置
  - `lastFocusedWindow: boolean `
    - 标签页是否在最后一个聚焦窗口中
  - `muted: boolean `
    - 标签页是否静音
  - `pinned: boolean `
    - 标签是否固定
  - `status: TabStatus `
    - 标签页加载状态。
  - `title: string `
    - 将页面标题与模式匹配。如果插件没有“tabs”权限，则忽略此属性。
  - `url: string | string[] `
    - 根据一个或多个 URL 模式匹配URL patterns标签页。片段标识符不匹配。如果插件没有“tabs”权限，则忽略此属性。
  - `windowId: number `
    - 父窗口的 ID，或当前窗口current window的 windows.WINDOW_ID_CURRENT。
  - `windowType: WindowType `
    - 标签页所在的窗口类型。
- `callback: function `
  - `(result: Tab[]) => void`
#### 16.3. 返回
`Promise<Tab[]>`

### 17. `reload`
> 重新加载标签页
#### 17.1. 示例
```js
chrome.tabs.reload(
  tabId?: number,
  reloadProperties?: object,
  callback?: function,
)
```
#### 17.2. 参数

- `tabId: number `
  - 要重新加载的标签页的 ID；默认为当前窗口的选定标签页。
- reloadProperties: object 
  - bypassCache: boolean 
    - 是否绕过本地缓存。默认为false。
- callback: function 
  - `() => void`
#### 17.3. 返回
`Promise<void>`

### 18. `remove`
> 关闭一个或多个标签页
#### 18.1. 示例
```js
chrome.tabs.remove(
  tabIds: number | number[],
  callback?: function,
)
```
#### 18.2. 参数

- tabIds: number | number[]
  - 要关闭的标签页 ID 或标签页 ID 列表。
- callback: function 
  - `() => void`
#### 18.3. 返回
`Promise<void>`
### 19. `sendMessage`
> 向指定标签页中的内容脚本发送一条消息，并在发回响应时运行可选的回调。在当前插件的指定标签页中运行的每个内容脚本中都会触发 runtime.onMessage 事件
#### 19.1. 示例
```js
chrome.tabs.sendMessage(
  tabId: number,
  message: any,
  options?: object,
  responseCallback?: function,
)
```
#### 19.2. 参数
- `tabId: number`
- `message: any`
  - 要发送的消息。此消息应该是一个 JSON-ifiable 对象。
- `options: object `
  - `documentId: string`
    - 向由 documentId 标识的特定文档发送消息，而不是标签页中的所有框架
  - `frameId: number `
    - 将消息发送到由 frameId 标识的特定框架frame，而不是标签页中的所有框架
- `callback: function `
  - `(response: any) => void`

消息处理程序发送的 JSON 响应对象。如果在连接到指定标签页时发生错误，则不带参数调用回调并将 runtime.lastError 设置为错误消息

#### 19.3. 返回
`Promise<any>`


### 20. `setZoom`
> 缩放指定的标签页
#### 20.1. 示例
```js
chrome.tabs.setZoom(
  tabId?: number,
  zoomFactor: number,
  callback?: function,
)
```
#### 20.2. 参数

- tabId: number 
  - 要缩放的标签页的 ID；默认为当前窗口的活动标签页。
- zoomFactor: number
  - 新的缩放系数。值 0 将标签页设置为其当前的默认缩放系数。大于 0 的值指定标签页的（可能是非默认的）缩放系数。
- callback: function 
  - `() => void`

#### 20.3. 返回
`Promise<void>`

### 21. `setZoomSettings`
> 设置指定标签页的缩放设置，定义如何处理缩放更改。导航标签页时，这些设置将重置为默认值。

#### 21.1. 示例
```js
chrome.tabs.setZoomSettings( tabId?: number, zoomSettings: ZoomSettings, callback?: function, )
```
#### 21.2. 参数

- tabId: number 
  - 要更改缩放设置的标签页的 ID；默认为当前窗口的活动标签页。
- zoomSettings: ZoomSettings
  - 定义如何处理缩放更改以及在什么范围内。
- callback: function 
  - `() => void`
#### 21.3. 返回
`Promise<void>`

### 22. `ungroup`
> 从各自的组中删除一个或多个标签页。如果任何组变空，它们将被删除。
#### 22.1. 示例
```js
chrome.tabs.ungroup(
  tabIds: number | [number, ...number[]],
  callback?: function,
)
```
#### 22.2. 参数

- `tabIds: number | [number, ...number[]]`
  - 要从各自组中删除的标签页 ID 或标签页 ID 列表。
- `callback: function `
  - `() => void`
#### 22.3. 返回
`Promise<void>`

### 23. `update`
> 修改标签页的属性。未在 updateProperties 中指定的属性不会被修改。
#### 23.1. 示例
```js
chrome.tabs.update(
  tabId?: number,
  updateProperties: object,
  callback?: function,
)
```
#### 23.2. 参数

- tabId: number 
  - 默认为当前窗口current window的选定标签页。
- updateProperties: object
  - active: boolean 
    - 该标签页是否应处于活动状态。不影响窗口是否聚焦（参见 windows.update）。
  - autoDiscardable: boolean 
    - 当资源不足时，浏览器是否应自动丢弃该标签页。
  - highlighted: boolean 
    - 在当前选择中添加或删除标签页。
  - muted: boolean 
    - 该标签页是否应静音。
  - openerTabId: number 
    - 打开此标签页的标签页的 ID。如果指定，opener 标签页必须与此标签页位于同一窗口中。
  - pinned: boolean 
    - 是否应固定标签页。
  - url: string 
    - 将标签页导航到的 URL。不支持 JavaScript URL；改用 scripting.executeScript 。
- callback: function 
  - (tab?: Tab) => void

#### 23.3. 返回
`Promise<Tab | undefined>`

## 六、`chrome.tabs` 事件（`Events`）

### 1. `onActivated`

> 当窗口中的活动标签页更改时触发。请注意，在触发此事件时可能未设置标签页的 URL，但可以侦听 onUpdated 事件，以便在设置 URL 时收到通知。

#### 1.1. 示例
```js
chrome.tabs.onActivated.addListener(
  callback: function,
)
```

#### 1.2. 参数
- `callback: function`
  - `(activeInfo: object) => void`
    - `tabId: number`
      - 已激活的标签页的 `ID`
    - `windowId: number`
      - 活动标签页在其中更改的窗口的 `ID`

### 2. `onAttached`
> 将标签页附加到窗口时激发
#### 2.1 示例
```js
chrome.tabs.onAttached.addListener(
  callback: function,
)
```
#### 2.2 参数
- `callback: function`
  - `(tabId: number, attachInfo: object) => void`
    - `tabId: number`
    - `attachInfo: object`
      - `newPosition: number`
      - `newWindowId: number`

### 3. `onCreated`
> 创建标签页时触发
#### 3.1 示例
```js
chrome.tabs.onCreated.addListener(
  callback: function,
)
```
#### 3.2 参数
- `callback: function`
  - `(tab: Tab) => void`

### 4. `onDetached`
> 当标签页从窗口分离时激发
#### 4.1 示例
```js
chrome.tabs.onDetached.addListener(
  callback: function,
)
```
#### 4.2 参数

- `callback: function`
  - `(tabId: number, detachInfo: object) => void`
    - `tabId: number`
    - `detachInfo: object`
      - `oldPosition: number`
      - `oldWindowId: number`


### 5. `onHighlighted`
> 当窗口中突出显示或选定的标签页发生变化时触发。
#### 5.1 示例
```js
chrome.tabs.onHighlighted.addListener(
  callback: function,
)
```
#### 5.2 参数

- `callback: function`
  - `(highlightInfo: object) => void`
    - `selectInfo: object`
      - `tabIds: number[]`
        - 窗口中所有突出显示的标签页。
      - `windowId: number`
        - 标签页更改的窗口。

### 6. `onMoved`
> 在窗口内移动标签页时触发
#### 6.1 示例
```js
chrome.tabs.onMoved.addListener(
  callback: function,
)
```
#### 6.2 参数
- `callback: function`
  - `(tabId: number, moveInfo: object) => void`
    - `tabId: number`
    - `moveInfo: object`
      - `fromIndex: number`
      - `toIndex: number`
      - `windowId: number`

### 7. `onRemoved`
> 关闭标签页时触发
#### 7.1 示例
```js
chrome.tabs.onRemoved.addListener(
  callback: function,
)
```
#### 7.2 参数

- `callback: function`
  - `(tabId: number, removeInfo: object) => void`
    - `tabId: number`
    - `removeInfo: object`
      - `isWindowClosing: boolean`
        - 由于其父窗口已关闭而关闭标签页时为 `True`
      - `windowId: number`
        - 标签页关闭的窗口

### 8. `onReplaced`
> 由于预渲染或即时将标签页替换为另一个标签页时触发
#### 8.1 示例
```js
chrome.tabs.onReplaced.addListener(
  callback: function,
)
```
#### 8.2 参数
- `callback: function`
  - `(addedTabId: number, removedTabId: number) => void`
    - `addedTabId: number`
    - `removedTabId: number`


### 9. `onUpdated`
> 更新标签页时触发
#### 9.1 示例

```js
chrome.tabs.onUpdated.addListener(
  callback: function,
)
```
#### 9.2 参数
- `callback: function`
  - `(tabId: number, changeInfo: object, tab: Tab) => void`
    - `tabId: number`
    - `changeInfo: object`
      - `audible: boolean `
        - 标签页的新声音状态
      - `autoDiscardable: boolean `
        - 标签页的新自动丢弃状态。
      - `discarded: boolean `
        - 标签页的新丢弃状态
      - `favIconUrl: string `
        - 标签页的新图标 `URL`
      - `groupId: number `
        - 标签页的新组。
      - `mutedInfo: MutedInfo `
        - 标签页的新静音状态和更改原因
      - `pinned: boolean `
        - 标签页的新固定状态。
      - `status: TabStatus `
        - 标签页的加载状态
      - `title: string `
        - 标签页的新标题。
      - `url: string `
        - 标签页的 `URL`
    - `tab: Tab`

### 10. `onZoomChange`
> 缩放标签页时触发
#### 10.1 示例
```js
chrome.tabs.onZoomChange.addListener(
  callback: function,
)
```

#### 10.2 参数
- `callback: function`
  - `(ZoomChangeInfo: object) => void`
    - `ZoomChangeInfo: object`
      - `newZoomFactor: number`
      - `oldZoomFactor: number`
      - `tabId: number`
      - `zoomSettings: ZoomSettings`

## 七、`chrome.tabs API` 使用示例

### 1. 在新标签页中打开插件页面

在安装插件后在新标签页中打开初始配置页面

`Service Worker js` 中
```js
chrome.runtime.onInstalled.addListener(({reason}) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "setting.html"
    });
  }
});
```

### 2. 获取当前标签页

插件的 `Service Worker` 如何从当前聚焦的窗口
`Service Worker js` 中
```js
  async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
```

```js
  function getCurrentTab(callback) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (chrome.runtime.lastError)
      console.error(chrome.runtime.lastError);
      callback(tab);
    });
  }
```

### 3. 将指定标签页静音

插件如何切换指定标签页的静音状态

```js
async function toggleMuteState(tabId) {
  const tab = await chrome.tabs.get(tabId);
  const muted = !tab.mutedInfo.muted;
  await chrome.tabs.update(tabId, {muted});
  console.log(`Tab ${tab.id} is ${muted ? "muted" : "unmuted"}`);
}
```

```js
function toggleMuteState(tabId) {
  chrome.tabs.get(tabId, async (tab) => {
    let muted = !tab.mutedInfo.muted;
    await chrome.tabs.update(tabId, { muted });
    console.log(`Tab ${tab.id} is ${ muted ? "muted" : "unmuted" }`);
  });
}
```

### 4. 点击当前标签页时将其移至第一个位置

```js
chrome.tabs.onActivated.addListener(moveToFirstPosition);
async function moveToFirstPosition(activeInfo) {
  try {
    await chrome.tabs.move(activeInfo.tabId, {index: 0});
    console.log("Success.");
  } catch (error) {
    if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
      setTimeout(() => moveToFirstPosition(activeInfo), 50);
    } else {
      console.error(error);
    }
  }
}
```

### 5. 向所选标签页的内容脚本传递消息

```js
function sendMessageToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const response = await chrome.tabs.sendMessage(tab.id, message);
}
```