# 使用 `Vue3`、`TypeScript`、`Vite`、`Naive-ui`、`Less`、`Pinia` 开发 `Chrome V3` 插件

本章是使用 `Vue`、`Vite` 等来开发 `Chrome` 插件。

从创建项目开始，一步一步的开发，包含项目所用到的状态管理、打包、`UI` 组件库、Less 等。

## 一、使用 `Vite` 创建 `Vue` 项目

```shell
npm create vite@latest # npm
yarn create vite			 # yarn
pnpm create vite			 # pnpm
```

选择 `Vue` 和 `TS`

![create vue project](/image-49.png)

进入项目，并进行 `pnpm i` 安装 `node_modules`

```shell
pnpm i # 安装 node_modules 包
```

此时项目文件夹目录为：

```shell
.
├── README.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── public
│   └── vite.svg
├── src
│   ├── App.vue
│   ├── assets
│   │   └── vue.svg
│   ├── components
│   │   └── HelloWorld.vue
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 二、修改 `Vue` 项目

因为我们是开发 `Chrome` 插件，需要 `manifest.json`、`service-worker`、`content`、`popup` 页面等文件，所以需要对之前的项目进行删除，并添加我们自己的配置

### 1. 项目修改

1.  删除项目根目录下的 `index.html` 文件
2.  删除 `src` 目录下的 `components` 文件夹、`App.vue`、`main.ts`、`style.css`
3.  删除根目录下的 `public` 文件夹
4.  在根目录下创建 `manifest.json` 文件，此乃插件入口文件
5.  创建 `popup` 页面：在 `src` 目录下创建 `popup` 文件夹，`popup` 文件夹中创建 `App.vue`、`main.ts、style.css、index.html、components` 文件夹，`components` 文件夹下创建 `TestPopup.vue` 文件（这些新建的文件内容可以参考刚刚删除的文件，但要注意修改 `index.html` 文件中 `main.ts` 的引入路径）在 `TestPopup.vue` 文件中写入 `Test popup` 文案
6.  创建 `content` 页面：在 `src` 目录下创建 `contentPage` 文件夹，`contentPage` 文件夹中创建 `App.vue、main.ts、style.css、index.html、components` 文件夹，`components` 文件夹下创建 `TestContent.vue` 文件（这些新建的文件内容可以参考刚刚删除的文件，但要注意修改 `index.html` 文件中 `main.ts` 的引入路径）在 `TestContent.vue` 文件中写入 `Test content` 文案
7.  创建 `background`：在 `src` 目录下创建 `background` 文件夹，`background` 文件夹中创建 `service-worker.ts`，文件里面写入 **`console.log('this is service worker file')`**
8.  创建 `content`：在 `src` 目录下创建 `content` 文件夹，`content` 文件夹下创建 `content.ts`，文件写入 **`console.log('this is content file')`**
9.  `src` 目录下新建 `icons` 文件夹，用于放置插件 `icon`，可以网上找个 `icon.png`

### 2. 步骤解析

- 前三步就是删除
- 第四步是创建插件的入口文件，此文件必须有，在根目录和 `src` 目录都行，但一般习惯放在根目录中
- 第五步是创建 `popup` 弹框页面，如果你的插件不需要可以忽略这一步
- 第六步是创建 `content` 页面，和第八步的 `content` 的区别是这个最终打包为 `index.html` 文件，通过 `iframe` 的形式插入对应域名的页面中
- 第七步是创建 `service-worker` 页面，`V3` 虽然也叫 `background`，但是这个文件一般都写成 `service-worker`
- 第八步就是创建注入对应域名的 `content.ts` 文件
- 第九步是放置插件的 16、32、48、128 的 `png` 图片，可以用一张 128 的也行

### 3. 文件夹目录

```shell
.
├── README.md
├── manifest.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── assets
│   │   └── vue.svg
│   ├── background
│   │   └── service-worker.ts
│   ├── content
│   │   └── content.ts
│   ├── contentPage
│   │   ├── App.vue
│   │   ├── components
│   │   │   └── TestContent.vue
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── style.css
│   ├── icons
│   │   └── icon.png
│   ├── popup
│   │   ├── App.vue
│   │   ├── components
│   │   │   └── TestPopup.vue
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── style.css
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 三、配置项目

