# 一、内容脚本（`Content Scripts`）

> 指定在用户打开某些网页时要使用的 `JavaScript` 或 `CSS` 文件。

> 内容脚本是在网页环境中运行的文件。通过使用标准文档对象模型 (`DOM`)，开发者能够读取浏览器所访问网页的详情、更改这些网页，并将信息传递给其父级插件。

## 一、内容脚本功能
内容脚本在声明插件文件为可通过网络访问的资源后，便可访问插件文件。他们可以直接访问以下插件 `API`：
- `dom`
- `i18n`
- `storage`
- `runtime.connect()`
- `runtime.getManifest()`
- `runtime.getURL()`
- `runtime.id`
- `runtime.onConnect`
- `runtime.onMessage`
- `runtime.sendMessage()`

内容脚本无法直接访问其他 `API`。但用户可以通过与插件的其他部分交换消息来间接访问这些插件。

## 二、隔离环境
> 隔离世界是一种私有执行环境，页面或其他插件无法访问。这种隔离带来的实际结果是，插件内容脚本中的 `JavaScript` 变量对托管页面或其他插件的内容脚本不可见。此概念最初是在 `Chrome` 首次发布时引入的，用于隔离浏览器标签页。

> 不仅每个插件都会在各自的独立世界中运行，内容脚本和网页也会在这方面运行。这意味着它们（网页、内容脚本和任何正在运行的插件）都无法访问其他项的上下文和变量。

内容脚本位于一个独立的环境中，这使得内容脚本可以对其 JavaScript 环境进行更改，而不会与网页或其他插件的内容脚本发生冲突。
### 1. 示例
插件在类似于以下示例的网页中运行。

> `webPage.html`

```html
<html>
  <button id="mybutton">click me</button>
  <script>
    var greeting = "hello, ";
    var button = document.getElementById("mybutton");
    button.person_name = "Bob";
    button.addEventListener(
        "click", () => alert(greeting + button.person_name + "."), false);
  </script>
</html>
```

该插件可以使用注入脚本部分中所述的方法之一注入以下内容脚本。

> `content-script.js`

```ts
var greeting = "hola, ";
var button = document.getElementById("mybutton");
button.person_name = "Roberto";
button.addEventListener("click", () => alert(greeting + button.person_name + "."), false);
```

进行此项更改后，用户点击按钮时，系统会按顺序显示两个提醒。

## 三、注入脚本（`Inject scripts`）

内容脚本可以静态声明、动态声明或以编程方式注入。

### 1. 使用静态声明进行注入
使用 `manifest.json` 中的静态内容脚本声明。

静态声明的脚本在清单中的 `"content_scripts"` 键下注册。可以包含 `JavaScript` 文件和/ `CSS` 文件。所有自动运行的内容脚本都必须指定匹配模式。

> `manifest.json`

```json
{
 "name": "My extension",
 "content_scripts": [
   {
     "matches": ["https://*.nytimes.com/*"],
     "css": ["my-styles.css"],
     "js": ["content-script.js"]
   }
 ],
}
```

| 名称      | 类型  | 说明  |
| -------------------------- | -------- | ---- |
| `matches` | 字符串数组 `string`[]  | **必需**。指定将此内容脚本注入到哪些网页。|
| `css` | 字符串数组 `string`[]  | **可选**。要注入到匹配页面的 `CSS` 文件列表。这些代码会按照它们在此数组中出现的顺序进行注入，然后为网页构建或显示任何 `DOM`。 |
| `js`   | 字符串数组 `string`[]  | **可选**。要注入到匹配页面的 `JavaScript` 文件的列表。系统会按照文件在此数组中出现的顺序注入文件。此列表中的每个字符串都必须包含插件根目录中某项资源的相对路径。前导斜杠（“/”）会自动剪除。  |
| `run_at` | `RunAt` | **可选**。指定应将脚本注入网页的时间。默认为 `document_idle`。 |
| `match_about_blank`| 布尔值 `boolean`| **可选**。脚本是否应注入到 `about:blank` 帧中，其中父帧或起始帧与 `matches` 中声明的模式之一匹配。默认值为 `false`。 |
| `match_origin_as_fallback` | 布尔值 `boolean` | **可选**。脚本是否应在由匹配的来源创建但其网址或来源可能与模式不直接匹配的帧中注入。其中包括采用不同架构的帧，例如 `about:`、`data:`、`blob:` 和 `filesystem:`。|
| `world`| `ExecutionWorld` | **可选**。要在其中执行脚本的 `JavaScript` 环境。默认值为 `ISOLATED`

