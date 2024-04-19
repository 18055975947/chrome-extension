# 前言

前面我们用了 `crxjs` 和 `Vue` 进行插件项目的开发，那本章我们用 `CRXJS` 和 `React` 来开发 `Chrome` 插件。

# 一、CRXJS
## 一、什么是 CRXJS？
`CRXJS` `Vite Plugin` 是一款使用现代 `Web` 开发技术制作 `Chrome` 扩展的工具
## 二、CRXJS 的作用
`CRXJS` 支持热加载和静态资源导入，无需手动构建配置工具
`CRXJS Vite` 插件通过将 `Vite` 的精细功能与简单的配置策略相结合，简化了 `Chrome` 扩展开发者体验
# 二、使用 React 开发 Chrome 插件
## 一、创建 React 项目
### 1. 使用 Vite 创建 React 项目
```shell
npm create vite@latest # npm
yarn create vite			 # yarn
pnpm create vite			 # pnpm
```
选择 `react` 和 `TS`

**注意**
> **<font color='red'>CRXJS 中的 HMR 与@vite/plugin-react-swc. 用@vitejs/plugin-react。</font>**

![alt text](/teach/image-54.png)


进入项目，并进行 `pnpm i` 安装 `node_modules`

```shell
  cd crxjs-vite-react-chrome
  pnpm install
```
### 2. 安装 CRXJS Vite 插件
```shell
pnpm i @crxjs/vite-plugin@beta -D # 安装 CRXJS Vite 插件
```
### 3. 创建 Manifest.json 文件
```json
{
  "manifest_version": 3,
  "name": "CRXJS React Vite Example",
  "version": "1.0.0",
  "action": {
    "default_popup": "index.html"
  }
}
```
### 4. 修改 Vite.config.ts 配置文件
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
})
```
### 5. 运行 pnpm run dev 命令

可以看到多了个 `dist` 文件夹，这个就是构建好的插件安装包
```shell
.
├── README.md
├── dist
│   ├── assets
│   │   └── loading-page-1924caaa.js
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker-loader.js
│   └── vite.svg
├── index.html
├── manifest.json
├── package.json
├── pnpm-lock.yaml
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
### 6. 安装插件
打开浏览器输入：`chrome://extensions`，点击【加载已解压的扩展程序】选择 dist 文件夹进行安装
> 插件页面

![alt text](/teach/image-55.png)

> popup action 页面

![alt text](/teach/image-56.png)

### 7. HMR 热加载
#### 7.1. Manifest.json 热加载
添加 description
```json
"description": "this is my Crxjs&React Chrome ext",
```
无需刷新插件和插件页面

![alt text](/teach/image-57.png)

#### 7.2. Popup 页面热加载
修改 popup 页面
我们选择 src/App.tsx 页面，加入这几个文案
```tsxt
test HMR
```
重新点击 popup action 

![alt text](/teach/image-58.png)

#### 7.3. Content 页面热加载
> content 页面配置在下一节

content.ts 页面代码
```typescript
console.log('this is content page')
console.log('HMR')
```
当前页面无需手动刷新

![alt text](/teach/image-59.png)

## 二、插件模块配置
### 1. Content 模块配置
#### 1.1. Src 中新建 content 文件夹，content 文件夹中新建 content.ts 文件
```shell
src/content
└── content.ts
```
简单写入以下代码
```typescript
console.log('this is content page')
```
#### 1.2. 配置 manifest.json 文件
因为有 crxjs 给我们做处理了，所以在 content_scripts 中的 js 字段，直接根据 root 配置引入就行
```json
"content_scripts": [
  {
    "js": [
      "src/content/content.ts"
    ],
    "matches": [
      "http://127.0.0.1:5500/*"
    ],
    "all_frames": true,
    "run_at": "document_end",
    "match_about_blank": true
  }
]
```
#### 1.3. 保存，刷新 http://127.0.0.1:5500/* 页面

可以看到 content.ts 中的日志输出了

![alt text](/teach/image-60.png)

### 2. Background Service-worker 模块配置
#### 2.1. src 中新建 background 文件夹，background 文件夹中新建 service-worker.ts 文件
```shell
src/background
└── service-worker.ts
```
简单写入以下代码
```typescript
console.log('this is background service worker file')
```
#### 2.2. 配置 manifest.json 文件
因为有 crxjs 给我们做处理了，所以在 background 中的 service_worker 字段，直接根据 root 配置引入就行
```json
"background": {
  "service_worker": "src/background/service-worker.ts"
},
```
#### 2.3. 保存，点击插件 Service Worker 模块
可以看到 service_worker.ts 中的日志输出了

![alt text](/teach/image-61.png)

#### 2.4. 可以看到有两行 client-worker 输出
这个不用管，如果这个报错也不用管，这个是 crxjs 的配置，以及热加载

![alt text](/teach/image-62.png)

### 3. Content 页面模块配置
#### 3.1. 在 src/content 下面创建 content.tsx 文件
```shell
src/content
├── content.ts
└── content.tsx
```
#### 3.2. 配置 manifest.json 文件
```js
"content_scripts": [
  {
    "js": [
      "src/content/content.ts"
    ],
    "matches": [
      "http://127.0.0.1:5500/*"
    ],
    "all_frames": true,
    "run_at": "document_end",
    "match_about_blank": true
  },
  {
    "js": [
      "src/content/content.tsx"
    ],
    "matches": [
      "http://127.0.0.1:5500/*"
    ],
    "all_frames": true,
    "run_at": "document_end",
    "match_about_blank": true
  }
]
```
#### 3.3. content 页面展示

