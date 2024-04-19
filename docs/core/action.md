# `Action`

## 一、`Manifest.json` 中的 `action`

### 1.`Action` 

#### 1.1. 概念
定义插件图标在 `Chrome` 浏览器工具栏中的外观和行为


#### 1.2 `action` 中字段
- `default_icon`：`string | object`
  - `action` 图标
- `default_title`：`string`
  - 名称
- `default_popup`：`string`
  - 弹出页面
- `action` 键（及其子项）是可选的
- 如果未添加此插件，相应插件仍会显示在工具栏中，以便用户访问此插件的菜单，因此，建议始终至少包含 `action` 和 `default_icon` 键

#### 1.3 示例
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

#### 1.4 支持版本

`Chrome 88 以及更高版本`

## 二、`Chrome.action API` 类型（`Types`）

### 1. `OpenPopupOptions`

#### 1. 属性

- **`windowId: number`** **可选** 
  - 打开操作弹出式窗口的窗口 `ID`。如果未指定，则默认为当前活动窗口。

### 2. `TabDetails`

#### 1. 属性

-   **`tabId: number`** **可选** 
  -   要查询其状态的标签页 `ID`。如果未指定标签页，则返回非标签页专属状态。

### 3. `UserSettings`

与插件操作相关的用户指定设置的集合。

#### 1. 属性

-   **`isOnToolbar: boolean`** 
  -   插件的操作图标是否显示在浏览器窗口的顶级工具栏中（例如，用户是否已“固定”插件）。

## 三、`Chrome.action API` 方法（`Methods`）

### 1. `disable()`

**停用标签页操作。**

#### 1. 示例

```ts
chrome.action.disable(
  tabId?: number,
  callback?: function,
)
```

#### 2. 参数

-   **`tabId: number`** **可选**
  - 要为其修改操作的标签页的 `ID`。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：

```ts
()=>void
```

#### 3. 返回

-   **`Promise<void>`**

### 2. `enable()`

**为标签页启用操作。默认情况下，操作处于启用状态。**

#### 1. 示例

```ts
chrome.action.enable(
  tabId?: number,
  callback?: function,
)
```

#### 2. 参数

- **`tabId: number`** **可选**
  - 要为其修改操作的标签页的 `ID`。
- **`callback: function`（可选）**
  - `callback` 参数如下所示

```ts
()=>void
```

#### 3. 返回

- **`Promise<void>`**

### 3. `getBadgeBackgroundColor()`

**获取操作的背景颜色。**

#### 1. 示例

```ts
chrome.action.getBadgeBackgroundColor(
  details: TabDetails,
  callback?: function,
)
```

#### 2. 参数

- **`details`:** `TabDetails`
- **`callback function`（可选）**
  - `callback` 参数如下所示

```ts
(result:ColorArray)=>void
```

#### 3. 返回

-   **`Promise<`** `browserAction.ColorArray` **`>`**
  - `ColorArray: [number, number, number, number]`

### 4. `getBadgeText()`

**获取操作的标记文本。**

如果未指定标签页，则返回非标签页专用标志文本。如果启用了 `displayActionCountAsBadgeText`，则系统将返回占位符文本，除非存在 `declarativeNetRequestFeedback` 权限或提供了标签页专用的标记文本。

#### 1. 示例

```ts
chrome.action.getBadgeText(
  details: TabDetails,
  callback?: function,
)
```

#### 2. 参数

- **`details:`** `TabDetails`
- **`callback: function`（可选）**
  - `callback` 参数如下所示：

```ts
(result: string)=>void
```

#### 3. 返回

- **`Promise<string>`**

### 5. `getBadgeTextColor()`

**获取操作的文本颜色。**

#### 1. 示例

```ts
chrome.action.getBadgeTextColor(
  details: TabDetails,
  callback?: function,
)
```

#### 2. 参数

- **`details:`** `TabDetails`
-  **`callback`** **`functioon`（可选）**
  - `callback` 参数如下所示：

```ts
(result: ColorArray)=>void
```

#### 3. 返回

- **`Promise<`** `browserAction.ColorArray` **`>`**

### 6. `getPopup()`

**获取设置为此操作的弹出式窗口的 `HTML` 文档。**

#### 1. 示例

```ts
chrome.action.getPopup(
  details: TabDetails,
  callback?: function,
)
```

#### 2. 参数

- **`details:`** `TabDetails`
- **`callback function`（可选）**
  - `callback` 参数如下所示：

```ts
(result:string)=>void
```

#### 3. 返回

- **`Promise<string>`**

### 7. `getTitle()`

**获取操作的标题。**

#### 1. 示例

```ts
chrome.action.getTitle(
  details: TabDetails,
  callback?: function,
)
```

#### 2. 参数

-   **`details:`** `TabDetails`
-   **`callback: function`（可选）**
  -   `callback` 参数如下所示：

```ts
(result: string)=>void
```

#### 3. 返回

-   **`Promise<string>`**

### 8. `getUserSettings()`

**返回与插件操作相关的用户指定设置。**

#### 1. 示例

```ts
chrome.action.getUserSettings(
  callback?: function,
)
```

#### 2. 参数

-   **`callback: function`（可选）**
  - `callback` 参数如下所示：

```ts
(userSettings: UserSettings)=>void
```

#### 3. 返回

-   **`Promise<`** `UserSettings` **`>`**

### 9. `isEnabled()`

**指示是否已为标签页启用插件操作**（如果未提供 tabId，则是在全局范围内启用）。仅使用 `declarativeContent` 启用的操作始终返回 false。

#### 1. 示例

```ts
chrome.action.isEnabled(
  tabId?: number,
  callback?: function,
)
```

