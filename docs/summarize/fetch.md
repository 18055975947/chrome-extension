# 网络请求

常规网页可以使用 `fetch()` 或 `XMLHttpRequest API` 从远程服务器发送和接收数据，但受到同源政策的限制。

内容脚本会代表已注入内容脚本的网页源发起请求，因此内容脚本也受同源政策的约束，插件的来源不受限制。

在插件 `Service Worker` 或前台标签页中执行的脚本可以与其源之外的远程服务器通信，前提是该插件请求跨源权限。

## 一、`XMLHttpRequest` 和 `Fetch`

`fetch()` 是专为 `Service Worker` 创建的，遵循远离同步操作的更广泛的网络趋势。`Service Worker` 之外的扩展支持` XMLHttpRequest() API`，调用它会触发扩展 `Service Worker` 的提取处理程序

**`Service Worker` 模块不支持 `XMLHttpRequest`**，因此在新的插件中进行接口网络请求需使用 `Fetch`

```js
const response = await fetch('https://www.example.com/greeting.json'')
console.log(response.statusText);
```

## 二、`Fetch` 请求

### 1. 请求插件内容模块
> 每个正在运行的插件都存在于各自独立的安全源中。该插件无需请求额外的权限，即可调用 fetch() 来获取安装范围内的资源

如果某个插件在 `config_resources/` 文件夹中包含一个名为 `config.json` 的 `JSON` 配置文件，则该插件可以检索该文件的内容

```js
const response = await fetch('/config_resources/config.json');
const jsonData = await response.json();
```

### 2. 跨源请求

需在 `manifest.json` 中添加 `host_permissions` 字段

```json
{
  "name": "My extension",
  "host_permissions": [
    "https://www.douban.com/"
  ],
}
```

### 3. `content_scripts` 中进行网络请求

1. `manifest.json` 文件配置

```json
{
  "content_scripts": [
    {
      "matches": ["https://movie.douban.com/*"],
      "css": ["content/index.css"],
      "js": ["content/jquery.js", "content/index.js"]
    }
  ],
  "host_permissions": [
    "https://movie.douban.com/*"
  ],
}
```

2. `content/index.js` 进行数据请求

```js
const response = await fetch("https://movie.douban.com/j/tv/recommend_groups")
if (!response.ok) {
  throw new Error('Network response was not ok')
}
const allData = await response.json()
console.log('content index allData', allData)
```

3. 日志输出

![日志输出](/image-30.png)

### 4. `service_worker` 中进行网络请求

1. `manifest.json` 文件配置

```json
{
  "host_permissions": [
    "https://movie.douban.com/*"
  ],
}
```

2. `service_worker.js` 进行数据请求

```js
const response = await fetch("https://movie.douban.com/j/tv/recommend_groups")
if (!response.ok) {
  throw new Error('Network response was not ok')
}
const allData = await response.json()
console.log('service worker allData', allData)
```

3. 日志输出

![日志输出](/image-31.png)

### 5. `Action` 中进行网络请求


1. `manifest.json` 文件配置

```json
{
  "host_permissions": [
    "https://movie.douban.com/*"
  ],
}
```

2. `index.js` 进行数据请求

```js
const response = await fetch("https://movie.douban.com/j/tv/recommend_groups")
if (!response.ok) {
  throw new Error('Network response was not ok')
}
const allData = await response.json()
console.log('Action allData', allData)
```

3. 日志输出

![日志输出](/image-32.png)