![alt text](/teach/image-63.png)

#### 3.4. 合并 content_script
因为 `content.ts` 和 `content.tsx` 的匹配模式一样，所用可以合并到一个 `js` 数组中
```js
"content_scripts": [
  {
    "js": [
      "src/content/content.ts",
      "src/content/content.tsx"
    ],
    "matches": [
      "http://127.0.0.1:5500/*"
    ],
    "all_frames": true,
    "run_at": "document_end",
    "match_about_blank": true
  }
]
```

## 三、插件项目开发
### 1. Chrome TS 配置
#### 1.1. 安装 chrome-types 模块
```shell
pnpm i chrome-types -D
```
#### 1.2. Src/vite-env.d.ts 中增加配置
```typescript
/// <reference types="chrome-types/index" />
```
#### 1.3. App.tsx 中使用 chrome

![alt text](/teach/image-64.png)

#### 1.4. Service-worker.ts 中使用

![alt text](/teach/image-65.png)

#### 1.5. Content.ts 中使用

![alt text](/teach/image-66.png)

### 2. 静态资源引入
#### 2.1. Assets 文件夹下添加一张图片
```shell
src/assets
├── react.svg
└── vite_crxjs_react.jpg
```
#### 2.2. App.tsx 中引入
```ts
import crxjsPho from './assets/vite_crxjs_react.jpg'
```
```html
<img src={crxjsPho} width='300px' height='125px' />
```
#### 2.3. 重新点击 popup action 

![alt text](/teach/image-67.png)

### 3. Ant Design 使用
#### 3.1. 安装 Ant Design
```shell
pnpm i antd 
```
#### 3.2. App.tsx 中引入并使用
```ts
import { useState } from 'react'
import { Button } from 'antd'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import crxjsPho from './assets/vite_crxjs_react.jpg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        test HMR
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
        <Button type="dashed">Dashed Button</Button>
        <Button type="text">Text Button</Button>
        <Button type="link">Link Button</Button>
        <img src={crxjsPho} width='300px' height='125px' />
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
```
#### 3.3. 重新点击 popup action 

![alt text](/teach/image-68.png)

### 4. Zustand 使用
#### 4.1. 安装 zustand 
```shell
pnpm i zustand
```
#### 4.2. Src 文件下新建 store 文件夹，内件 store.ts

```shell
src/store
└── store.ts
```
#### 4.3. store.ts 中写入以下内容
```ts
import { create } from 'zustand';

interface ICountStoreState {
  count: number
  increment: (countNum: number) => void
  decrement: (countNum: number) => void
}

const useStore = create<ICountStoreState>((set) => ({
  count: 0,
  increment: (countNum: number) => set((state) => ({ count: state.count + countNum })),
  decrement: (countNum: number) => set((state) => ({ count: state.count - countNum })),
}));

export default useStore;
```

#### 4.4 App.tsx 使用 store

加入以下代码

```ts
import useStore from './store/store'
function App() {
  const { numVal, increment, decrement } = useStore();

  return (
    <>
      <div>
        <div>
          <span>numVal is {numVal}</span>
          <Button onClick={() => increment(1)}>
            increment 1
          </Button>
          <Button onClick={() => decrement(1)}>
            decrement 1
          </Button>
        </div>
        ...
    </>
  )
}

export default App
```
#### 4.5. 点击 popup，弹出页面

![alt text](/teach/image-69.png)

### 5. 使用 Less 预处理
#### 5.1. 安装 Less
```shell
pnpm i less -D
```

#### 5.2 在 src 中创建 styles 文件夹并创建 index.less
```shell
src/styles
└── index.less
```
`Vite` 会自动生成 `index.css` 文件
`index.less` 文件内容
```css
.test-parent{
  background: red;
  padding: 10px;
  .test{
    background: green;
    padding: 10px;
  }
}
```
#### 5.3. App.tsx 中使用
文件中加入以下代码
```ts
import './styles/index.less'

function App() {
  return (
    <>
      <div>
        <div className="test-parent">
          <div className="test">
            test less
          </div>
        </div>
        ...
      </div>
    </>
  )
}

export default App
```
#### 5.4. 点击 popup，弹出页面

![alt text](/teach/image-70.png)

## 四、问题反馈
### 1. Popup 页面点击不显示正常页面
#### 1.1. 如果点击 popup 页面如下图所示，不展示正常的页面

![alt text](/teach/image-71.png)

#### 1.2. 解决方法
1. 点击插件【错误】按钮

![alt text](/teach/image-72.png)

2. 点击【全部清除】按钮

![alt text](/teach/image-73.png)

3. 点击刷新按钮

![alt text](/teach/image-74.png)

4. 点击 `popup` 页面

![alt text](/teach/image-75.png)

##  四、总结
- 使用 CRXJS 结合 Vite 插件结合 React 开发 Chrome 浏览器插件到这就基本结束了
- 使用 CRXJS 不需要自己在手动配置 vite.config.ts 文件了，方便了不少