### 1. 配置 manifest.json 文件

#### 1.1. 写入以下内容

```json
{
  "manifest_version": 3,
  "name": "My Vue Chrome Ext",
  "version": "0.0.1",
  "description": "Chrome 插件",
  "icons": {
    "16": "icons/icon.png",
    "19": "icons/icon.png",
    "38": "icons/icon.png",
    "48": "icons/icon.png",
    "128": "icons/icon.png"
},
  "action": {
    "default_title": "Vue Chrome Ext",
    "default_icon": "icons/icon.png",
    "default_popup": "popup/index.html"
  },
  "background": {
    "service_worker": "background/service-worker.js"
  },
  "permissions": [],
  "host_permissions": [],
  "content_scripts": [
    {
      "js": [
        "content/content.js"
      ],
      "matches": [
        "http://127.0.0.1:5500/*"
      ],
      "all_frames": true,
      "run_at": "document_end",
      "match_about_blank": true
    }
  ]
}
```

#### 1.2. 解析

1.  `manifest_version` 字段一定得是 3
2.  因为只有一张图，所以 `icons` 和 `action/default_icon` 就用同一张图片
3.  可以看到 `action/default_popup` 配置的值为 `popup/index.html`，是因为我想把项目 `build` 成这种路径
4.  `background/service_worker` 也是同理，要 `build` 成 `background/service-worker.js` 这种路径
5.  通了 `content_scripts` 配置也是一样，`build` 成 `content/content.js`
6.  `match` 配置了一个本地的路径，方便调试（使用 `vscode` 的 `Live Server` 插件或者 `node` 包启动一个服务）

### 2. 配置 `Chrome` 插件的 `Types`

因为我们使用的是 `TypeScripts` 来进行开发 `Chrome` 插件，所以需要配置一个 `Chrome` 插件 `API` 等 `Types`

#### 2.1. 安装 `chrome-types` 包

```shell
pnpm i chrome-types -D
```

#### 2.2. 配置 `Types`

在 `vite-env.d.ts` 文件中写入

```typescript
/// <reference types="chrome-types/index" />
```

这样的话，就可以在 `popup、content、background` 中使用 `chrome`，并且有类型等提示

> `service-worker.ts`

![service-worker](/image-50.png)

> `content.ts`

![content](/image-51.png)

> `popup/main.ts`

![popup](/image-52.png)

### 3. 配置 `vite.config.ts`

配置构建文件，需要按照我们写入的 `manifest.json` 文件进行配置

#### 3.1. 复制文件，使用 `rollup-plugin-copy` 复制 `icons` 以及 `manifest.json` 文件

通过复制可以直接把需要的文件复制到对应的目录中，这些复制的文件不需要构建，不需要压缩

##### 3.1.1. 安装 `rollup-plugin-copy`

```shell
pnpm i rollup-plugin-copy -D
```