#### 1.1 `RunAt`: 枚举
- `document_start`  
    - `DOM` 仍在加载。
- `document_end`
    - 网页的资源仍在加载
- `document_idle`
    - DOM 和资源已加载完毕。这是默认值。
#### 1.2 `ExecutionWorld`
- `ISOLATED`
    - 指定独立的世界，这是插件独有的执行环境。
- `MAIN`  
    - 指定 `DOM` 的主环境，即与托管网页的 `JavaScript` 共享的执行环境。

### 2. 使用动态声明进行注入

如果内容脚本的匹配模式并不为人所知，或者内容脚本不应总是注入已知主机上，就需要使用动态进行注入。

内容脚本对象是使用 `chrome.scripting` 命名空间（而不是 `manifest.json`）中的方法在 `Chrome` 中注册的。

`Scripting API` 还允许插件开发者执行以下操作：
-   注册内容脚本。
-   获取已注册内容脚本的列表。
-   更新已注册内容脚本的列表。
-   移除已注册的内容脚本。

动态声明可以包含 `JavaScript` 文件和或 `CSS` 文件。
> `service-worker.js`
#### 2.1. 注册
```ts
chrome.scripting
  .registerContentScripts([{
    id: "session-script",
    js: ["content.js"],
    persistAcrossSessions: false,
    matches: ["*://example.com/*"],
    runAt: "document_start",
  }])
  .then(() => console.log("registration complete"))
  .catch((err) => console.warn("unexpected error", err))
```
#### 2.2. 更新
```ts
chrome.scripting
  .updateContentScripts([{
    id: "session-script",
    excludeMatches: ["*://admin.example.com/*"],
  }])
  .then(() => console.log("registration updated"));
```
#### 2.3. 获取
```ts
chrome.scripting
  .getRegisteredContentScripts()
  .then(scripts => console.log("registered content scripts", scripts));
```
#### 2.4. 移除
```ts
chrome.scripting
  .unregisterContentScripts({ ids: ["session-script"] })
  .then(() => console.log("un-registration complete"));
```
### 3. 以编程方式注入
对于需要为了响应事件或在特定情况下运行的内容脚本，使用程序化注入。

如需以编程方式注入内容脚本，插件需要对要尝试注入脚本的页面拥有主机权限。可以通过在插件清单中请求这些权限来授予主机权限，也可以通过 `activeTab` 暂时授予主机权限。

#### 3.1. 内容文件作为脚本进行注入

> `manifest.json`
```json
{
  "name": "My extension",
  "permissions": [
    "activeTab",
    "scripting"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "action": {
    "default_title": "Action Button"
  }
}
```
> `content-script.js`

```ts
document.body.style.backgroundColor = "orange";
```
> `service-worker.js`

```ts
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"]
  });
});
```
#### 3.2. 注入函数正文，并将其作为内容脚本执行。
> `service-worker.js`
```ts
function injectedFunction() {
  document.body.style.backgroundColor = "orange";
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : injectedFunction,
  });
});
```
#### 3.3 注入函数时，可以传递参数
> `service-worker.js`
```ts
function injectedFunction(color) {
  document.body.style.backgroundColor = color;
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target : {tabId : tab.id},
    func : injectedFunction,
    args : [ "orange" ],
  });
});
```
## 四、排除匹配项和 `glob`
如需自定义指定的网页匹配，请在声明式注册中添加以下字段
| 名称                | 类型    | 说明 |
| ----------------- | ----- | -------|
| `exclude_matches` | 字符串数组 `string[]` | **可选**。不包括此内容脚本将被注入的网页。|
| `include_globs`   | 字符串数组 `string[]`  | **可选**。在 `matches` 之后应用，以仅包含也与此 glob 匹配的网址。 |
| `exclude_globs`   | 字符串数组 `string[]`  | **可选**。在 `matches` 之后应用，以排除与此 glob 匹配的网址。

