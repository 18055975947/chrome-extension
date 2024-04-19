# `chrome.scripting API`

> 使用 `chrome.scripting API` 在不同上下文中执行脚本。

> 可以使用 `chrome.scripting API` 将 `JavaScript` 和 `CSS` 注入网站。
## 一、所需权限
- `scripting`

## 二、`Manifest` 配置
使用 `chrome.scripting API`，需要在 `manifest.json` 中声明 `scripting` 权限，以及要向其注入脚本的网页的主机权限。使用 `host_permissions` 关键字或 `activeTab` 权限。

```json
{
  "name": "Scripting Extension",
  "manifest_version": 3,
  "permissions": ["scripting", "activeTab"],
}
```

## 三、注入

- 使用 `target` 参数指定要向其注入 `JavaScript` 或 `CSS` 的目标。
- 唯一的必填字段是 `tabId`。
### 1. 注入脚本
```ts
// 获取 tab ID 
function getTabId() {  }
// 注入脚本
chrome.scripting.executeScript({
  target : {tabId : getTabId()},
  files : [ "script.js" ],
}).then(() => console.log("script injected"));
```

### 2. 注入代码
```ts
function getTabId() { ... }
function getUserColor() { ... }

function changeBackgroundColor() {
  document.body.style.backgroundColor = getUserColor();
}

chrome.scripting.executeScript({
  target : {tabId : getTabId()},
  func : changeBackgroundColor,
}).then(() => console.log("injected a function"));
```
### 3. 传递参数
```ts
function getTabId() { ... }
function getUserColor() { ... }
function changeBackgroundColor(backgroundColor) {
  document.body.style.backgroundColor = backgroundColor;
}

chrome.scripting.executeScript({
  target : {tabId : getTabId()},
  func : changeBackgroundColor,
  args : [ getUserColor() ],
}).then(() => console.log("injected a function"));
```

### 4. 注入 `CSS`
```ts
function getTabId() { ... }
const css = "body { background-color: red; }";

chrome.scripting.insertCSS({
  target : {tabId : getTabId()},
  css : css,
}).then(() => console.log("CSS injected"));
```
### 5. 取消所有脚本
```ts
async function unregisterAllDynamicContentScripts() {
  try {
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    const scriptIds = scripts.map(script => script.id);
    return chrome.scripting.unregisterContentScripts(scriptIds);
  } catch (error) {
    const message = [
      "An unexpected error occurred while",
      "unregistering dynamic content scripts.",
    ].join(" ");
    throw new Error(message, {cause : error});
  }
}
```

## 四、类型（`Types`）
### 1. `ContentScriptFilter`
#### 属性
- `ids：string[]` 可选
    - 如果指定，`getRegisteredContentScripts` 将仅返回具有此列表中指定的 `ID` 的脚本

### 2. `CSSInjection`

#### 属性

- `css: string`可选
    - 包含要注入的 `CSS` 的字符串。
- `files: string[]` 可选
    - 要注入的 `CSS` 文件的路径（相对于插件的根目录）。必须指定 `files` 和 `css` 中的一个。
- `origin: StyleOrigin` 可选
    - 注入的样式来源。默认为 `AUTHOR`。
- `target: InjectionTarget`
    - 指定要在其中插入 `CSS` 的目标的详细信息。

### 3. `ExecutionWorld`
> 要在其中执行脚本的 `JavaScript` 环境。
#### 枚举值
- `ISOLATED` 
    - 指定独立的环境，是插件独有的执行环境。
- `MAIN` 
    - 指定 `DOM` 的主环境，与托管网页的 `JavaScript` 共享的执行环境。

### 4. `InjectionResult`
#### 属性
- `documentId: string`
    - 与注入相关的文档。
- `frameId: number`
    - 与注入相关的帧。
- `result: any` 可选
    - 脚本执行的结果。

### 5. `InjectionTarget`

#### 属性
- `allFrames: boolean` 可选
    - 是否将脚本注入标签页内的所有帧。默认值为 `false`。如果指定了 `frameIds`，则此值不能为 `true`。
- `documentIds: string[]` 可选
    - 要注入到的特定 `documentId` 的 `ID`。如果已设置 `frameIds`，则不能设置此字段。
- `frameIds: number[]` 可选
    - 要注入到的特定帧的 `ID`。
- `tabId: number`
    - 要注入的标签页的 `ID`。

### 6. `RegisteredContentScript`
#### 属性
- `allFrames: boolean` 可选
    - 如果指定 `true`，它将注入所有帧中，即使帧不是标签页中最顶层的帧。系统会单独检查每个框架是否符合网址要求；如果不符合网址要求，该框架将不会注入到子框架中。默认值为 `false`，表示仅匹配顶部帧。
- `css: string[]` 可选
    - 要注入到匹配页面的 `CSS` 文件列表。在为网页构建或显示任何 `DOM` 之前，这些对象会按照它们在此数组中显示的顺序进行注入。
- `excludeMatches: string[]` 可选
    - 不包括此内容脚本将被注入的网页。
- `id: string` **必填项**
    - `API` 调用中指定的内容脚本的 `ID`。不得以“_”开头，因为该字符已预留为生成的脚本 `ID` 的前缀。
- `js: string[]` 可选
    - 要注入到匹配页面的 `JavaScript` 文件的列表。这些引用会按照它们在此数组中出现的顺序进行注入。
- `matchOriginAsFallback: boolean` 可选
    - 指明在网址包含不受支持的架构的帧中，是否可以注入脚本，具体来说就是：`about:`、`data:`、`blob:` 或 `filesystem:`。在这些情况下，系统会检查网址的来源，以确定是否应注入脚本。如果源是 `null`（与 `data:` 网址一样），则所使用的源将是创建当前帧的帧或启动到此帧的导航的帧。请注意，该框架可能不是父框架。
