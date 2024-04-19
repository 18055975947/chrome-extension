# Chrome.permissions API
## 一、`chrome.permissions API` 类型（`Types`）
### 1. `Permissions` 属性
#### 1.1 `origins`
- `string[]` 选填
- 主机权限的列表，包括清单中的 `optional_permissions` 或 `permissions` 键中指定的权限，以及与内容脚本相关联的权限。
#### 1.2 `permissions`
- `string[]` 选填
- 已命名权限（不包括主机或源）的列表。

## 二、`chrome.permissions API` 方法（`Methods`）
### 1. `contains()`
> 检查插件是否具有指定权限。
#### 1.1 示例
```ts
chrome.permissions.contains(
  permissions:
  Permissions,
  callback?:
  function,
)
```
#### 1.2 参数
- `permissions: Permissions`
- `callback: function` 可选 `(result: boolean) => void`
#### 1.3 返回
- `Promise<boolean>`
如果插件具有指定的权限，则为 `true`。如果将某个来源同时指定为可选权限和内容脚本匹配模式，则返回 `false`，除非同时授予这两项权限。
### 2. `getAll()`
> 获取插件的当前权限集。
#### 2.1 示例
```ts
chrome.permissions.getAll(
  callback?:
  function,
)
```
#### 2.2 参数
- `callback: function` 可选 `(permissions:  Permissions)=>void`
#### 2.3 返回
- `Promise<Permissions>`
插件的有效权限。
### 3. `remove()`
> 移除对指定权限的访问权限。
#### 3.1 示例
```ts
chrome.permissions.remove(
  permissions:
  Permissions,
  callback?:
  function,
)
```
#### 3.2 参数
- `permissions: Permissions`
- `callback: function` 可选 `(removed:  boolean)=>void`
#### 3.3 返回
- `Promise<boolean>`
如果权限已移除，则为 `true`。
### 4. `request()`
> 请求访问指定权限，必要时向用户显示提示。这些权限必须在清单的 `optional_permissions` 字段中定义，或者是用户保留的必需权限。
#### 4.1 示例
```ts
chrome.permissions.request(
  permissions:
  Permissions,
  callback?:
  function,
)
```
#### 4.2 参数
- `permissions: Permissions`
- `callback: function` 可选 `(granted:  boolean)=>void`
#### 4.3 返回
- `Promise<boolean>`
如果用户授予了指定的权限，则为 `true`

## 三、`chrome.permissions API` 事件（`Events`）
### 1. `onAdded`
> 在插件获取新权限时触发
#### 1.1 示例
```ts
chrome.permissions.onAdded.addListener(
  callback:
  function,
)
```
#### 1.2 参数
- `callback: function`  
```ts
(permissions:  Permissions)=>void
```

### 2. `onRemoved`
> 在移除插件的权限时触发。
#### 2.1 参数
- `callback: function` 
```ts
(permissions:  Permissions)=>void
```