##### 3.1.2. 配置 `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy' // 引入 rollup-plugin-copy

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/',
  plugins: [
    vue(),
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' }, // 复制 manifest.json 到 dist 目录
        { src: "src/icons/**", dest: 'dist/icons' } // 复制 src/icons/** 到 dist/icons 目录
      ]
    })
  ],
})
```

#### 3.2. 配置 `build` 选项

`build` 构建，需要按照我们的 `manifest.json` 引入的配置

##### 3.2.1. 需要引入 `@types/node`

```shell
pnpm i @types/node -D
```

##### 3.2.2. 配置 `build`

```typescript
build: {
  outDir: path.resolve(__dirname, 'dist'),
  rollupOptions: {
    input: {
      popup: path.resolve(__dirname, 'src/popup/index.html'),
      contentPage: path.resolve(__dirname, 'src/contentPage/index.html'),
      content: path.resolve(__dirname, 'src/content/content.ts'),
      background: path.resolve(__dirname, 'src/background/service-worker.ts'),
    },
    output: {
      assetFileNames: 'assets/[name]-[hash].[ext]', // 静态资源
      chunkFileNames: 'js/[name]-[hash].js', // 代码分割中产生的 chunk
      entryFileNames: (chunkInfo) => { // 入口文件
        const baseName = path.basename(chunkInfo.facadeModuleId, path.extname(chunkInfo.facadeModuleId))
        const saveArr = ['content', 'service-worker']
        return `[name]/${saveArr.includes(baseName) ? baseName : chunkInfo.name}.js`;
      },
      name: '[name].js'
    }
  },
},
```

###### 3.2.2.1. 解析

- `input` 模块配四个文件，两个是页面，两个是 `ts` 文件
- `output/entryFileNames` 配置，是判断如果传入的是 `content.ts` 和 `service-worker.ts`，也用这两个当生成的文件名称

##### 3.2.3. 配置 `root`

因为我们引入的页面是从 `src` 下面的引入的，所以需要配置下 `root` 字段

```typescript
root: 'src/',
```

#### 3.3. 完整的 `vite.config.ts` 文件

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import copy from 'rollup-plugin-copy'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src/',
  plugins: [
    vue(),
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' },
        { src: "src/icons/**", dest: 'dist/icons' }
      ]
    })
  ],
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup/index.html'),
        contentPage: path.resolve(__dirname, 'src/contentPage/index.html'),
        content: path.resolve(__dirname, 'src/content/content.ts'),
        background: path.resolve(__dirname, 'src/background/service-worker.ts'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]', // 静态资源
        chunkFileNames: 'js/[name]-[hash].js', // 代码分割中产生的 chunk
        entryFileNames: (chunkInfo) => { // 入口文件
          const baseName = path.basename(chunkInfo.facadeModuleId, path.extname(chunkInfo.facadeModuleId))
          const saveArr = ['content', 'service-worker']
          return `[name]/${saveArr.includes(baseName) ? baseName : chunkInfo.name}.js`;
        },
        name: '[name].js'
      }
    },
  },
})
```

## 四、构建项目

### 1. 运行 `build` 命令

运行 `pnpm run build`，生成 `dist` 文件夹

```shell
pnpm run build
```

### 2. `dist` 文件夹目录

```shell
dist
├── assets
│   └── popup-_NbSUZFU.css
├── background
│   └── service-worker.js
├── content
│   └── content.js
├── contentPage
│   ├── contentPage.js
│   └── index.html
├── icons
│   └── icon.png
├── js
│   └── _plugin-vue_export-helper-81FIV2UM.js
├── manifest.json
└── popup
    ├── index.html
    └── popup.js
```

### 3. 加载已解压的扩展程序

`chrome://extensions/` 页面点击【加载已解压的扩展程序】选择 `dist` 目录

![加载已解压的扩展程序](/image-53.png)

选择完之后，可以看到我们的插件已经出现在扩展程序列表中了

![add ext](/image-54.png)

### 4. 打开本地页面

#### 4.1. 控制台输出 `content` 内容

可以看到控制台输出了我们的 `content.ts` 文件的内容

![content](/image-55.png)

#### 4.2. `Popup action`

把插件固定，点击插件 `action` 按钮，弹出 `popup` 页面

![popup action](/image-56.png)

### 5. 打开插件控制台

可以看到 `service-worker.ts` 中的内容

![service worker](/image-57.png)

### 6. `Content page` 如何注入页面？

我们的 `vite.config.ts` 中的 `build` 选项中还构建了一个 `contentPage` 页面呢，这个页面要怎么注入呢？

对于普通的注入 `js` 的文件，我们直接写在 `content.ts` 中，打包构建之后就可以注入了，这个 `contentPage` 存在的意义是向页面注入页面，一般是嵌在 `iframe` 中

#### 6.1. `Contnet.ts` 中注入 `iframe`

在 `contnet.ts` 中写入以下代码

```typescript
console.log("this is content js")
const init = () => {
  const addIframe = (id: string, pagePath: string) => {
    const contentIframe = document.createElement("iframe");
    contentIframe.id = id;
    contentIframe.style.cssText = "width: 100%; height: 100%; position: fixed; inset: 0px; margin: 0px auto; z-index: 10000002; border: none;";
    const getContentPage = chrome.runtime.getURL(pagePath);
    contentIframe.src = getContentPage;
    document.body.appendChild(contentIframe);
  }

  addIframe('content-start-iframe', 'contentPage/index.html')
}

init()
```

