---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

outline: 4
hero:
  name: "Chrome 浏览器插件开发实践指南"
  text: ""
  tagline: 从零到一，打造您的独特插件体验
  image:
    src: /ext.svg
    alt: Chrome 浏览器插件
  actions:
    - theme: brand
      text: 什么是 Chrome 插件?
      link: /basic/index
    - theme: alt
      text: Manifest 字段解析
      link: /basic/manifest
    - theme: alt
      text: API 概览
      link: /api/index
    - theme: alt
      text: Service Worker
      link: /core/service-worker
    - theme: alt
      text: 消息通信
      link: /core/message
    - theme: brand
      text: 打赏作者
      link: /team/tea

features:
  - title: 什么是浏览器插件？
    icon:
      src: /ext.svg
    details: Chrome 插件可通过自定义界面、观察浏览器事件和修改网络来提升浏览体验。
  - title: Chrome 插件是如何构建的？
    icon:
      src: /develop.svg
    details: 使用与创建 Web 应用相同的 Web 技术来构建扩展程序：HTML、CSS 和 JavaScript。
  - title: Chrome 插件可以做些什么？
    icon:
      src: /ext-2.svg
    details: 设计界面、控制浏览器、管理插件、覆盖网页和设置、控制网络、注入 JS 和 CSS、录音和屏幕截图
  - title: 原生 JS 开发
    icon:
      src: /js.svg
    details: 基于纯 JavaScript 的 Chrome 插件开发项目，旨在展示使用原生 JavaScript 开发 Chrome 扩展的技术和最佳实践。
    link: /teach/js-chrome
    linkText: 查看详情
  - title: Vue 开发插件
    icon:
      src: /vue.svg
    details: 是一个使用 Vue.js 框架开发的 Chrome 插件，旨在为开发者展示如何使用 Vue.js 构建强大的浏览器扩展。
    link: /teach/vue-chrome
    linkText: 查看详情
  - title: React 开发插件
    icon:
      src: /react.svg
    details: 是一个使用 React.js 框架开发的 Chrome 插件，旨在为开发者展示如何使用 React.js 构建强大的浏览器扩展。
    link: /teach/react-chrome
    linkText: 查看详情
  - title: CRXJS
    icon:
      src: /crxjs.svg
    details: 是一款使用 Web 开发技术制作 Chrome 扩展的工具，可以开箱即用 HMR 和静态资产导入。
    link: https://crxjs.dev/vite-plugin/
    linkText: 查看详情
  - title: 实用插件推荐
    icon:
      src: /tj.svg
    details: 推荐一些对前端开发来说实用的 Chrome 插件。
    link: /summarize/extension
    linkText: 查看详情
---

<style module>
article>img{
  height: 48px;
}
</style>

<!--@include: ./team/tea.md-->