- `matches: string[]` 可询啊
    - 指定将此内容脚本注入到哪些网页。必须为 `registerContentScripts` 指定。
- `persistAcrossSessions: boolean` 可选
    - 指定此内容脚本是否将在以后的会话中持续存在。默认值为 `true`。
- `runAt: RunAt` 可选
    - 指定何时将 `JavaScript` 文件注入网页。默认值为 `document_idle`。
- `world: ExecutionWorld`: 可选
    - 要在其中运行脚本的 `JavaScript world` 。默认为 `ISOLATED`。

### 7. `ScriptInjection`

#### 属性
- `args: any[]` 可选
    - 提供给提供的函数中的 `curry` 参数。仅当指定了 `func` 参数时，此属性才有效。这些参数必须可进行 JSON 序列化。
- `files: string[]` 可选
    - 要注入的 `JS` 或 `CSS` 文件的路径（相对于插件的根目录）。必须且只能指定 `files` 和 `func` 中的一个。
- `injectImmediately: boolean` 可选
    - 是否应尽快在目标中触发注入。并不保证注入一定会在网页加载之前发生，因为在脚本到达目标时，网页可能已经加载完毕。
- `target: InjectionTarget` **必填项**
    - 详细说明将脚本注入到的目标。
- `world: ExecutionWorld` 可选
    - 要在其中运行脚本的 `JavaScript world`。默认为 `ISOLATED`。
- `func` 可选
    - 要注入的 `JavaScript` 函数。系统将对此函数进行序列化，然后进行反序列化以供注入。这意味着所有绑定的参数和执行上下文都将丢失。必须且只能指定 `files` 和 `func` 中的一个。

`func` 函数如下所示：

```ts
()=> {}
```

### 8. `StyleOrigin`
> 样式更改的来源。

在 `CSS` 中，样式更改的来源分为三类。这些类别称为 **`style origins`**。它们是 **`user agent origin`**, **`user origin`** 和 **`author origin`**。

#### 枚举值
- `User-agent`
- `User`
- `Author`

## 五、方法（`Methods`）
### 1. `executeScript()`
> 将脚本注入目标上下文。该脚本将在 `document_idle` 运行。如果脚本的计算结果是一个 `promise`，则浏览器将等待该 `promise` 得到解决并返回结果值。
#### 1. 示例
```ts
chrome.scripting.executeScript(
  injection:
  ScriptInjection,
  callback?:
  function,
)
```
#### 2. 参数
- `injection: ScriptInjection`
    - 脚本的详细信息
- `callback: function` 可选
    - `(results: InjectionResult[])=>void`
#### 3. 返回
- `Promise<InjectionResult[]>`

### 2. `getRegisteredContentScripts()`
> 返回此插件中与指定过滤器匹配的所有动态注册的内容脚本。
#### 1. 示例
```ts
chrome.scripting.getRegisteredContentScripts(
  filter?:
  ContentScriptFilter,
  callback?:
  function,
)
```
#### 2. 参数
- `filter: ContentScriptFilter` 可选
    - 用于过滤插件动态注册的脚本的对象。
- `callback: function` 可选
    - `(scripts: RegisteredContentScript[])=>void`
#### 3. 返回
- `Promise<RegisteredContentScript[]>`

### 3. `insertCSS()`
> 将 `CSS` 样式表插入目标上下文。如果指定了多个帧，系统会忽略不成功的注入。
#### 1. 示例
```ts
chrome.scripting.insertCSS(
  injection:
  CSSInjection,
  callback?:
  function,
)
```
#### 2. 参数
- `injection: CSSInjection`
    - 要插入的样式的详细信息。
- `callback: function` 可选
    - `()=>void`

#### 3. 返回
- `Promise<void>`

### 4. `registerContentScripts()`
> 为此插件注册一个或多个内容脚本。
#### 1. 示例
```
chrome.scripting.registerContentScripts(
  scripts:
  RegisteredContentScript[],
  callback?:
  function,
)
```
#### 2. 参数
- `scripts: RegisteredContentScript[]`
    - 包含要注册的脚本的列表。
- `callback: function` 可选
    - `()=>void`

#### 3. 返回
- `Promise<void>`

### 5. `removeCSS()`
> 从目标上下文中移除此插件之前插入的 `CSS` 样式表。
#### 1. 示例
```
chrome.scripting.removeCSS(
  injection:
  CSSInjection,
  callback?:
  function,
)
```
#### 2. 参数
- `injection: CSSInjection`
    - 要移除的样式的详细信息。
- `callback: function` 可选
    - `()=>void`

#### 3. 返回
- `Promise<void>`

### 6. `unregisterContentScripts()`

Promise Chrome 96 及更高版本
> 为此插件取消注册内容脚本。
#### 1. 示例
```
chrome.scripting.unregisterContentScripts(
  filter?:
  ContentScriptFilter,
  callback?:
  function,
)
```
#### 2. 参数
- `filter: ContentScriptFilter` 可选
    - 如果指定，则仅取消注册与过滤条件匹配的动态内容脚本。否则，该插件的所有动态内容脚本都会被取消注册。
- `callback: function` 可选
    - `()=>void`

#### 3. 返回
- `Promise<void>`

### 7. `updateContentScripts()`
> 更新此插件的一个或多个内容脚本。
#### 1. 示例
```
chrome.scripting.updateContentScripts(
  scripts:
  RegisteredContentScript[],
  callback?:
  function,
)
```
#### 2. 参数
- `scripts: RegisteredContentScript`
    - 包含要更新的脚本列表。
- `callback: function` 可选
    - `()=>void`

#### 3. 返回
- `Promise<void>`