解析：

- 通过 `content.ts` 代码，生成 `iframe` 元素，`src` 为我们的 `contentPage/index.html`，这个路径获取需要通过 `chrome.runtime.getURL` 获取
- 为什么还要包裹一层 `init` 函数？
    - 因为我们的 `manifest.json` 中 `content_script` 的 `all_frames` 为 `true`，这个代表着我们的 `content.ts` 会注入所有的 `frames` 中，加一个这个是在判断 `top` 与 `self` 相等的时候在注入

```typescript
// 判断 window.top 和 self 是否相等，如果不相等，则不注入 iframe
if (window.top === window.self) {
  init();
}
```

#### 6.2. 重新构建项目

重新 `build` 项目，然后刷新插件，再刷新下我们的本地项目

可以发现：“此页面已被屏蔽”

![block](/image-58.png)

但是我们打开控制台，可以发现我们的 `iframe` 已经注入到页面了，屏蔽的页面正是我们的 `iframe`

![iframe block](/image-59.png)

这样可不行啊，被屏蔽了怎么能行...

#### 6.3. 配置 `manifest.json` 中的 `web_accessible_resources` 字段

`web_accessible_resources`：网络可访问的资源

```json
"web_accessible_resources": [
  {
    "resources": ["popup/*", "contentPage/*", "assets/*", "js/*"],
    "matches": ["http://127.0.0.1:5500/*"],
    "use_dynamic_url": true
  }
]
```

我们需要把我们插件的资源允许访问才行

- 匹配的 `matches` 还是我们本地的域名
- `resources` 是我们打包构建之后的 `dist` 里面的目录
- 需要哪些写哪些，`"popup/*"` 可以删除不写

#### 6.4 再次重新构建项目

重新 `build` 项目，刷新插件，刷新本地项目

可以看到我们的 `iframe` 已经加载了

![load iframe](/image-60.png)

**但是这个时候 `iframe` 把我们的项目挡住了，那其实我们可以先把 `iframe` 设置为 `width: 0px`，然后在某些需要展示 `iframe` 的时候在设置宽度即可**

## 五、项目开发

### 1. 图片资源

图片资源使用比较简单，比如我们的 `assets` 文件夹放入一个图片

```shell
src/assets
├── Vue_Vite_Chrome_ext.jpg
└── vue.svg
```

#### 1.1. `Popup` 页面使用图片

1.  直接引入，`TestPopup.vue` 内容

```vue
<template>
  <div>
    <span>Test popup</span>
    <img src="../../assets/vue.svg">
    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
```

2.  重新 `build` 项目，刷新插件，刷新页面，点击 `popup action`，弹出 `popup` 页面

![popup](/image-61.png)

#### 1.2. `Content` 页面使用图片

1.  直接引入，`TestContent.vue` 内容

```vue
<template>
  <div>
    <span>Test content</span>
    <img src="../../assets/vue.svg">
    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
```

2.  重新 `build` 项目，刷新插件，刷新页面

![content](/image-62.png)

### 2. 使用 `UI` 库

> 以 `naive-ui` 为例

#### 2.1. 安装 `naive-ui` 包

```shell
pnpm i naive-ui 
```

#### 2.2. `Popup` 页面使用

1.  直接引入，`TestPopup.vue` 内容

```vue
<template>
  <div>
    <span>Test popup</span>
    <img src="../../assets/vue.svg">
    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
    <n-button type="tertiary">
      Tertiary
    </n-button>
    <n-button type="primary">
      Primary
    </n-button>
    <n-button type="info">
      Info
    </n-button>
    <n-button type="success">
      Success
    </n-button>
    <n-button type="warning">
      Warning
    </n-button>
    <n-button type="error">
      Error
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>

<style scoped></style>
```

2.  重新 `build` 项目，刷新插件，刷新页面，点击 `popup action`，弹出 `popup` 页面

![popup](/image-63.png)

#### 2.3. `Content` 页面使用

1.  直接引入，TestContent.vue 内容