### 1. 排除/包含匹配

如果同时满足以下两个条件，内容脚本将会注入到网页中：
- 其网址与任何 `matches` 格式和 `include_globs` 格式匹配。
- 该网址也不符合 `exclude_matches` 或 `exclude_globs` 格式。由于 `matches` 属性是必需的，因此 `exclude_matches`、`include_globs` 和 `exclude_globs` 只能用于限制哪些页面会受到影响。
#### 1.1. 示例
以下插件会将内容脚本注入 `https://www.nytimes.com/health`，但不会注入 `https://www.nytimes.com/business`。
> `manifest.json`
```json
{
  "name": "My extension",
  "content_scripts": [
    {
      "matches": ["https://*.nytimes.com/*"],
      "exclude_matches": ["*://*/*business*"],
      "js": ["contentScript.js"]
    }
  ],
}
```
> `service-worker.js`

```ts
chrome.scripting.registerContentScripts([{
  id : "test",
  matches : [ "https://*.nytimes.com/*" ],
  excludeMatches : [ "*://*/*business*" ],
  js : [ "contentScript.js" ],
}]);
```
### 2. `Glob` 匹配
`Glob` 属性遵循与匹配模式不同且更灵活的语法。可接受的 `glob` 字符串是指可能包含通配符和问号的网址。
- 星号 (`*`) 匹配任何长度的字符串，包括空字符串
- 问号 (`?`) 匹配任何单个字符。

例如，glob `https://???.example.com/foo/*` 与以下任何一项匹配：

-   `https://www.example.com/foo/bar`
-   `https://the.example.com/foo/`

不过，它与以下内容*不*匹配：

-   `https://my.example.com/foo/bar`
-   `https://example.com/foo/`
-   `https://www.example.com/foo`

#### 2.1 示例
1. 此插件会将内容脚本注入 `https://www.nytimes.com/arts/index.html` 和 `https://www.nytimes.com/jobs/index.htm*`，但不会注入 `https://www.nytimes.com/sports/index.html`：

> `manifest.json`
```json
{
  "name": "My extension",
  "content_scripts": [
    {
      "matches": ["https://*.nytimes.com/*"],
      "include_globs": ["*nytimes.com/???s/*"],
      "js": ["contentScript.js"]
    }
  ],
}
```
2. 此插件会将内容脚本注入 `https://history.nytimes.com` 和 `https://.nytimes.com/history`，但不会注入 `https://science.nytimes.com` 或 `https://www.nytimes.com/science`：

> `manifest.json`
```json
{
  "name": "My extension",
  "content_scripts": [
    {
      "matches": ["https://*.nytimes.com/*"],
      "exclude_globs": ["*science*"],
      "js": ["contentScript.js"]
    }
  ],
}
```
3. 全部参数都加上

此插件会将内容脚本注入 `https://www.example.com/arts/index.html`
和 `https://.example.com/jobs/index.html`，但不会注入 `https://science.example.com`、`https://www.example.com/jobs/business` 和 `https://www.example.com/science`
> `manifest.json`
```json
{
  "content_scripts": [
    {
      "matches": ["https://*.example.com/*"],
      "exclude_matches": ["*://*/*business*"],
      "include_globs": ["*example.com/???s/*"],
      "exclude_globs": ["*science*"],
      "js": ["content-script.js"]
    }
  ],
}
```
## 五、运行时间
`run_at` 字段用于控制何时将 `JavaScript` 文件注入网页。首选值为 `"document_idle"`。
> `manifest.json`
```json
{
  "name": "My extension",

  "content_scripts": [
    {
      "matches": ["https://*.nytimes.com/*"],
      "run_at": "document_idle",
      "js": ["contentScript.js"]
    }
  ],
}
```

