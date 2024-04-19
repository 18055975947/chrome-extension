# Chrome 插件开发过程中问题集
> 持续更新...

本篇收集 `chrome` 浏览器插件开发过程中所遇到的问题以及解决方案

## 一、CRXJS 开发插件问题集

### 1. Popup 页面点击不显示正常页面

#### 1.1. 如果点击 popup 页面如下图所示，不展示正常的页面

![error](/summarize/image-26.png)
#### 1.2. 解决方法
1. 点击插件【错误】按钮
![error](/summarize/image-27.png)
2. 点击【全部清除】按钮
![在这里插入图片描述](/summarize/image-28.png)
3. 点击刷新按钮
![reload](/summarize/image-29.png)
4. 点击 `popup` 页面
![在这里插入图片描述](/summarize/image-30.png)

### 2. 使用 React 结合 CRXJS 时不能新加 .tsx 文件

#### 2.1. 问题描述

使用 `React` 时，创建新的 `.tsx` 文件，打包构建时出现问题

#### 2.2. 解决方法

这个是因为 `CRXJS` 中的 `HMR` 与 `@vite/plugin-react-swc` 有冲突，需要改用 `@vitejs/plugin-react`

在创建项目的时候，选择 `React` 和 `TypeScript` 即可

![create pro](/image-95.png)

### 3. CRXJS 项目发布问题

`CRXJX` 项目也需要 `build` 构建，`dev` 运行生成的 `dist` 文件夹为开发模式，在开发时使用，需要发布的时候也要通过 `build` 命令生成新的 `dist` 包

## 二、源码问题集

### 1. http://127.0.0.1:5500 的问题

#### 1.1. 问题描述

在运行源码的时候，很多时候可能由于文章看的不仔细，导致在这一步出现问题

#### 1.2. 解决方法

由于写文章和源码都是在本地服务上进行测试，`http://127.0.0.1:5500` 为本地启动的服务，是由 `Live Server vs code` 插件启动的，可以详细根据文章来改变匹配的域名或启动对应的服务

### 2. Fetch 报错

#### 2.1. 问题展示
```shell
service-worker.js:1 Error checking folder changes: TypeError: Failed to fetch
at service-worker.js:1:555
at Array.forEach (<anonymous>)
at c (service-worker.js:1:543)
```

![fetch error](/image-93.png)

#### 2.2. 解决方法

这个是 `fetch` 请求报错，请求的时候要把 `URL` 改掉，域名和端口要改成本地的才行，你看下请求配置 `fileList` 的配置你看下是不是和本地不一样

![answer](/image-94.png)

## 三、开发中其他问题集

### 1. 在 service-worker 中引入第三方包时报错

#### 1.1. 问题展示

```shell
Cannot use import statement outside a module
```

#### 1.2. 解决方法

使用第三方包 `import` 引入的时候需要在 `manifest.json` 的 `background` 中加入这个 `"type": "module"` 才行

```json
{
  "background": {
    "service_worker": "service_worker.js",
    "type": "module"
  }
}
```

### 2. 嵌入的页面调用 `contentJS` 的方法，一直显示 `undefined`

#### 2.1. 问题描述

想再嵌入的页面中调用 `contentJS` 方法，但是一直显示 `undefined`

#### 2.2. 解决方法

不能直接调用 `contentJS` 方法，需要注入之后放到 `window` 下

1. 先在 `contentjs` 中创建函数 `func`
2. 在 `contentjs` 中 监听消息通信，在 `chrome.runtime.onMessage.addListener` 中进行方法暴露：`window.func = func`
3. 在页面中需要进行能触发 2 的事件，2 触发之后，就可以执行 `func` 函数了

