# `Chrome.storage API` 解析

前文说了 `cookie API`，拿在存储方面就少不了 `storage` 模块

使用 `chrome.storage API` 存储、检索和跟踪用户数据的更改

## 一、各模块中的 `chrome.storage` 内容

### 1. `Service worker` 中 `runtime` 内容

![service storage](/image-45.png)

### 2. `Action` 中 `runtime` 内容

![action storage](/image-46.png)

### 3. `Content` 中 `runtime` 内容

![content storage](/image-47.png)

## 二、权限（Permissions）
如果需使用 `Storage API`，需要在 `manifest.json` 文件中添加权限

```json
{
  "permissions": [    
    "storage"
  ],
}
```

## 三、`Chrome.storage API` 功能

`Storage API` 提供一种特定于插件的方法来保留用户数据和状态。它类似于 `Web` 平台的存储 `API`（`IndexedDB` 和 `Storage`），但在设计上是为了满足插件的存储需求

### 1. `Chrome.storage API` 主要功能
- 所有插件上下文（包括插件 `Service Worker` 和内容脚本）都可以访问 `Storage API`
- 可序列化的 `JSON` 值存储为对象属性
- `Storage API` 是异步的，支持批量读取和写入操作
- 即使用户清除缓存和浏览记录，这些数据仍会保留
- 即使在无痕模式拆分后，存储的设置也会保留
- 包含一个用于企业政策的专属只读代管式存储区域

### 2. 插件如何使用 `Web Storage API`
尽管插件可以在某些上下文（弹出式窗口和其他 `HTML` 网页）中使用 `Storage` 接口（可通过 `window.localStorage` 访问），但不建议使用该接口，原因如下：
- 扩展 `Service Worker` 无法使用 `Web Storage API`
- 内容脚本与托管网页共享存储空间
- 当用户清除浏览记录后，使用 `Web Storage API` 保存的数据将会丢失

### 3. 从 `Web Storage API` 移至 `Service Worker` 的 `Storage API`

- 使用转换例程和 `onMessage` 处理程序创建屏幕外文档
- 在扩展 `Service Worker` 中，检查 `chrome.storage` 以获取数据
- 如果找不到数据，请创建屏幕外文档并调用 `sendMessage()` 以启动转换例程
- 在屏幕外文档的 `onMessage` 处理程序内，调用转换例程

### 4. `Storage API 存储区域`
- `storage.local`
  - 数据会存储在本地，并会在移除插件时清除。存储空间上限为 10 MB，但可以通过请求 "unlimitedStorage" 权限提高上限，建议使用 storage.local 存储大量数据。
- `storage.sync`
  - 如果同步功能已启用，数据会同步到用户登录的任何 Chrome 浏览器。如果停用，其行为类似于 storage.local。当浏览器离线时，Chrome 会将数据存储在本地，并在浏览器恢复在线状态后恢复同步。配额限制大约为 100 KB，每项内容 8 KB。建议使用 storage.sync 来保留已同步的浏览器的用户设置。如果处理的是敏感用户数据，请改用 storage.session。
- `storage.session`
  - 在浏览器会话期间将数据保留在内存中。默认情况下，它不会向内容脚本公开，但可以通过设置 chrome.storage.session.setAccessLevel() 来更改此行为。存储空间上限为 10 MB。storage.session 接口是建议 Service Worker 的若干接口之一。
- `storage.managed`
  - 管理员可以使用架构和企业政策在受管环境中配置支持插件的设置。此存储区域是只读的。

## 四、`Chrome.storage API` 类型（`Types`）

### 1. `AccessLevel`
> 存储区域的访问权限级别

类型为枚举

#### 枚举值

- `TRUSTED_CONTEXTS`
  - 用于指定源自插件本身的上下文
- `TRUSTED_AND_UNTRUSTED_CONTEXTS`
  - 指定源自该插件外部的上下文

### 2. `StorageArea`
> 存储区域
#### 属性

##### 1. `onChanged`
> 在一项或多项更改时触发
- `onChanged`: Event\<function\>

`onChanged.addListener` 监听 `demo`

```js
onChanged.addListener((callback: function)=> {...})
```

`callback` 参数如下

```js
(changes: object)=>void
```
##### 2. `clear`

> 从存储空间中移除所有内容

`clear` 函数如下所示：

```js
(callback?: function)=> {...}
```

##### 3. `get`
> 从存储空间中获取一项或多项内容

`get` 函数如下所示：
```js
(keys?: string|string[]|object,callback?: function)=> {...}
```

`keys`: 要获取的单个键、要获取的键的列表，或指定默认值的字典。空列表或对象将返回空的结果对象。传入 null 以获取存储空间的全部内容。

##### 4. `getBytesInUse`

> 获取一项或多项内容占用的空间量（以字节为单位）

`getBytesInUse` 函数如下所示：

```js
(keys?: string|string[],callback?: function)=> {...}
```
`keys`: 用于获取总用量的单个键或键列表。空列表将返回 0。传入 null 可获取所有存储空间的总用量


