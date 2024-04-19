# `Manifest.json` 文件字段解析

> **每个插件的根目录中都必须有一个 `manifest.json` 文件，其中列出了有关该插件的结构和行为的重要信息。**

## 一、`Demo` 展示

### 1. 基本清单文件

```json
{
  "manifest_version": 3,
  "name": "My Chrome Ext",
  "version": "1.0.0",
  "description": "Chrome Ext",
  "icons": {
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
}
```

### 2. 增加 `content_scripts` 内容脚本

```json
{
  "manifest_version": 3,
  "name": "Run script automatically",
  "description": "Add Context Scripts",
  "version": "1.0",
  "icons": {
    "16": "icon-16.png",
    "32": "icon-32.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  "content_scripts": [
    {
      "js": [
        "content-script.js"
      ],
      "matches": [
        "http://*.example.com//"
      ]
    }
  ]
}
```

### 3. 增加 `service_worker` 文件

```json
{
  "manifest_version": 3,
  "name": "Click to run",
  "description": "Add Service Worker",
  "version": "1.0",
  "icons": {
    "16": "icon-16.png",
    "32": "icon-32.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  "background": {
    "service_worker": "service-worker.js"
  },
  "action": {
    "default_icon": {
      "16": "icon-16.png",
      "32": "icon-32.png",
      "48": "icon-48.png",
      "128": "icon-128.png"
    }
  },
  "permissions": ["scripting", "activeTab"]
}
```

### 4. 增加 `action` 操作项

```json
{
  "manifest_version": 3,
  "name": "Popup extension that requests permissions",
  "description": "Add Action",
  "version": "1.0",
  "icons": {
    "16": "icon-16.png",
    "32": "icon-32.png",
    "48": "icon-48.png",
    "128": "icon-128.png"
  },
  "action": {
    "default_popup": "popup.html"
  },
  "host_permissions": [
    "https://*.example.com/"
  ],
  "permissions": [
    "storage"
  ]
}
```

### 5. 增加 `side_panel` 侧边栏

```json
{
  "manifest_version": 3,
  "name": "Side panel extension",
  "version": "1.0",
  "description": "Extension with a default side panel.",
  "icons": {
    "16": "images/icon-16.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  },
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "permissions": ["sidePanel"]
}
```

## 二、`Manifest.json` 文件字段及解析

### 1. `Chrome` 插件所必需的 `key`


#### 1.1 `manifest_version`

- 一个整数，用于指定插件使用的清单文件格式版本
- 目前唯一的值是 **3**（老版本可以用 2，但也即将不支持）

#### 1.2 `name`