> `service-worker.js`
```ts
chrome.scripting.registerContentScripts([{
  id : "test",
  matches : [ "https://*.nytimes.com/*" ],
  runAt : "document_idle",
  js : [ "contentScript.js" ],
}]);
```
## 六、允许运行的 `iframe`
`"all_frames"` 字段允许该插件指定将 `JavaScript` 和 `CSS` 文件注入到符合指定网址要求的所有框架中，还是仅注入标签页中最顶层的框架。

> `manifest.json`
```json
{
  "name": "My extension",
  ...
  "content_scripts": [
    {
      "matches": ["https://*.nytimes.com/*"],
      "all_frames": true,
      "js": ["contentScript.js"]
    }
  ],
  ...
}
```

> `service-worker.js`
```ts
chrome.scripting.registerContentScripts([{
  id: "test",
  matches : [ "https://*.nytimes.com/*" ],
  allFrames : true,
  js : [ "contentScript.js" ],
}]);
```

| 名称           | 类型      | 说明  |
| ------------ | ------- | ------ |
| `all_frames` | 布尔值 `boolean` | **可选**。默认为 `false`，表示仅匹配顶部帧。  如果指定 `true`，所有帧都将注入到，即使帧不是标签页中的最顶层帧也是如此。系统会单独检查每个帧是否符合网址要求。如果不符合网址要求，则不会注入子框架。

## 七、通信
虽然内容脚本的执行环境和托管它们的页面彼此隔离，但它们共享对页面 `DOM` 的访问权限。如果网页希望通过内容脚本与内容脚本或插件进行通信，则必须通过共享 `DOM` 来实现。

可以使用 `window.postMessage()`

> `content-script.js`
```ts
var port = chrome.runtime.connect();
window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source !== window) {
    return;
  }

  if (event.data.type && (event.data.type === "FROM_PAGE")) {
    console.log("Content script received: " + event.data.text);
    port.postMessage(event.data.text);
  }
}, false);
```

> `example.js`
```ts
document.getElementById("theButton").addEventListener("click", () => {
  window.postMessage(
      {type : "FROM_PAGE", text : "Hello from the webpage!"}, "*");
}, false);
```

非插件网页 `example.html` 向自身发布消息。内容脚本拦截和检查此消息，然后发布到插件进程。通过这种方式，页面就能与扩展进程建立通信连接。反之亦然。

## 八、访问插件文件
如需从内容脚本访问插件文件，可以调用 `chrome.runtime.getURL()` 来获取插件资源的**绝对网址**。

> `content-script.js`
```ts
let image = chrome.runtime.getURL("images/my_image.png")
```

如需在 `CSS` 文件中使用字体或图片，可以使用 `@@extension_id` 构建网址，如以下示例所示 (`content.css`)：

> `content.css`
```css
body {
 background-image:url('chrome-extension://__MSG_@@extension_id__/background.png');
}

@font-face {
 font-family: 'Stint Ultra Expanded';
 font-style: normal;
 font-weight: 400;
 src: url('chrome-extension://__MSG_@@extension_id__/fonts/Stint Ultra Expanded.woff') format('woff');
}
```

所有资源都必须在 `manifest.json` 文件中声明为网络可访问资源：

> `manifest.json`
```json
{
 "web_accessible_resources": [
   {
     "resources": [ "images/*.png" ],
     "matches": [ "https://example.com/*" ]
   },
   {
     "resources": [ "fonts/*.woff" ],
     "matches": [ "https://example.com/*" ]
   }
 ],
}
```
## 九、禁止事项
### 1. `Eval()`
**以下为 `Manifest V3` 禁止使用案例**
> `content-script.js`
```ts
const data = document.getElementById("json-data");
// WARNING! Might be evaluating an evil script!
const parsed = eval("(" + data + ")");
```
### 2. 字符串拼接函数
**以下为 `Manifest V3` 禁止使用案例**
> `content-script.js`
```ts
const elmt_id = "...";
window.setTimeout("animate(" + elmt_id + ")", 200);
```
