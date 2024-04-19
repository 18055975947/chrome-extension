# `Chrome.cookie API` 解析

前端开发肯定少不了和 `cookie` 打交道，此文较详细的介绍下 `chrome.cookie` 的 `API` 以及在 `popup、service worker、content` 中如何获取的

## 一、各模块 `chrome.cookies` 内容

### 1. `Service worker` 中 `runtime` 内容

![service cookies](/image-42.png)

### 2. `Action` 中 `runtime` 内容

![action cookies](/image-43.png)

### 3. `Content` 中 `runtime` 内容

![content cookies](/image-44.png)

## 二、权限（Permissions）
如果需使用 `Cookie API`，需要在 `manifest.json` 文件中添加权限（`Permissions`）和主机权限（`host_permissions`）字段

```json
"permissions": [    
    "cookies"
],
"host_permissions": [
    "https://*.lkcoffee.com/*"
]
```
比如，我需要获取 `domain` 为 `.lkcoffee.com` 的 `cookie`，就需要在 `host_permissions` 中进行 `host` 的配置

## 三、`Chrome.cookies API` 类型（`Types`）
### 1. `Cookie`
> 表示关于 `HTTP Cookie` 的信息。
#### 属性
- `domain: string`
    - `cookie` 的 `domain`
- `expirationDate: number` 可选
    - `Cookie` 的有效期
- `hostOnly: boolean`
    - `host-only` 时为 `true`
- `httpOnly: boolean`
    - `httpOnly` 时为 `true`
- `name: string`
    - 名称
- `partitionKey: CookiePartitionKey` 可选
    - 用于通过分区属性读取或修改 `Cookie` 的分区键。
- `path: string`
    - 路径
- `sameSite: SameSiteStatus`
    - 同网站状态。
- `secure: boolean`
    - `Secure` 值
- `session: booean`
    - 是否是会话
- `storeId: string`
    - 包含此 `Cookie` 的 `Cookie` 存储区的 `ID`，如 `getAllCookieStores()` 中所提供。
- `value: string`
    - `cookie` 值

### 2. `CookieDetails`
> 用于标识 `Cookie` 的详细信息。

#### 属性
- `name: string`
    - 要访问的 `Cookie` 的名称。
- `partitionKey: CookiePartitionKey` 可选
    - 用于通过分区属性读取或修改 `Cookie` 的分区键。
- `storeId: string` 可选
    - 要在其中查找 `Cookie` 的 `Cookie` 存储区的 `ID`
- `url: string`
    - 与要访问的 `Cookie` 相关联的网址。

### 3. `CookiePartitionKey`
> 表示分区 `Cookie` 的分区键。

#### 属性
- `topLevelSite: string` 可选
    - 提供分区 `Cookie` 的 `top-level`

### 4. `CookieStore`
> 表示浏览器中的 `Cookie` 存储
#### 属性
- `id: string`
    - `Cookie` 存储区的唯一标识符。
- `tabIds: number[]`
    - 共享此 `Cookie` 存储区的所有浏览器标签页的标识符。
### 5. `OnChangedCause`
> `Cookie` 发生更改的根本原因。

> 如果 `Cookie` 已插入或通过显式调用 `chrome.cookies.remove` 被移除，为 `explicit`。如果 `Cookie` 是因过期而自动移除的，为 `expired`。如果 `Cookie` 因被已过期的失效日期覆盖而被移除，为 `expired_overwrite`。如果 `Cookie` 因垃圾回收而自动移除，为 `evicted`。如果 `Cookie` 因 `set` 调用覆盖而自动移除，为 `overwrite`。
#### 枚举
- `evicted`
- `expired`
- `explicit`
- `expired_overwrite`
- `overwrite`


### 6. SameSiteStatus
> `Cookie` 的 `SameSite` 状态。

> `no_restriction`为 `SameSite=None`，`lax` 为`SameSite=Lax`，`strict` 为 `SameSite=Strict`，`unspecified` 为没有设置 `SameSite` 属性的 `Cookie`。

#### 枚举
- `no_restriction`：`SameSite=None`
- `lax`：`SameSite=Lax`
- `strict`：`SameSite=Strict`
- `unspecified`：没有设置 `SameSite`


## 四、`Chrome.cookies API` 方法（`Methods`）

### 1. `get()`
> 检索单个 `Cookie` 的相关信息。如果指定网址存在多个同名的 `Cookie`，则返回路径最长的 `Cookie`。对于具有相同路径长度的 `Cookie`，系统将返回创建时间最早的 `Cookie`。
#### 1.1 示例
```
chrome.cookies.get(
  details:
  CookieDetails,
  callback?:
  function,
)
```
#### 1.2 参数
- `details: CookieDetails`
- `callback: function` 可选
    - `(cookie?: Cookie)=>void`