```vue
<template>
  <div>
    <span>Test content</span>
    

    <img src="../../assets/vue.svg">
    

    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
    

    <n-button type="tertiary">
      Tertiary
    </n-button>
    <n-button type="primary">
      Primary
    </n-button>
    <n-button type="info">
      Info
    </n-button>
    <n-button type="success">
      Success
    </n-button>
    <n-button type="warning">
      Warning
    </n-button>
    <n-button type="error">
      Error
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>

<style scoped></style>
```

2.  重新 `build` 项目，刷新插件，刷新页面

![content](/image-64.png)

### 3. 状态管理 `Pinia`

#### 3.1. 安装 `Pinia`

```shell
pnpm i pinia
```

#### 3.2. `Popup` 页面使用

1.  `Main.ts` 中引入

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

2.  在 `src/popup` 中新建 `store` 文件夹，新建 `counter.ts` 文件

`popup` 文件夹目录

```shell
src/popup
├── App.vue
├── components
│   └── TestPopup.vue
├── index.html
├── main.ts
├── store
│   └── counter.ts
└── style.css
```

2.  `counter.ts` 文件写入以下内容

```typescript
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
  },
})
```

3.  在 `TestPopup.vue` 页面引入和使用

```vue
<template>
  <div>
    <span>Test popup</span>
    <img src="../../assets/vue.svg">
    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
    <span>{{ store.count }}</span>
    <n-button type="tertiary" @click="store.increment">
      Tertiary
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useCounterStore } from '../store/counter'
const store = useCounterStore();
</script>

<style scoped></style>
```

4.  重新 `build`，刷新插件，刷新页面，点击 `popup action` 弹出页面

![popup action](/image-65.png)

5.  点击按钮

![click but](/image-66.png)

#### 3.3. `Content` 页面使用

1.  `Main.ts` 中引入

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

2.  在 `src/contentPage` 中新建 `store` 文件夹，新建 `counter.ts` 文件

文件夹目录

```shell
src/contentPage
├── App.vue
├── components
│   └── TestContent.vue
├── index.html
├── main.ts
├── store
│   └── counter.ts
└── style.css
```

2.  `counter.ts` 和 `popup` 中的 `counter.ts` 一样即可，`store` 的唯一 `ID` 可以和 `popup` 的重复，因为这是两个页面
3.  `TestContent.vue` 页面引入和使用

```vue
<template>
  <div>
    <span>Test Content</span>
    <img src="../../assets/vue.svg">
    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
    <span>{{ store.count }}</span>
    <n-button type="tertiary" @click="store.increment">
      Tertiary
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useCounterStore } from '../store/counter'
const store = useCounterStore();
</script>

<style scoped></style>
```

4.  重新 `build`，刷新插件，刷新页面

![content but](/image-67.png)

5.  点击按钮

![click but](/image-68.png)

### 4. 使用 `CSS` 预处理器

> Vite 同时提供了对 .scss, .sass, .less, .styl 和 .stylus 文件的内置支持

因为 `vite` 内置支持，所以只需要安装依赖就行

#### 4.1. 安装 `less`

```shell
pnpm i less -D
```

#### 4.2. `Popup` 页面使用

1.  `style` 直接使用即可

```vue
<template>
  <div>
    <span>Test popup</span>
    <img src="../../assets/vue.svg">
    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
    <span>{{ store.count }}</span>
    <n-button type="tertiary" @click="store.increment">
      Tertiary
    </n-button>
    <br>
    <ul class="ul">
      <li class="li">
        <span class="span">测试 less</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useCounterStore } from '../store/counter'
const store = useCounterStore();
</script>

<style scoped lang="less">
.ul{
  .li{
    .span{
      color: red;
    }
  }
}
</style>
```

2.  `Popup` 页面展示

![popup](/image-69.png)

#### 4.3. `Content` 页面使用

1.  `style` 直接使用

```vue
<template>
  <div>
    <span>Test Content</span>
    <img src="../../assets/vue.svg">
    <img src="../../assets/Vue_Vite_Chrome_ext.jpg" width="500px" height="300px">
    <span>{{ store.count }}</span>
    <n-button type="tertiary" @click="store.increment">
      Tertiary
    </n-button>
    <ul class="ul">
      <li class="li">
        <span class="span">测试 less</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useCounterStore } from '../store/counter'
const store = useCounterStore();
</script>

<style scoped lang="less">
.ul{
  .li{
    .span{
      color: red;
    }
  }
}
</style>
```