#### 2. 参数

-   **`tabId: number`** **可选**
  - 要检查其启用状态的标签页的 `ID`。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：

```ts
(isEnabled: boolean)=>void
```

#### 3. 返回

-   **`Promise<boolean>`**

### 10. `openPopup()`

**打开插件的弹出式窗口。**

#### 1. 示例

```ts
chrome.action.openPopup(
  options?: OpenPopupOptions,
  callback?: function,
)
```

#### 2. 参数

-   **`options:`** `OpenPopupOptions` **可选**
  - 指定用于打开弹出式窗口的选项。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：`()=>void`

#### 3. 返回

-   **`Promise<void>`**

### 11. `setBadgeBackgroundColor()`

**设置标志的背景颜色。**

#### 1. 示例

```ts
chrome.action.setBadgeBackgroundColor(
  details: object,
  callback?: function,
)
```

#### 2. 参数

- **`details: object`**
  - **`color: string|ColorArray`**
    - `ColorArray`一个由 [0,255] 范围内的四个整数组成的数组，这些整数构成了徽章的 RGBA 颜色。例如，不透明的红色为 [255, 0, 0, 255]。也可以是具有 `CSS` 值的字符串，其中不透明红色为 `#FF0000` 或 `#F00`。
  - **`tabId: number`** **可选**
    - 将更改限制为选择特定标签页的时间。关闭标签页后自动重置。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：`()=>void`

#### 3. 返回

-   **`Promise<void>`** 

### 12. `setBadgeText()`

**设置操作的标记文本。标记会显示在图标顶部。**

#### 1. 示例

```ts
chrome.action.setBadgeText(
  details: object,
  callback?: function,
)
```

#### 2. 参数

-   **`details: object`**
  - **`tabId: number`** **可选**
    - 将更改限制为选择特定标签页的时间。关闭标签页后自动重置。
  - **`text: string`（可选）**
    - 可以传递任意数量的字符，但不得超过四个字符。如果传递了空字符串 ('')，标志文本将被清除。如果指定了 `tabId` 且 `text` 为 `null`，指定标签页的文本将会被清除，并默认为全局标记文本。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：`()=>void`

#### 3. 返回

-   **`Promise<void>`**

### 13. `setBadgeTextColor()`

**设置标志的文本颜色。**

#### 1. 示例

```ts
chrome.action.setBadgeTextColor(
  details: object,
  callback?: function,
)
```

#### 2. 参数

-   **`details: object`**
  - **`color: string|ColorArray`**
  - **`tabId: number`** **可选**
    - 将更改限制为选择特定标签页的时间。关闭标签页后自动重置。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：`()=>void`

#### 3. 返回

- **`Promise<void>`**

### 14. `setIcon()`

**设置操作的图标。**

可将图标指定为图像文件的路径、画布元素的像素数据或上述任何一项的字典。必须指定 **`path`** 或 **`imageData`** 属性。

#### 1. 示例

```ts
chrome.action.setIcon(
  details: object,
  callback?: function,
)
```

#### 2. 参数

- **`details: object`**
  - **`imageData:`** **`ImageData`** **| `object`（可选）**
    - `ImageData` 对象或表示要设置的图标的 {`size -> ImageData`} 字典。如果将图标指定为字典，则系统会根据屏幕的像素密度选择要使用的实际图片。如果适合一个屏幕空间单位的图片像素数等于 `scale`，则系统会选择尺寸为 `scale * n` 的图片，其中 `n` 是界面中图标的尺寸。必须至少指定一张图片。请注意，`"details.imageData = foo"` 等同于 `"details.imageData = {'16': foo}"`
  - **`path`:** **`string|object`** ******可选**
    - 相对图片路径或指向要设置的图标的字典 {`size -> relative image path`}。
  - **`tabId: number`** **可选**
    - 将更改限制为选择特定标签页的时间。关闭标签页后自动重置。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：`()=>void`

#### 3. 返回

-   **`Promise<void>`**

### 15. `setPopup()`

**设置 HTML 文档，使其在用户点击操作的图标时以弹出式窗口的形式打开。**

#### 1. 示例

```ts
chrome.action.setPopup(
  details: object,
  callback?: function,
)
```

#### 2. 参数

- **`details: object`**
  - **`popup:`** **`string`**
    - 要在弹出式窗口中显示的 `HTML` 文件的相对路径。如果设置为空字符串 ('')，系统不会显示弹出式窗口。
  -  **`tabId: number`** **可选**
    - 将更改限制为选择特定标签页的时间。关闭标签页后自动重置。
- **`callback: function`（可选）**
  - `callback` 参数如下所示：`()=>void`

#### 3. 返回

- **`Promise<void>`**

### 16. `setTitle()`

**设置操作的标题。这会显示在提示中。**

#### 1. 示例

```ts
chrome.action.setTitle(
  details: object,
  callback?: function,
)
```

#### 2. 参数

- **`details: object`**
  - **`tabId: number`** **可选**
    - 将更改限制为选择特定标签页的时间。关闭标签页后自动重置。
  - **title: string**
    - 鼠标悬停时，操作应显示的字符串。
- **`callback: funtion`（可选）**
  - `callback` 参数如下所示：`()=>void`

#### 3. 返回

- **`Promise<void>`**

## 四、`Chrome.action API` 事件（`Events`）

### 1. `onClicked`

**点击操作图标时触发。**

**如果操作具有弹出式窗口，则不会触发此事件。**

#### 1. 示例

```ts
chrome.action.onClicked.addListener(
  callback: function,
)
```

#### 2. 参数

- **`callback: function`**
  - `callback` 参数如下所示：

```ts
(tab: tabs.Tab)=>void
```
