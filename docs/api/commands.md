# 一、`Commands` 概念和用法

- 定义插件中的键盘快捷键。
- `commands API` 可用于添加可触发插件中操作的键盘快捷键，例如，打开浏览器操作或向插件发送命令的操作。
- 必须在 `manifest.json` 声明 `commands`，才能使用此 `API`。
- 一个插件可以有多个命令，但最多可指定 4 个建议的键盘快捷键。用户可以通过 `chrome://extensions/shortcuts` 对话框手动添加更多快捷方式。

## 一、各模块中 `chrome.commands API` 内容
### 1. `Service worker` 中 `commands` 内容

![service worker commands](/image-36.png)

### 2. `Action` 中 `commands` 内容

![action commands](/image-37.png)

### 3. `Content` 中 `commands` 内容

![content commands](/image-38.png)

## 二、属性

**属性键** **将用作命令的名称。命令对象可以具有两个属性。**

### 1. `suggested_key`

可选属性，用于声明命令的默认键盘快捷键。如果省略，该命令将解除绑定。此属性可以接受字符串或对象值。

- `string`：用于指定应在所有平台中使用的默认键盘快捷键。
- `object`：组合键对象

### 2. `description`

用于为用户提供命令用途的简短说明的字符串。字符串类型。标准命令必须包含说明，而操作命令会忽略说明。

- `string`

### 3. 示例

```json
"commands": {
  "run-foo": {
    "suggested_key": {
      "default": "Ctrl+Shift+Y",
      "mac": "Command+Shift+Y"
    },
    "description": "Run "foo" on the current page."
  }
}
```

## 三、支持的键

### 1. `Alpha` 键

- `A … Z`

### 2. 数字键

- 0 … 9

### 3. 标准键

- 常规键–`Comma, Period, Home, End, PageUp, PageDown, Space, Insert, Delete`
- 箭头键–`Up, Down, Left, Right`
- 媒体键–`MediaNextTrack, MediaPlayPause, MediaPrevTrack, MediaStop`

### 4. 辅助键

-   `Ctrl`、`Alt`（`macOS` 上为 `Option`）、`Shift`、`MacCtrl`（仅限 `macOS`）、`Command`（仅限 `macOS`）、`Search`（仅限 `ChromeOS`）

## 四、组合键

- 插件命令快捷方式必须包含 `Ctrl` 或 `Alt`。
    - 修饰符**不能**与媒体键结合使用。
- 在 `macOS` 上，`Ctrl` 会自动转换为 `Command`。
    - 如需在 `macOS` 上使用 `Ctrl` 键，请在定义 `"mac"` 快捷方式时将 `Ctrl` 替换为 `MacCtrl`。
    - 将 `MacCtrl` 用于其他平台会导致出现验证错误，并会阻止该插件安装。

- `Shift` 是所有平台上的可选修饰符。
-   `Search` 是 `ChromeOS` 独有的可选修饰符。
-   某些操作系统和 `Chrome` 快捷方式（例如窗口管理）始终优先于插件命令快捷方式，因此无法被覆盖。

## 五、命令处理事件

### 1. 示例

```json
{
  "name": "My extension",
  "commands": {
    "run-foo": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y"
      },
      "description": "Run "foo" on the current page."
    },
    "_execute_action": {
      "suggested_key": {
        "windows": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y",
        "chromeos": "Ctrl+Shift+U",
        "linux": "Ctrl+Shift+J"
      }
    }
  },
}
```

在 `Service Worker` 中，可以使用 `onCommand.addListener` 将处理程序绑定到清单中定义的每个命令。

```ts
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});
```

## 六、操作命令

`_execute_action (Manifest V3)、_execute_browser_action (Manifest V2)` 和 `_execute_page_action (Manifest V2)` 命令分别预留用于触发操作、浏览器操作或网页操作的操作。

## 七、范围

默认情况下，`commands` 的适用范围为 `Chrome` 浏览器。这意味着，当浏览器没有焦点时，命令快捷方式处于非活动状态。

全局命令的键盘快捷键建议仅限 `Ctrl+Shift`+[0..9]。这是一种保护措施，可最大限度地降低覆盖其他应用中快捷键的风险。


# 二、`Chrome.commands API` 类型（`Types`）、方法（`Methods`）、事件（`Events`）

## 一、`Command` 属性

### 1. **`description`**

可选属性，`Command` 描述

-   `string`

### 2. **`name`**

可选属性，`Command` 名称

-   `string`

### 3. **`shortcut`**

可选属性，此命令已启用快捷键，否则留空。

-   `string`

## 二、方法

### 1. `getAll()`

**返回此插件的所有已注册的插件命令及其快捷方式**

#### 1.1. 示例

```ts
chrome.commands.getAll(
  callback?: function,
)
```

#### 1.2. 参数

-   **callback: function（可选）**
    - `callback` 参数如下所示：

```ts
(commands: Command[])=>void
```

#### 1.3. 返回

-   **`Promise<`** `Command` **`[]>`**

## 三、事件

### 1. `onCommand`

**使用键盘快捷键激活注册的命令时触发**

#### 1.1. 示例

```ts
chrome.commands.onCommand.addListener(
  callback: function,
)
```

#### 1.2. 参数

-   **`callback：function`**
    - `callback` 参数如下所示：

```ts
(command: string,tab?: tabs.Tab)=>void
```

# 三、示例

## 一、基本命令

借助命令，插件可以将逻辑映射到用户可以调用的键盘快捷键。最基本的命令是只需插件清单中的命令声明和监听器注册。

> `manifest.json`:

```json
{
  "name": "Command demo - basic",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "service-worker.js"
  },
  "commands": {
    "inject-script": {
      "suggested_key": "Ctrl+Shift+Y",
      "description": "Inject a script on the page"
    }
  }
}
```

> `service-worker.js`：

```ts
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" triggered`);
});
```

## 二、操作命令

> `manifest.json`:

```json
{
  "name": "Commands demo - action invocation",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "service-worker.js"
  },
  "permissions": ["activeTab", "scripting"],
  "action": {},
  "commands": {
    "_execute_action": {
      "suggested_key": {
        "default": "Ctrl+U",
        "mac": "Command+U"
      }
    }
  }
}
```

> `service-worker.js`：

```ts
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    func: contentScriptFunc,
    args: ['action'],
  });
});

function contentScriptFunc(name) {
  alert(`"${name}" executed`);
}

// This callback WILL NOT be called for "_execute_action"
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command "${command}" called`);
});
```

## 三、验证已注册的命令

如果某个插件尝试注册的快捷方式已被其他插件使用，则第二个插件的快捷方式将无法按预期注册。可以通过预测这种可能性并在安装时检查是否发生碰撞来提供更强大的最终用户体验。

> `service-worker.js`：

```ts
chrome.runtime.onInstalled.addListener(({details}) => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    checkCommandShortcuts();
  }
});

// Only use this function during the initial install phase. After
// installation the user may have intentionally unassigned commands.
function checkCommandShortcuts() {
  chrome.commands.getAll((commands) => {
    let missingShortcuts = [];

    for (let {name, shortcut} of commands) {
      if (shortcut === '') {
        missingShortcuts.push(name);
      }
    }

    if (missingShortcuts.length > 0) {
      // Update the extension UI to inform the user that one or more
      // commands are currently unassigned.
    }
  });
}
```