2.  页面展示

![content](/image-70.png)

## 六、热加载

### 1. 只有 `Popup` 页面和 `Content` 页面需要热加载

如果我们的 `manifest.json` 文件基本上固定的，不需要更新，只需要 `popup` 页面和 `content` 页面在保存的时候进行 `build` 以及刷新的话，有一种很简单的方式

#### 1.1. 我们本地启动的项目和我们插件的项目在同一个文件夹

这样的话，当我们点击保存的时候，会自动触发刷新页面

#### 1.2. 配置新的 `build script` 命令，监听文件更新，重新 `build`

1. `"watch-build": "vite --watch build"`
2.  终端启动
3.  更新 `popup` 文件夹和 `content` 文件夹下的内容即可

```shell
pnpm run watch-build
```

1.  <font color='red'>我的本地项目启动之后域名为：http://127.0.0.1:5500/testhtml/test.html </font>
2.  目录为：`/User/demo/chrome/testhtml/test.html`
3.  插件根目录为：`/Users/demo/chrome/test-chrome/vue-chrome-ext`
4.  我在 `chrome` 这一层启动 `live-server` 服务，这个可以自动实现热加载
5.  配置 `build` 监听命令是为了保存的时候可以重新 `build`，再配合刷新的话，这样就不用手动刷新插件和页面了
6.  新更改的 `popup` 页面和 `content` 页面也能及时的显示出来

### 2. 插件模块热加载（`background` 的 `service-worker.ts`、`content.ts` 文件）

插件热加载的话是需要刷新插件的，而且同时也需要监听文件夹的变化

如果是在 `V2` 版本中，可以在 `background.ts` 中使用 `getPackageDirectoryEntry` 方法，获取文件夹内容以及监听变化

但是 `getPackageDirectoryEntry` 方法在 `V3` 中被限制了，只能在 `popup` 页面中使用，但是 `popup` 页面只有点击的时候才会弹出来...所以，我们换个方法监听文件

#### 2.1. `service-worker.ts` 文件写入以下内容

```typescript
console.log('this is service worker file')
chrome.management.getSelf(self => {
  if (self.installType === 'development') {
    // 监听的文件列表
    const fileList = [
      'http://127.0.0.1:5501/dist/manifest.json',
      'http://127.0.0.1:5501/dist/popup/popup.js',
      'http://127.0.0.1:5501/dist/background/service-worker.js',
      'http://127.0.0.1:5501/dist/content/content.js',
      'http://127.0.0.1:5501/dist/contentPage/contentPage.js'
    ]
    // 文件列表内容字段
    const fileObj: {
      [prop: string]: string
    } = {}
    /**
     * reload 重新加载
     */
    const reload = () => {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        (tabs: chrome.tabs.Tab[]) => {
          if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
          }
          // 强制刷新页面
          chrome.runtime.reload();
        }
      );
    };

    /**
     * 遍历监听的文件，通过请求获取文件内容，判断是否需要刷新
     */
    const checkReloadPage = () => {
      fileList.forEach((item) => {
        fetch(item).then((res) => res.text())
        .then(files => {
          if (fileObj[item] && fileObj[item] !== files) {
            reload()
          } else {
            fileObj[item] = files
          }
        })
        .catch(error => {
          console.error('Error checking folder changes:', error);
        });
      })
    }
    
    // setInterval(() => {
    //   checkReloadPage()
    // }, 1000)
    
    /**
     * 设置闹钟(定时器)
     */
    // 闹钟名称
    const ALARM_NAME = 'LISTENER_FILE_TEXT_CHANGE';
    /**
     * 创建闹钟
     */
    const createAlarm = async () => {
      const alarm = await chrome.alarms.get(ALARM_NAME);
      if (typeof alarm === 'undefined') {
        chrome.alarms.create(ALARM_NAME, {
          periodInMinutes: 0.1
        });
        checkReloadPage();
      }
    }
    createAlarm();
    // 监听闹钟
    chrome.alarms.onAlarm.addListener(checkReloadPage);
  }
})
```