- 一个字符串，用于在 [`Chrome` 应用商店](https://chromewebstore.google.com/)、安装对话框和用户的 `Chrome` 插件页面 (`chrome://extensions`) 中标识插件
- 长度上限为 75 个字符

#### 1.3 `version`

-  一个字符串，用于标识插件的版本号
- 一到四个以英文句点分隔的整数，用于标识此插件的版本
- 使用整数规则如下：
    - 整数必须介于 0 到 65,535 之间（含 0 和 65,535）
    - 非零整数不能以 0 开头，例如，032 无效，因为它以零开头
    - 它们不能都为零，例如，0 和 0.0.0.0 是无效的，而 0.1.0.0 是有效的
- 以下是有效版本的一些示例：
    - "version": "1"
    - "version": "1.0"
    - "version": "2.10.2"
    - "version": "3.1.2.4567"
- 比较从最左边的整数开始，然后，如果这些整数相等，则比较右侧的整数，依此类推，例如，1.2.0 是比 1.1.9.9999 更新的版本
- 缺少的整数等于零，例如，1.1.9.9999 比 1.1 更新，1.1.9.9999 低于 1.2

**Demo**

```json
{
  "manifest_version": 3, 
  "name": "My Chrome Ext Name", 
  "version": "0.0.1",
}
```

### 2. `Chrome` 应用商店所需的 `key`

#### 2.1 `description`

- 一个字符串，描述 `Chrome` 网上应用店和用户的插件管理页面上的字符串
- 长度上限为 132 个字符

![alt text](/basic-desc.png)


#### 2.2 `icons`

- 一个或多个代表插件的图标
- 建议使用 `PNG` 文件，但允许使用其他文件格式（`SVG` 和 `WebP` 文件除外）
- 如果计划在 `Chrome` 应用商店中分发插件，则必须提供图标
    | 图标大小 | 图标的使用 |
    | --- | --- |
    | 16x16 | 插件页面和上下文菜单上的网站图标 |
    | 32x32 | `Windows` 计算机通常需要此大小 |
    | 48x48 | 显示在插件管理页面上 |
    | 128x128 | 安装时会显示在 `Chrome` 应用商店中 |

**Demo**
```json
{
  "manifest_version": 3,
  "name": "chrome extension",
  "version": "0.0.1",
  "description": "My Chrome Extension description",
  "icons": {
    "16": "public/icons/icon_16.png",
    "32": "public/icons/icon_32.png",
    "48": "public/icons/icon_48.png",
    "128": "public/icons/icon_128.png"
  }
}
```

### 3. `Chrome` 插件可选 `key`

#### 3.1 `action`
- 定义插件图标在 `Chrome` 浏览器工具栏中的外观和行为
- `action` 中字段
  - `default_icon`：`string | object`
    - `action` 图标
  - `default_title`：`string`
    - 名称
  - `default_popup`：`string`
    - 弹出页面
- `action` 键（及其子项）是可选的
- 如果未添加此插件，相应插件仍会显示在工具栏中，以便用户访问此插件的菜单，因此，建议始终至少包含 `action` 和 `default_icon` 键
- [【 Chrome 浏览器插件 V3 版本 Manifest.json 文件中 Action 字段解析类型（Types）、方法（Methods）和事件（Events）】](https://juejin.cn/post/7322754558275747852)

**Demo**
```json
{
  "name": "Action Extension",
  "action": {
    "default_icon": {              
      "16": "images/icon16.png",   
      "24": "images/icon24.png",   
      "32": "images/icon32.png"    
    },
    "default_title": "Click Me",   
    "default_popup": "popup.html"  
  },
}
```
> `popup.html` 是点击 `chrome` 按钮弹出的页面

![alt text](/basic-popup.png)

#### 3.2 `author`

- 指定用于创建插件的帐号的电子邮件地址

**Demo**
```json
{
  "author": {
    "email": "user@example.com"
  },
}
```

#### 3.3 `background`

- 指定包含插件的 `Service Worker`（充当事件处理程序）的 `JavaScript` 文件，`Service Worker` 是后台脚本，充当插件的主事件处理脚本
- `background` 中的字段
  - `service_worker`：`string`
    - 脚本文件
  - `type`：`string`
    - 类型
- [【Chrome 浏览器插件 Manifest V3 版本新增中的 Service Worker 字段及解析】](https://blog.csdn.net/guoqiankunmiss/article/details/135554178)

**Demo**
```json
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  }
```

#### 3.4 `chrome_settings_overrides`

- 定义所选 `Chrome` 设置的替换项
- 设置覆盖是插件的一种覆盖所选 `Chrome` 设置的方式。该 `API` 适用于 `Windows` 和 `Mac` 的所有当前版本的 `Chrome`
- `search_provider`、`homepage` 和 `startup_pages` 属性的所有值都可以使用 `chrome.i18nAPI` 进行本地化
- 对于外部插件，可以使用注册表项对 `search_provider`、`homepage` 和 `startup_pages` 网址值进行参数化
- 可替换属性列表：
    - `alternate_urls`（字符串数组，可选）
        -   除 `search_url` 之外，还可使用的网址格式列表
    -   `encoding`（字符串，可选）
        -   用于搜索字词的编码。如果没有设置 `prepopulated_id`，则这个是必需的
    -   `favicon_url`（字符串，可选）
        -   搜索引擎的图标网址。如果没有设置 `prepopulated_id`，则这个是必需的
    -   `homepage`（字符串，可选）
        -   首页的新值
    -   `image_url`（字符串，可选）
        -   搜索引擎用于图片搜索的网址。如果不设置，则表示引擎不支持图片搜索
    -   `image_url_post_params`（字符串，可选）
        -   `image_url` 的 `post` 参数
    -   `is_default`（布尔值，**必需**）
        -   指定是否应将搜索服务提供商设置为默认搜索引擎
    -   `keyword`（字符串，可选）
        -   搜索引擎的多功能框关键字。如果没有设置 `prepopulated_id`，则这个是必需的
    -   `name`（字符串，可选）
        -   向用户显示的搜索引擎的名称。如果没有设置 `prepopulated_id`，则这个是必需的
    -   `prepopulated_id`（整数，可选）
        -   `Chrome` 内置搜索引擎的 `ID`
    -   `search_provider`（对象，可选）
        -   搜索引擎
    -   `search_url`（字符串，必需）
        -   搜索引擎使用的搜索网址
    -   `search_url_post_params`（字符串，可选）
        -   `search_url` 的 `post` 参数
    -   `startup_pages`（字符串数组，可选）
        -   一个长度为 1 的数组，其中包含将用作启动页的网址
    -   `suggest_url`（字符串，可选）
        -   搜索引擎用于获取建议的网址。如果未使用此属性，则引擎不支持建议
    -   `suggest_url_post_params`（字符串，可选）
        -   `suggest_url` 的 `post` 参数

**Demo**
```json
{
  "name": "My extension",
  "chrome_settings_overrides": {
    "homepage": "https://www.homepage.com",
    "search_provider": {
        "name": "name.__MSG_url_domain__",
        "keyword": "keyword.__MSG_url_domain__",
        "search_url": "https://www.foo.__MSG_url_domain__/s?q={searchTerms}",
        "favicon_url": "https://www.foo.__MSG_url_domain__/favicon.ico",
        "suggest_url": "https://www.foo.__MSG_url_domain__/suggest?q={searchTerms}",
        "instant_url": "https://www.foo.__MSG_url_domain__/instant?q={searchTerms}",
        "image_url": "https://www.foo.__MSG_url_domain__/image?q={searchTerms}",
        "search_url_post_params": "search_lang=__MSG_url_domain__",
        "suggest_url_post_params": "suggest_lang=__MSG_url_domain__",
        "instant_url_post_params": "instant_lang=__MSG_url_domain__",
        "image_url_post_params": "image_lang=__MSG_url_domain__",
        "alternate_urls": [
          "https://www.moo.__MSG_url_domain__/s?q={searchTerms}",
          "https://www.noo.__MSG_url_domain__/s?q={searchTerms}"
        ],
        "encoding": "UTF-8",
        "is_default": true
    },
    "startup_pages": ["https://www.startup.com"]
   },
}
```

#### 3.5 `chrome_url_overrides`

- 定义默认 `Chrome` 网页的替换项
- 使用 `HTML` 页面覆盖浏览器提供的页面，每个插件只能覆盖**一个**页面
- 可覆盖的页面：
  - 书签：`chrome://bookmarks`
    - 用户从 `Chrome` 菜单中选择“书签管理器”菜单项（或者在 Mac 上）从“书签”菜单中选择“书签管理器”菜单项时显示的网页
  - 历史记录：`chrome://history`
    - 用户从 `Chrome` 菜单中选择“历史记录”菜单项（或在 Mac 上从“历史记录”菜单中选择“显示全部历史记录”）时显示的页面
  - 新标签页：`chrome://newtab`
    - 用户创建新标签页或窗口时显示的页面
- 在无痕模式窗口中，插件无法覆盖新标签页页面

**Demo**
```json
{
  "chrome_url_overrides" : {
    "bookmarks": "myBookmarks.html",
    "history": "myHistory.html",
    "newtab": "myNewtab.html",
  },
}
```

#### 3.6 `commands`

- 定义插件中的键盘快捷键
- `commands API` 可用于添加可触发插件中操作的键盘快捷键，例如，打开浏览器操作或向插件发送命令的操作
- 必须在 `manifest.json` 声明 `commands`，才能使用此 `API`
- `Commands API` 允许插件开发者定义特定命令，并将其绑定到默认组合键
- 插件接受的每个命令都必须是在插件 `manifest.json` 中的 `commands` 对象的属性，属性键用作命令的名称，命令对象可以具有两个属性
  - `suggested_key`：用于声明命令的默认键盘快捷键，如果省略，则该命令解除绑定，类型为字符串或者 `object`
    - 字符串时为指定应在所有平台中使用的默认快捷键
    - 为对象时，包含 `defult`、`chromeos`、`linux`、`mac`、`windows` 属性
  - `description`：命令用途的简短描述，会显示在插件的键盘快捷键管理界面中
- 一个插件可以有多个命令，但是最多指定 4 个键盘快捷键，但是可以通过 `chrome://extensions/shortcuts` 手动添加更多的快捷方式
- [【Chrome 浏览器插件 V3 版本 Manifest.json 中 Commands API 字段解析及对应的 Types、Methods 和 Events】](https://blog.csdn.net/guoqiankunmiss/article/details/135554784)

**Demo**
```json
{
  "commands": {
    "run-foo": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y"
      },
      "description": "Run 'foo' on the current page."
    }
  }
}
```

#### 3.7 `content_scripts`

- 指定在用户打开某些网页时要使用的 `JavaScript` 或 `CSS` 文件，可以使用 `DOM`，可以读取浏览访问的网页信息，可以对其更改，并将消息传递给插件
- 可访问的 `API`：
  - `dom`
  - `i18n`
  - `storage`
  - `runtime`
    - `connect()`
    - `getManifest()`
    - `getURL()`
    - `id`
    - `onConnect`
    - `onMessage`
    - `sendMessage()`
- 其他 `API` 无法直接访问，可以通过插件来进行消息传递
- 注入方式：
  - 静态声明
    - `manifest.json` 中的 `content_scripts` 字段：`object` 数组
      - `matches`：`string` 数组
      - `css`：`string` 数组
      - `js`：`string` 数组
      - `run_at`：枚举：`document_start`、`document_end`、`document_idle`
      - `match_about_blank`：boolean
      - `match_origin_as_fallback`：boolean
      - `world`：枚举：`ISOLATED`、`MAIN`
      - `all_frames`：boolean
  - 动态声明
    - 使用 `chrome.scripting API` 的 `registerContentScripts` 进行注入
      - `registerContentScripts` 注入
      - `updateContentScripts` 更新
      - `getRegisteredContentScripts` 获取
      - `unregisterContentScripts` 移除
  - 编程的方式注入
    - 使用 `chrome.scripting API` 的 `executeScript` 进行注入，可注入 `js` 文件和函数
      - `files`：`string` 数组
      - `func`：`Function`
- [【Chrome 插件 V3 版本 Manifest.json 中的内容脚本（Content Scripts）解析】](https://blog.csdn.net/guoqiankunmiss/article/details/135593798)

**Demo**

1. 静态声明- `manifest.json` 文件
```json
{
 "name": "My extension",
 "content_scripts": [
   {
     "matches": ["https://*.nytimes.com/*"],
     "css": ["my-styles.css"],
     "js": ["content-script.js"]
   }
 ]
}
```

2. 动态声明- `service-worker` 文件
```js
// 注册
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

// 更新
chrome.scripting
  .updateContentScripts([{
    id: "session-script",
    excludeMatches: ["*://admin.example.com/*"],
  }])
  .then(() => console.log("registration updated"));

// 获取
chrome.scripting
  .getRegisteredContentScripts()
  .then(scripts => console.log("registered content scripts", scripts));

// 移除
chrome.scripting
  .unregisterContentScripts({ ids: ["session-script"] })
  .then(() => console.log("un-registration complete"));
```

3. 编程的方式注入- `service-worker` 文件
```js
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content-script.js"]
  });
});
```

#### 3.8 `content_security_policy`

- 定义对插件可以使用的脚本、样式和其他资源的限制
- 可以为插件网页和沙盒化插件网页定义单独的可选策略
- 包含字段：
  - `extension_pages`: `string`
    - 应用于插件的页面，指定了允许加载脚本的源（这里是插件自身）
  - `sandbox`: `string`
    - 应用于插件的沙箱规则，允许在沙箱中执行脚本，并指定默认源的策略
##### 3.8.1 默认策略

如果没有在 `manifest.json` 中定义 `content_security_policy`，将使用默认属性，默认值为：

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';",
    "sandbox": "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';"
  }
}
```

在这种情况下，插件只会从自己的打包资源加载本地脚本和对象。`WebAssembly` 将停用，该插件将不会运行内嵌 `JavaScript`，也无法将字符串评估为可执行代码。如果添加了沙盒页面，页面将拥有更宽松的权限，可以从插件外部评估脚本。

##### 3.8.2 自定义策略

`Chrome` 对插件页面强制执行最低的内容安全政策。这相当于在 `manifest.json` 中指定以下策略：

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';"
  }
}
```

`extension_pages` 策略的放宽限制不能超过此最小值。

**Demo**
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'",
    "sandbox": "sandbox allow-scripts allow-same-origin; default-src 'none'"
  },
}
```

#### 3.9 `cross_origin_embedder_policy`

- 指定 `Cross-Origin-Embedder-Policy HTTP` 标头的值，该标头用于配置在插件页面中嵌入跨源资源。
- `value`：`string` 枚举
  - `require-corp`
  - `credentialless`
  - `unsafe-none`

**Demo**
```json
{
  "cross_origin_embedder_policy": {
    "value": "require-corp"
  },
}
```
#### 3.10 `cross_origin_opener_policy`

- 指定 `Cross-Origin-Opener-Policy HTTP` 标头的值，可让确保顶级插件页面不会与跨源文档共享浏览上下文组
- `value`：`string` 枚举
  - `same-origin`
  - `same-origin-allow-popups`
  - `restrict-properties`
  - `unsafe-none`

**Demo**
```json
{
  "cross_origin_opener_policy": {
    "value": "same-origin"
  },
}
```

#### 3.11 `declarative_net_request`

- 定义 `declarativeNetRequest API` 的静态规则，以允许拦截和修改网络请求
- `rule_resources`：`Ruleset` 数组
  - `enabled`：`boolean` 是否默认启用
  - `id`：`string` 唯一标识符
  - `path`：`string` `JSON` 路径

**Demo**
```json
{
  "name": "My extension",
  "declarative_net_request" : {
    "rule_resources" : [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules_1.json"
    }, {
      "id": "ruleset_2",
      "enabled": false,
      "path": "rules_2.json"
    }]
  },
  "permissions": [
    "declarativeNetRequest",
    "declarativeNetRequestFeedback",
  ],
  "host_permissions": [
    "http://www.blogger.com/*",
    "http://*.google.com/*"
  ],
}
```

#### 3.12 `default_locale`

- 一个字符串，用于定义支持多个语言区域的插件的默认语言。例如 `en` 和 `pt_BR`
- 如果插件具有 `_locales` 目录，则 `Manifest.json` 必须定义 `default_locale`

**Demo**
```json
{
  "default_locale": "en",
}
```

#### 3.13 `devtools_page`

- 定义使用 `DevTools API` 的页面
- 使用`devtools.panels API` 创建面板并与之交互，包括将其他插件页面作为面板或边栏添加到开发者工具窗口中
- 使用 `devtools.inspectedWindow API` 获取已检查窗口的相关信息，并评估所检查窗口中的代码
- 使用 `devtools.network API` 获取有关网络请求的信息
- 使用 `devtools.recorder API` 扩展 `Recorder`面板

**Demo**
```json
{
  "name": "Chrome Ext",
  "version": "1.0",
  "devtools_page": "devtools.html",
}
```

### 3. `Chrome` 插件可选 `key`

#### 3.14 `export`

- 允许从插件导出资源
- 包含字段
  - `allowlist`：`string` 数组
    - 插件 `ID`

**Demo**
```json
{
  "version": "1.0",
  "name": "My Shared Module",
  "export": {
    "allowlist": [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    ]
  }
}
```

#### 3.15 `externally_connectable`

- 指定哪些其他页面和插件可以通过 `runtime.connect` 和 `runtime.sendMessage` 连接到插件
- 如果未在插件的清单中声明 `externally_connectable` 键，则所有插件都可以连接，但任何网页都无法连接
- 在更新清单以使用 `externally_connectable` 时，如果未指定 `ids: ["*"]`，其他插件将无法连接到插件
- 包含字段:
  - `ids`：`string` 数组
    - 允许连接的插件的 `ID`。如果留空或未指定，则任何插件或应用都无法连接。通配符 `*` 将允许所有插件和应用连接。
  - `matches`：`string` 数组
    - 允许连接的网页的网址格式。如果留空或未指定，则任何网页都无法连接。格式不能包含通配符网域，也不能包含（有效）顶级域名的子网域。
  - `accepts_tls_channel_id`：boolean
    - 允许插件使用与其连接的网页的 `TLS` 通道 `ID`。

| ✅ 有效网址 | ❌ 网址无效 |
| --- | --- |
| `*://example.com/` | `*://example.com/one/` |
| `http://*.example.org/*` | `<all_urls>` |
| `https://example.com/*` | `http://*/*` |

