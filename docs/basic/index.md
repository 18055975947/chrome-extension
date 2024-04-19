# `Chrome` 插件

## 一、什么是 `Chrome` 浏览器插件？

> 官方叫法是 `extensions`（扩展），但是好像从接触到使用到开发就一直说的是插件，所以本册都是用这种叫法

`Chrome` 浏览器插件可通过自定义界面、观察浏览器事件和修改网络来提升浏览体验

## 二、`Chrome` 浏览器插件是如何构建的？

使用 `Web` 技术开构建 `Chrome` 插件：`HTML、CSS、JS`

现在开发 `Chrome` 插件可以使用 `Vite/Webpack` 结合 `Vue/React`、`Pinia/Zustand`、`Naive-ui/Ant Design` 开发 `Chrome` 插件

此小册将会带大家从原生 `JS` 开发到使用 `Vue` 和 `React` 开发以及最后的使用第三方库 `Crxjs` 开发 `Chrome` 插件

## 三、`Chrome` 浏览器插件可以做什么？

> 根据需求自定义 `Chrome`，让 `Chrome` 的功能更强大。

### 1. 设计界面

大多数插件都需要某种类型的用户互动才能正常运行

插件平台提供了多种方式来向插件添加互动。这些方法包括从 `Chrome` 工具栏、侧边栏、上下文菜单等触发的弹出式窗口：

#### 1.  侧边栏（`Side panel`）
> 使用 `chrome.sidePanel API` 可将内容托管在浏览器侧边栏中的网页主要内容旁边。

![Side panel](/image-4.png)

#### 2.  操作项（`Action`）
> 控制插件图标在工具栏中的显示。

![Action](/image-5.png)

#### 3.  菜单项（`Menus`）
> 向 Google Chrome 的上下文菜单添加项。

![Menus](/image-6.png)

### 2. 控制浏览器

借助 `Chrome` 的插件 `API`，可以改变浏览器的工作方式：
1.  覆盖 `Chrome` 页面和设置项：`Manifest.json` 配置 `chrome_settings_overrides`
2.  插件开发者工具：`Manifest.json` 配置 `devtools_page`
3.  显示通知：`chrome.notifications API`
4.  管理历史记录：`chrome.history API`
5.  控制标签页和窗口：`chrome.tabs、chrome.tabGroups` 和 `chrome.windows` 等 `API`
6.  键盘快捷键：`chrome.commands API`
7.  身份认证：`chrome.identity API`
8.  管理插件：`chrome.management API`
9.  提供建议：`chrome.omnibox API`
10. 更新 `Chrome` 设置：`chrome.proxy API`
11. 下载管理：`chrome.downloads API`
12. 书签：`chrome.bookmarks API`
13. ...

### 3. 控制网络

可以通过注入脚本、拦截网络请求以及使用 `Web API` 与网页进行交互，来控制和修改 `Web`：
1.  注入 `JS` 和 `CSS` 文件
2.  访问当前 `Tab` 页
3.  控制 `Web` 请求
4.  录音和屏幕截图
5.  修改网站设置

## 四、`Chrome` 插件核心概念
> 使用 Web 平台和扩展 API，可以通过组合不同的界面组件和扩展平台功能来构建更复杂的功能。

### 1. `Service Worker`

`Service worker` 是一个基于事件的脚本，在浏览器后台运行。它通常用于处理数据、协调扩展中不同部分的任务，以及作为扩展的事件管理器。

### 2. `Permissions` 权限

插件在浏览器中获取的功能和数据访问权限，通过声明所需的权限，插件可以执行更广泛的操作。

权限最小化原则，需要哪些权限加哪些权限。

### 3. `Content script` 内容脚本

内容脚本是在网页环境中运行的文件，可以操作 `DOM`，读取浏览器访问网页的信息，对网页就行更改等。

### 4. `Action` 

浏览器工具栏中显示的图标或按钮，用户可以单击该图标或按钮来执行插件提供的功能或操作。

### 5. `Messaging` 消息传递

一般来说，消息传递是指 `action`、`content script`、`service worker` 三者之间进行消息传递。

### 6. `Storage` 存储

`Chrome` 插件有一个专门的 `storage API`，用来进行数据存储。

### 7. 匹配模式

在开发 `Chrome` 插件时，可以使用的一种模式匹配语法，用于指定插件的内容脚本或页面操作脚本在哪些 URL 匹配模式下执行

## 五. 实用插件
### 1. `Google` 翻译
![Google 翻译](/image.png)

### 2. `Vue Dev Tools`

![Vue devtools](/image-1.png)

### 3. `React Dev Tools`

![React Dev Tools](/image-2.png)

### 4. 录制 `Gif`

![录制 Gif](/image-3.png)


## `六、Chrome` 插件安装
### 1. `Chrome` 应用商店安装

1. 浏览器输入：https://chromewebstore.google.com/
2. 搜索和安装自己需要的插件即可

### 2. 安装包安装

1. 浏览器输入：`chrome://extensions/`
2. 点击【加载已解压的拓展程序】按钮
3. 选择已解压的文件夹即可