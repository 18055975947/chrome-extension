import { defineConfig } from 'vitepress'
import { getSideBarList, getNavList, getSocialLinks } from './utils'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/extension/',
  lang: 'zh',
  title: "Chrome 浏览器插件",
  description: "本文是一份针对想要学习Chrome浏览器插件开发的开发者的详尽指南。从Chrome插件的基本概念和架构开始，到实际的插件开发流程和常见问题的解决方案，本文将提供全面的教程和实践经验，帮助读者快速掌握Chrome插件开发的技能，并构建出功能丰富、高效实用的插件。",
  head: [
    ['link', { rel: 'icon', href: '/extension/extension.ico'}]
  ],
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    }
  },
  assetsDir: 'static',
  themeConfig: {
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3]
    },
    logo: '/ext.svg',
    nav: getNavList(),
    sidebar: {
      '/teach/': getSideBarList('/teach/'),
      '/summarize/': getSideBarList('/teach/'),
      '/basic/': getSideBarList('/basic/'),
      '/core/': getSideBarList('/core/'),
      '/api/': getSideBarList('/api/')
    },
    socialLinks: getSocialLinks()
  }
})