**Demo**
```json
{
  "name": "My externally connectable extension",
  "externally_connectable": {
    "ids": [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ],
    "matches": [
      "https://*.google.com/*",
      "*://*.chromium.org/*",
    ],
    "accepts_tls_channel_id": false
  },
}
```

#### 3.16 `homepage_url`

- 一个字符串，用于指定插件首页的网址，可以将插件的首页设置为个人或者公司网站
- 如果未定义，则首页默认是插件的 `Chrome` 应用商店页面

**Demo**
```json
{
  "manifest_version": 3,
  "name": "chrome extension",
  "version": "0.1.0",
  "description": "My Chrome Extension",
  "homepage_url": "https://guoqiankun.blog.csdn.net/",
}
```

![alt text](/basic-homepage.png)

#### 3.17 `host_permissions`

- 列出插件可以与之互动的网页（使用网址匹配模式定义）。系统会在安装时请求这些网站的用户权限
- `string` 数组
- 权限
  - `permissions`
    - 包含已知字符串列表中的项。更改可能会触发警告
  - `optional_permissions`
    - 由用户在运行时（而不是在安装时）授予
  - `content_scripts.matches`
    - 包含一个或多个匹配模式，可允许内容脚本注入到一个或多个主机中。更改可能会触发警告
  - `host_permissions`
    - 包含一个或多个匹配模式，可提供对一个或多个主机的访问权限。更改可能会触发警告
  - `optional_host_permissions`
    - 由用户在运行时（而不是在安装时）授予