1. 第一行日志输出
2. 第 2～3 两行是判断当开发环境为 `development` 时，才会走以下流程
3. **<font color=red>第 5～11 行是重新在当前插件的根目录启动一个 live-server 服务，写入需要监听的文件列表，然后可以通过 fetch 请求的方式获取文件内容（一定要起个服务才行，而且监听文件的 URL 要能正确访问才行，如果 fileList 字段和你的不匹配需要修改才行）</font>**
4. 第 13～15 行是定义一个对象，`key` 就是文件列表的路径
5. 第 19～33 行是刷新插件和刷新当前 `tab` 页面
6. 第 38～52 行是遍历文件列表，通过 `fetch` 请求获取文件内容，进行判断是否和 `fileObj` 中保存的数据是否一致，如果不一致则进行 `reload`
7. 第 54～56 行是定义一个 `setInterval`，间隔多少时间进行遍历文件内容去判断
8. 第 62～77 行是用 `Chrome` 的 `alarms` 来当定时器（建议）

#### 2.2. 配置 `Manifest.json` 文件

因为使用了一些 `Chrome` 的 `API`，所以需要添加权限才行

```json
"permissions": [
  "activeTab",
  "tabs",
  "alarms"
],
```

#### 2.3. 配置 `build script` 命令，监听文件更新，重新 `build`

1.  `"watch-build": "vite --watch build"`
2.  终端启动

```shell
pnpm run watch-build
```

- 新 `build` 的包，第一次还是需要点击刷新按钮才行
- 之后再更新 `service-worker.ts/content.ts` 或者 `popup` 以及 `content` 的页面的时候就会自动刷新了
- 可以看到 `alarms` 创建的闹钟最小时间是 6s，如果觉得太长的话可以使用上面的 `setInterval`

### 3. `Manifest.json` 文件热加载

可以发现我们修改 `manifest.json` 文件还是不会触发热加载，这就需要重新配置，我们使用 `nodemon` 监听

#### 3.1. 全局安装 `nodemon`

```shell
npm i nodemon -g
```

#### 3.2. 项目根目录新建 `watch.mjs` 文件，写入以下内容

```javascript
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VITE_BIN_PATH = path.resolve(__dirname, 'node_modules/.bin/vite');

const watcher = spawn('nodemon', ['--watch', 'manifest.json', '--exec', VITE_BIN_PATH, 'build'], {
  stdio: 'inherit',
});
watcher.on('exit', (code) => {
  process.exit(code);
});
```

1.  使用 `nodemon` 监听 `manifest.json` 文件，触发监听

#### 3.3. 配置新的 `script`

```shell
"watch-json": "node watch.mjs"
```

再启动一个终端进行 `json` 的监听

```shell
pnpm run watch-json
```

此时更改 `manifest.json` 文件，在 `alarms` 触发之后就会刷新插件了

## 七、项目最终目录结构

```shell
.
├── README.md
├── manifest.json
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── assets
│   │   ├── Vue_Vite_Chrome_ext.jpg
│   │   └── vue.svg
│   ├── background
│   │   └── service-worker.ts
│   ├── content
│   │   └── content.ts
│   ├── contentPage
│   │   ├── App.vue
│   │   ├── components
│   │   │   └── TestContent.vue
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── store
│   │   │   └── counter.ts
│   │   └── style.css
│   ├── icons
│   │   └── icon.png
│   ├── popup
│   │   ├── App.vue
│   │   ├── components
│   │   │   └── TestPopup.vue
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── store
│   │   │   └── counter.ts
│   │   └── style.css
│   └── vite-env.d.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── watch.mjs
```

## 八、总结

1.  使用 `Vue3`、`TS`、`UI` 库、`Less`、`Pinia`、`Vite` 开发浏览器插件到这整个流程就已经走完了，插件涉及的页面也都包括在内了
2.  开发上线的时候只需要把 `http://127.0.0.1:5500/` 换成插件需要的域名即可
3.  `Vite` 配置和 `Vue` 项目都是我们手动修改的，可以很好的适配自己的项目

## 九、源码地址
- [【码云地址：https://gitee.com/guoqiankun/my-vue3-plugin/tree/vue3_vite_chrome/】](https://gitee.com/guoqiankun/my-vue3-plugin/tree/vue3_vite_chrome/)