##### 5. `remove`

> 从存储空间中移除一项或多项内容

`remove` 函数如下所示：
```js
(keys: string|string[],callback?: function)=> {...}
```
`keys`: 要移除的项的单个键或键列表

##### 6. `set`

> 设置多个项

`set` 函数如下所示

```js
(items: object,callback?: function)=> {...}
```
items: 一个对象，提供用于更新存储空间的每个键值对。存储空间中的其他键值对不会受到影响

##### 7. `setAccessLevel`

> 为存储区域设置所需的访问权限级别
`setAccessLevel` 函数如下所示：
```js
(accessOptions: object,callback?: function)=> {...}
```
`accessOptions`: 对象
  - `accessLevel`: `AccessLevel`


### 3. `StorageChange`

#### 属性
##### 1. `newValue`


##### 2. oldValue

## 五、`Chrome.storage API` 属性（`Properties`）
### 1. `local`
> local 存储区域中的内容是每台机器的本地内容

#### 1. 类型
`StorageArea` 对象

#### 2. 属性
- `QUOTA_BYTES`: 10485760
  - 本地存储空间中可存储的数据量上限（以字节为单位），衡量依据是每个值的 `JSON` 字符串化处理以及每个密钥的长度。如果插件具有 `unlimitedStorage` 权限，则系统将忽略此值。如果更新会导致超出此限制，则更新会立即失败，并在使用回调时设置 `runtime.lastError；如果使用` `async/await`，则设置被拒的 `Promise。`
### 2.  `managed`
> `managed` 存储区域中的内容由域管理员设置，并且对于插件是只读的；尝试修改此命名空间会导致错误。

#### 1. 类型
`StorageArea`

### 3. `session`
> session 存储区域中的内容存储在内存中，不会持久保留到磁盘中

#### 1. 类型
`StorageArea` 对象

#### 属性
- `QUOTA_BYTES`: 10485760
  - 可存储在内存中的数据量上限（以字节为单位），计算方式为：估算每个值和键的动态分配内存用量。会导致超出此限制的更新会立即失败，并且会在使用回调或 Promise 遭拒时设置 runtime.lastError。

### 4. `sync`
> sync 存储区域中的内容会通过 Chrome 同步功能进行同步

#### 1. 类型
`StorageArea` 对象

#### 2. 属性
- `MAX_ITEMS`: 512
  - 同步存储空间中可存储的内容数量上限。会导致超出此限制的更新将立即失败，并在使用回调或 Promise 遭拒时设置 runtime.lastError
- `MAX_WRITE_OPERATIONS_PER_HOUR`: 1800
  - 每小时可执行的 set、remove 或 clear 操作次数上限。此上限是每 2 秒 1 次，低于短期的更高每分钟写入次数限制
- `MAX_WRITE_OPERATIONS_PER_MINUTE`: 120
  - 每分钟可执行的 set、remove 或 clear 操作次数上限。此速率为每秒 2 次，在更短的时间段内，提供的吞吐量比每小时写入次数更高
- `QUOTA_BYTES`: 102400
  - 可存储在同步存储空间中的数据总量（以字节为单位），衡量依据是每个值和每个密钥的长度的 JSON 字符串化处理
- `QUOTA_BYTES_PER_ITEM`: 8192
  - 同步存储空间中每一项的大小上限（以字节为单位），衡量依据是相应项的值加上密钥长度的 JSON 字符串化处理

## 六、`Chrome.storage API` 事件（`Events`）
### 1. `onChanged`
> 在一项或多项更改时触发
```js
chrome.storage.onChanged.addListener(
  callback: function,
)
```

`callback` 参数如下所示：
```js
(changes: object,areaName: string)=>void
```

## 七、示例

### 1. `Storage API` 用法示例
```js
chrome.storage.local.set({ key: value }).then(() => {
  console.log("Value is set");
});

chrome.storage.local.get(["key"]).then((result) => {
  console.log("Value is " + result.key);
});
```

```js
chrome.storage.sync.set({ key: value }).then(() => {
  console.log("Value is set");
});

chrome.storage.sync.get(["key"]).then((result) => {
  console.log("Value is " + result.key);
});
```

```js
chrome.storage.session.set({ key: value }).then(() => {
  console.log("Value was set");
});

chrome.storage.session.get(["key"]).then((result) => {
  console.log("Value is " + result.key);
});
```

### 2. 同步响应存储空间更新

```js
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});
```

### 3. 从存储空间异步预加载

```js
const storageCache = { count: 0 };
const initStorageCache = chrome.storage.sync.get().then((items) => {
  Object.assign(storageCache, items);
});

chrome.action.onClicked.addListener(async (tab) => {
  try {
    await initStorageCache;
  } catch (e) {
  }
  storageCache.count++;
  storageCache.lastTabId = tab.id;
  chrome.storage.sync.set(storageCache);
});
```