- [【Chrome 浏览器插件 Manifest.json V3 中权限（Permissions）字段解析】](https://blog.csdn.net/guoqiankunmiss/article/details/135597089)

**Demo**
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

#### 3.18 `import`

- 允许将资源导入插件
- `object` 数组
  - `id`：`string`
    - 插件 `id`
  - `minimum_version`: string
    - 版本

**Demo**
```json
{
  "version": "1.0",
  "name": "My Importing Extension",
  "import": [
    {
      "id": "cccccccccccccccccccccccccccccccc"
    },
    {
      "id": "dddddddddddddddddddddddddddddddd",
      "minimum_version": "0.5"
    },
  ]
}
```

#### 3.19 `incognito`

- 定义插件在无痕模式下的行为
- 支持的值包括 `spanning`、`split` 和 `not_allowed`
  - `spanning`：跨域模式，插件将在单个共享进程中允许
  - `split`：分离模式，所以的网页都在无痕进程中运行
  - `not_allowed`：不允许，在无痕模式下无法启动插件
- 一般来讲，如果插件需要在无痕模式浏览器中加载标签页，使用 split 无痕模式行为，如果插件需要登录到远程服务器，请使用 spanning 无痕模式
- `chrome.storage.sync` 和 `chrome.storage.local` 始终在常规进程和无痕模式进程之间共享

**Demo**
```json
{
  "incognito": "not_allowed"
}
```
#### 3.20 `key`

- 为各种开发用例指定插件的 `ID`
  - 将服务器配置为仅接受来自 `Chrome` 插件来源的请求
  - 以便其他插件或网站向插件发送消息
  - 让网站可以访问插件的 `web_accessible_resources`

**Demo**
```json
{
  "manifest_version": 3,
  "key": "ThisKeyIsChromeKey",
}
```

#### 3.21 `minimum_chrome_version`

- 定义可安装插件的最低 `Chrome` 版本
- 该值必须是现有 `Chrome` 浏览器版本字符串的子字符串，例如 "107" 或 "107.0.5304.87"
- 如果用户的 `Chrome` 版本低于最低版本，则会在 `Chrome` 应用商店中看到“不兼容”警告，并且无法安装插件。如果将此插件添加到现有插件，则所用 `Chrome` 版本较低的用户将不会收到插件的自动更新

**Demo**
```json
{
  "minimum_chrome_version": "120.0.6099.129"
}
```
#### 3.22 `oauth2`

- 允许使用 `OAuth` 2.0 安全 `ID`
- 包含字段：
  - `client_id`：`string`
    - 客户端 `ID`
  - `scopes`：`string` 数组

**Demo**
```json
{
  "name": "OAuth Tutorial FriendBlock",
  "oauth2": {
    "client_id": "yourExtensionOAuthClientIDWillGoHere.apps.googleusercontent.com",
    "scopes":[""]
  },
}
```
#### 3.23 `omnibox`

- 允许插件在 `Chrome` 的地址栏中注册关键字
- 包含字段：
  - `keyword`：`string`
    - 关键字

**Demo**
```json
{
  "omnibox": { "keyword": "newTab" },
}
```

#### 3.24 `optional_host_permissions`

- 为插件声明可选的主机权限
- `string` 数组

**Demo**
```json
{
  "optional_host_permissions":[
    "https://*/*",
    "http://*/*"
  ],
}
```
#### 3.25 `optional_permissions`

- 为插件声明可选权限
- `string` 数组

**Demo**
```json
{
  "optional_permissions": [
    "topSites",
  ],
}
```
#### 3.26 `options_page`

- 指定 `options.html` 文件的路径，以将插件用作选项页面
![alt text](/basic-options.png)

**Demo**
```json
{
  "options_page": "index.html",
}
```

#### 3.27 `options_ui`

- 指定 `HTML` 文件的路径，该文件允许用户在 `Chrome` 插件页面更改插件选项。
- 包含字段：
  - `page`: `string`
    - 页面路径
  - `open_in_tab`: `boolean`
    - 是否在新标签页中打开插件的选项页面，如果设为 `false`，该插件的选项页面会嵌入 `chrome://extensions` 中，而不会在新标签页中打开

**Demo**
```json
{
  "name": "My extension",
  "options_ui": {
    "page": "options.html",
    "open_in_tab": false
  },
}
```

#### 3.28 `permissions`

- 允许使用特定的插件 `API`
- [【Chrome 浏览器插件 Manifest.json V3 中权限（Permissions）字段解析】](https://blog.csdn.net/guoqiankunmiss/article/details/135597089)

**Demo**
```json
"permissions": [
  "storage",
  "activeTab",
  "scripting"
]
```

#### 3.29 `requirements`

- 列出使用插件所需的技术
- 会使用此列表来阻止用户安装无法在其电脑上使用的插件

**Demo**
```json
{
  "requirements": {
    "3D": {
      "features": ["webgl"]
    }
  }
}
```

#### 3.30 `sandbox`

- 定义一组插件页面，它们无权访问插件 `API` 或直接访问非沙盒化页面
- 插件的沙盒化网页使用的内容安全政策在 `content_security_policy` 键中指定
- 处于沙盒环境中会产生以下两个影响：
  - 沙盒化页面将无权访问插件 `API`，也无法直接访问未经过沙盒化的页面（可通过 `postMessage()` 与它们进行通信）
  - 沙盒化页面不受插件其余部分使用的内容安全政策 (`CSP`)（有自己的单独的 `CSP` 值）的约束。这意味着，它可以使用内嵌脚本和 `eval`

**Demo**
```json
{
  "content_security_policy": {
    "sandbox": "sandbox allow-scripts; script-src 'self' https://example.com"
  },
  "sandbox": {
    "pages": [
      "page1.html",
      "directory/page2.html"
    ]
  },
}
```

#### 3.31 `short_name`

- 一个字符串，包含要在字符空间有限时使用的插件名称的缩写版本
- 长度上限为 12 个字符。如果未定义，将显示 `name` 键的截断版本

**Demo**
```json
{
  "short_name": "short name"
}
```
#### 3.32 `side_panel`

- 标识要在 `sidePanel` 中显示的 `HTML` 文件
- 包含字段：
  - `default_path`：`string`
    - 侧边栏页面路径
- ![侧边栏](/image-15.png)

**Demo**
```json
{
  "name": "My side panel extension",
  "side_panel": {
    "default_path": "sidepanel.html"
  }
}
```

#### 3.33 `storage`

- 声明托管存储区域的 `JSON` 架构
- 包含字段：
  - `managed_schema`: `string`
    - 插件中包含策略架构的文件
- 如果策略架构无效，`Chrome` 不会加载插件，并指出未通过验证的原因

**Demo**
```json
{
  "name": "My enterprise extension",
  "storage": {
    "managed_schema": "schema.json"
  },
}
```

**`JSON` 架构示例**
```json
{
  "type": "object",
  "properties": {
    "AutoSave": {
      "title": "Automatically save changes.",
      "description": "If set to true then changes will be automatically saved.",
      "type": "boolean"
    },
    "PollRefreshRate": {
      "type": "integer"
    },
    "DefaultServiceUrl": {
      "type": "string"
    },
    "ServiceUrls": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "Bookmarks": {
      "type": "array",
      "id": "ListOfBookmarks",
      "items": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "url": { "type": "string" },
          "children": { "$ref": "ListOfBookmarks" }
        }
      }
    },
    "SettingsForUrls": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "blocklisted": { "type": "boolean" },
          "bypass_proxy": { "type": "boolean" }
        }
      }
    }
  }
}
```

#### 3.34 `tts_engine`

- 将插件注册为文字转语音引擎
- 包含字段：
  - `voices`: 对象数组
    - `voice_name`: `string`
      - 名称，必需
    - `lang`: `string`
      - 语言，可选，但强烈建议使用
    - `event_types`: `string` 数组
      - 类型数组，强烈建议至少支持 `["end"]`
      - 支持的值为：`start、word、sentence、marker、end、error`


**Demo**
```json
{
  "name": "My TTS Engine",
  "version": "1.0",
  "permissions": ["ttsEngine"],
  "tts_engine": {
    "voices": [
      {
        "voice_name": "Alice",
        "lang": "en-US",
        "event_types": ["start", "marker", "end"]
      },
      {
        "voice_name": "Pat",
        "lang": "en-US",
        "event_types": ["end"]
      }
    ]
  },
  "background": {
    "page": "background.html",
    "persistent": false
  }
}
```

#### 3.35 `update_url`

- 一个字符串，包含插件更新页面的网址
- 如果是在 `Chrome` 应用商店之外托管插件，需要添加此字段

**Demo**
```json
{
  "name": "My extension",
  "update_url": "https://myhost.com/mytestextension/updates.xml",
}
```
#### 3.36 `version_name`

- 一个描述插件版本的字符串。例如 `1.0 beta` 和 `build rc2`
- 如果未指定，则改为在插件管理页面上显示 `version` 值

**Demo**
```json
{
  "version_name": "1.0 beta"
}
```
#### 3.37 `web_accessible_resources`

- 定义插件中可供网页或其他插件访问的文件
- 对象数组
  - `resources`: `string` 数组
    - 每个字符串都包含从插件根目录到给定资源的相对路径，可以使用 * 来匹配通配符
  - `matches`: `string` 数组
    - 每个字符串都包含一个匹配模式，用于指定哪些网站可以访问这些资源
  - `extension_ids`: `string` 数组
    - 每个字符串都包含可以访问资源的插件 `ID`
  - `use_dynamic_url`: `boolean`
    - 如果为 `true`，则仅允许通过动态 `ID` 访问资源
- 每个对象都必须包含一个 `resources` 字段以及一个 `matches` 或 `extension_ids` 字段，`use_dynamic_url` 是可选的

**Demo**
```json
{
  "web_accessible_resources": [
    {
      "resources": [ "test1.png", "test2.png" ],
      "matches": [ "https://web-accessible-resources-1.glitch.me/*" ]
    }, {
      "resources": [ "test3.png", "test4.png" ],
      "matches": [ "https://web-accessible-resources-2.glitch.me/*" ],
      "use_dynamic_url": true
    }
  ],
}
```

### 4. `ChromeOS` 可选的 `Key`

#### 4.1 `file_browser_handlers`

- 提供对 `fileBrowserHandler API` 的访问权限，该 `API` 允许插件访问 `ChromeOS` 文件浏览器
- 对象数组

**Demo**
```json
{
  "name": "My extension",
  "file_browser_handlers": [
    {
      "id": "upload",
      "default_title": "Save to Gallery",
      "file_filters": [
        "filesystem:*.jpg",
        "filesystem:*.jpeg",
        "filesystem:*.png"
      ]
    }
  ],
  "permissions" : [
    "fileBrowserHandler"
  ],
}
```
#### 4.2 `file_handlers`

- 指定 `ChromeOS` 插件要处理的文件类型
- 对象数组
  - `action`: `string`
    - 文件类型
  - `name`: `string`
    - 名称
  - `accept`: `object`
    - 接受的类型
  - `launch_type`: 枚举
    - 单个客户端还是多个客户端
    - 值为：`single-client、multiple-clients`，默认值为 `single-client`

**Demo**
```json
{
  "file_handlers": [
    {
      "action": "/open_text.html",
      "name": "Plain text",
      "accept": {
        "text/plain": [".txt"]
      },
      "launch_type": "single-client"
    }
  ]
}
```

#### 4.3 `file_system_provider_capabilities`

- 允许访问 `fileSystemProvider API`，以便插件创建 `ChromeOS` 可以使用的文件系统
- 包含字段：
  - `configurable`: `boolean`
    - 是否支持通过 `onConfigureRequested` 进行配置，默认为 `false`
  - `multiple_mounts`: `boolean`
    - 是否支持多个，默认为 `false`
  - `watchable`: `boolean`
    - 是否支持设置观察期，默认为 `false`
  - `source`: 枚举
    - 值为：`file、device、network`

**Demo**
```json
{
  "name": "My extension",
  "permissions": [
    "fileSystemProvider"
  ],
  "file_system_provider_capabilities": {
    "configurable": true,
    "watchable": false,
    "multiple_mounts": true,
    "source": "network"
  },
}
```
#### 4.4 `input_components`

- 允许使用 `Input Method Editor API`
- 数组对象:
  - `name`: `string`
    - 名称
  - `id`: `string`
    - `id`
  - `language`: `string`
    - 语言
  - `layouts`: `string | string[]`
    - 输入法的可选列表
  - `input_view`: `string`
    - 指定插件资源
  - `options_page`: `string`
    - 指定插件资源，未提供的话则默认使用插件的选项页面

**Demo**
```json
{
  "input_components": [{
    "name": "ToUpperIME",
    "id": "ToUpperIME",
    "language": "en",
    "layouts": ["us::eng"]
  }]
}
```

## 三、`Manifest.json` 文件全字段示例

```json
{
  "manifest_version": 3, 
  "name": "My Chrome Ext Name", 
  "version": "0.0.1",
  "description": "My Chrome Extension description",
  "icons": {
    "16": "public/icons/icon_16.png",
    "32": "public/icons/icon_32.png",
    "48": "public/icons/icon_48.png",
    "128": "public/icons/icon_128.png"
  },
  "action": {
    "default_icon": {              
      "16": "images/icon16.png",   
      "24": "images/icon24.png",   
      "32": "images/icon32.png"    
    },
    "default_title": "Click Me",   
    "default_popup": "popup.html"  
  },
  "author": {
    "email": "user@example.com"
  },
  "background": {
    "service_worker": "service-worker.js",
    "type": "module"
  },
  "chrome_settings_overrides": {
    "homepage": "https://www.homepage.com",
    "search_provider": {
      "name": "name.__MSG_url_domain__",
      "keyword": "keyword.__MSG_url_domain__",
      "search_url": "https://www.foo.__MSG_url_domain__/s?q={searchTerms}",
      "favicon_url": "https://www.foo.__MSG_url_domain__/favicon.ico",
      "suggest_url": "https://www.foo.__MSG_url_domain__/suggest?q={searchTerms}",
      "instant_url": "https://www.foo.__MSG_url_domain__/instant?q={searchTerms}",
      "image_url": "https://www.foo.__MSG_url_domain__/image?q={searchTerms}",
      "search_url_post_params": "search_lang=__MSG_url_domain__",
      "suggest_url_post_params": "suggest_lang=__MSG_url_domain__",
      "instant_url_post_params": "instant_lang=__MSG_url_domain__",
      "image_url_post_params": "image_lang=__MSG_url_domain__",
      "alternate_urls": [
        "https://www.moo.__MSG_url_domain__/s?q={searchTerms}",
        "https://www.noo.__MSG_url_domain__/s?q={searchTerms}"
      ],
      "encoding": "UTF-8",
      "is_default": true
    },
    "startup_pages": ["https://www.startup.com"]
  },
  "chrome_url_overrides" : {
    "bookmarks": "myBookmarks.html",
    "history": "myHistory.html",
    "newtab": "myNewtab.html"
  },
  "commands": {
    "run-foo": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y"
      },
      "description": "Run 'foo' on the current page."
    }
  },
  "content_scripts": [
    {
      "matches": ["https://*.nytimes.com/*"],
      "css": ["my-styles.css"],
      "js": ["content-script.js"]
    }
  ],
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self';",
    "sandbox": "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';"
  },
  "cross_origin_embedder_policy": {
    "value": "require-corp"
  },
  "cross_origin_opener_policy": {
    "value": "same-origin"
  },
  "declarative_net_request" : {
    "rule_resources" : [{
      "id": "ruleset_1",
      "enabled": true,
      "path": "rules_1.json"
    }, {
      "id": "ruleset_2",
      "enabled": false,
      "path": "rules_2.json"
    }]
  },
  "default_locale": "en",
  "devtools_page": "devtools.html",
  "export": {
    "allowlist": [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
    ]
  },
  "externally_connectable": {
    "ids": [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    ],
    "matches": [
      "https://*.google.com/*",
      "*://*.chromium.org/*",
    ],
    "accepts_tls_channel_id": false
  },
  "homepage_url": "https://guoqiankun.blog.csdn.net/",
  "permissions": [
    "activeTab",
    "contextMenus",
    "storage"
  ],
  "optional_permissions": [
    "topSites"
  ],
  "host_permissions": [
    "https://www.developer.chrome.com/*"
  ],
  "optional_host_permissions":[
    "https://*/*",
    "http://*/*"
  ],
  "import": [
    {
      "id": "cccccccccccccccccccccccccccccccc"
    },
    {
      "id": "dddddddddddddddddddddddddddddddd",
      "minimum_version": "0.5"
    }
  ],
  "incognito": "not_allowed",
  "key": "ThisKeyIsChromeKey",
  "minimum_chrome_version": "120.0.6099.129",
  "oauth2": {
    "client_id": "yourExtensionOAuthClientIDWillGoHere.apps.googleusercontent.com",
    "scopes":[""]
  },
  "omnibox": { 
    "keyword": "newTab"
  },
  "options_page": "index.html",
  "options_ui": {
    "page": "options.html",
    "open_in_tab": false
  },
  "requirements": {
    "3D": {
      "features": ["webgl"]
    }
  },
  "sandbox": {
    "pages": [
      "page1.html",
      "directory/page2.html"
    ]
  },
  "short_name": "short name",
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "storage": {
    "managed_schema": "schema.json"
  },
  "tts_engine": {
    "voices": [
      {
        "voice_name": "Alice",
        "lang": "en-US",
        "event_types": ["start", "marker", "end"]
      },
      {
        "voice_name": "Pat",
        "lang": "en-US",
        "event_types": ["end"]
      }
    ]
  },
  "update_url": "https://myhost.com/mytestextension/updates.xml",
  "version_name": "1.0 beta",
  "web_accessible_resources": [
    {
      "resources": [ "test1.png", "test2.png" ],
      "matches": [ "https://web-accessible-resources-1.glitch.me/*" ]
    }, {
      "resources": [ "test3.png", "test4.png" ],
      "matches": [ "https://web-accessible-resources-2.glitch.me/*" ],
      "use_dynamic_url": true
    }
  ],
  "file_browser_handlers": [
    {
      "id": "upload",
      "default_title": "Save to Gallery",
      "file_filters": [
        "filesystem:*.jpg",
        "filesystem:*.jpeg",
        "filesystem:*.png"
      ]
    }
  ],
  "file_handlers": [
    {
      "action": "/open_text.html",
      "name": "Plain text",
      "accept": {
        "text/plain": [".txt"]
      },
      "launch_type": "single-client"
    }
  ],
  "file_system_provider_capabilities": {
    "configurable": true,
    "watchable": false,
    "multiple_mounts": true,
    "source": "network"
  },
  "input_components": [{
    "name": "ToUpperIME",
    "id": "ToUpperIME",
    "language": "en",
    "layouts": ["us::eng"]
  }]
}
```