#### 1.3 返回

- `Promise<Cookie|undefined>`


### 2. `getAll()`
> 从单个 Cookie 存储区中检索符合指定信息的所有 Cookie。返回的 Cookie 将进行排序，路径最长的 Cookie 排在最前面。如果多个 Cookie 具有相同的路径长度，创建时间最早的 Cookie 会排在最前面。此方法仅检索插件拥有主机权限的网域的 Cookie。
#### 2.1 示例
```
chrome.cookies.getAll(
  details:
  object,
  callback?:
  function,
)
```
#### 2.2 参数
- `details: object`
    - `domain: string` 可选
    - `name: string` 可选
    - `partitionKey: CookiePartitionKey` 可选
        - 用于通过分区属性读取或修改 `Cookie` 的分区键。
    - `path: string` 可选
    - `secure: boolean` 可选
    - `session: boolean` 可选
    - `storeId: string` 可选
    - `url: string` 可选
- `callback: function` 可选
    - `(cookies:Cookie[])=>void`

#### 2.3 返回

-  `Promise<Cookie[]>`


### 3. `getAllCookieStores()`
> 列出所有现有的 `Cookie` 存储。
#### 3.1 示例
```
chrome.cookies.getAllCookieStores(
  callback?:
  function,
)
```
#### 3.2参数
- `callback: function` 可选
    - `(cookieStores: CookieStore[])=>void`
#### 3.3 返回

-   `Promise<CookieStore[]>`

### 4. `remove()`
> 按名称删除 Cookie。
#### 4.1 示例
```
chrome.cookies.remove(
  details:
  CookieDetails,
  callback?:
  function,
)
```
#### 4.2 参数
- `details: CookieDetails`
    - `name: string`
    - `partitionKey: CookiePartitionKey` 可选
        - 用于通过分区属性读取或修改 `Cookie` 的分区键。
    - `storeId: string`
    - `url: string`
- `callback: function` 可选
    - `(details?:object)=>void`
#### 4.3 返回
-   `Promise<object|undefined>`

### 5. `set()`
> 使用指定的 `Cookie` 数据设置 `Cookie`；可能会覆盖等效的 `Cookie`（如果存在）。
#### 5.1 示例
```
chrome.cookies.set(
  details:
  object,
  callback?:
  function,
)
```

#### 5.2 参数
- `details: object`
    - `domain: string` 可选
        - `cookie` 的 `domain`
    - `expirationDate: number` 可选
        - `Cookie` 的有效期
    - `httpOnly: boolean` 可选
        - `httpOnly` 时为 `true`
    - `name: string` 可选
        - 名称
    - `partitionKey: CookiePartitionKey` 可选
        - 用于通过分区属性读取或修改 `Cookie` 的分区键。
    - `path: string` 可选
        - 路径
    - `sameSite: SameSiteStatus` 可选
        - 同网站状态。
    - `secure: boolean` 可选
        - `Secure` 值
    - `storeId: string` 可选
        - 包含此 `Cookie` 的 `Cookie` 存储区的 `ID`，如 `getAllCookieStores()` 中所提供。
    - `url: string`
    - `value: string` 可选
        - `cookie` 值
- `callback: function` 可选
    - `(cookie?:Cookie)=>void`

    -   饼干

        [Cookie](https://developer.chrome.com/docs/extensions/reference/api/cookies?hl=zh-cn#type-Cookie) 可选

        包含有关已设置的 Cookie 的详细信息。如果设置因任何原因失败，此值将为“null”并设置为 [`runtime.lastError`](https://developer.chrome.com/docs/extensions/reference/runtime/?hl=zh-cn#property-lastError)。

#### 5.3返回
-   `Promise<Cookie|undefined>`

## 五、`Action Popup` 模块获取 `Cookies`
```typescript
// 根据 domain 获取
const cookies = await chrome.cookies.getAll({ domain:  '.lkcoffee.com'})
console.log('popup cookies--->', cookies)
// 根据 url 获取
const urlCookies = await chrome.cookies.getAll({ url: url })
console.log("popup urlCookies", urlCookies);
```

![cookie 获取](/image-16.png)

## 六、`Background Service Worker` 模块获取 `Cookies`

```typescript
const cookies = await chrome.cookies.getAll({ domain:  '.lkcoffee.com'})
console.log('service worker cookies--->', cookies)
```

![cookie 获取](/image-17.png)

## 七、`Content Scripts` 模块获取 `Cookies`
因为 `Content Scripts` 是注入当前页面的，所以和 `web` 一样获取即可
```ts
document.cookie
```


