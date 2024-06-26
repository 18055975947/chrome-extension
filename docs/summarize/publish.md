# 插件打包发布

到这一步的时候，我们基本上可以把所有的需求都实现了，这个时候就需要进行打包部署

## 一、打包成 `zip` 包

最简单方便的一种其实就是打包成 `zip` 包，通过下载链接进行下载，在包里面通过设置版本号和数据库的版本号对比来提醒用户进行新包的下载。

![zip 包](/image-71.png)

## 二、发布到 `Chrome` 应用商店

### 1. 注册成为开发者

在发布到 `chrome` 应用商店之前，需要先有一个谷歌账号，并且需要支付 5 美元才能注册为 `chrome` 应用商店开发者

![reg](/image-72.png)

【[注册链接](https://chrome.google.com/webstore/devconsole/register)】：https://chrome.google.com/webstore/devconsole/register

### 2. 插件类别

开发者控制台会要求为插件指定一个类别，一个程序只能有一个类别

- 无障碍
  - 这些插件旨在为有视觉障碍者、听力受损、动作失常和其他残障人士改善浏览体验。这可能包括屏幕阅读器等工具、深色模式插件，或有助于导航、使用键盘快捷键和语音指令等的实用程序。
- 艺术与设计
  - 此类插件提供了用于查看、编辑、整理及分享图片和照片的工具。它们可能还提供屏幕截图、搜索图片以及集成热门图片托管或编辑服务的功能。
- 通信
  - 可实现通信的插件。此类别涵盖的内容非常多：撰写和设置电子邮件模板、电子邮件管理、屏幕共享、视频会议应用和增强功能等等。
- 开发者工具
  - 各种插件可帮助 Web 开发者执行调试、性能分析、代码 lint 检查等任务，以及可改进浏览器的开发者工具的工具。例如，实时 HTML/CSS/JavaScript 编辑、API 测试和 CSS 检查。
- 教育
  - 教学或辅助教学插件，包括语言学习、笔记、教学辅助和手语教学等。
- 娱乐
  - 这些插件专为体育、音乐、电视和电影爱好者而设计。
- 功能和界面
  - 用于完善 Chrome 界面的插件，例如标签页管理器、快捷方式管理器和应用启动器。
- 游戏
  - 提供各种桌面游戏和街机游戏的插件。
- 家庭
  - 各种插件，协助在家办公。此类别包括食谱实用者和经理、预算制定、产品研究等。
- 休闲娱乐
  - 这些插件专为娱乐而设计。其中包含游戏、有趣的新标签页背景、古怪的微件、笑话、知识问答等。
- 新闻和天气
  - 借助这些插件，用户可以及时了解时事和天气状况。他们可以从多个来源收集新闻、提供实时天气动态、通知重大新闻等等。
- 隐私权和安全性
  - VPN、密码安全和钓鱼式攻击防范等插件。
- Shopping
  - 这些附加信息旨在提升在线购物体验。这些平台可能会提供比价、优惠券查找器、评价和评分、心愿单管理等功能。
- 社交媒体与人际交流
  - 这些插件旨在增强社交媒体平台。他们可以与服务集成，并提供轻松分享、通知、状态更新等功能。
- 工具
  - 不属于其他类别的工具
- 旅游
  - 用于规划行程的插件。
- 平安健康
  - 有关自助、正念和个人发展的插件。
- 工作流程和规划
  - 可帮助用户更高效地执行任务的插件。他们的工具五花八门，从跟踪时间段、保持专注的工具、待办事项列表管理员、电子邮件整理工具、文档编辑器和日历实用程序等等，不一而足。

### 3. 准备插件

#### 1. 在生产环境中测试插件

确保所有功能都能按预期运行

#### 2. 查看 `manifest.json` 文件

上传插件后，将无法在开发者信息中心内修改清单的元数据。如果发现拼写错误，就必须修改清单，增加版本号，然后重新压缩文件

请务必检查并包含以下字段：

- "name"
  - 此名称会显示在 Chrome 应用商店和 Chrome 浏览器中。
- "version"
  - 此插件版本的版本号。
- "icons"
  - 一个数组，用于指定插件的图标。
- "description"
  - 用于描述插件的字符串，不超过 132 个字符。

#### 3. 压缩插件文件

需要提交包含所有插件文件的 ZIP 文件。请务必将该 `manifest.json` 文件放在**根目录**

#### 4. 创建出色的插件详情页面

利用引人入胜且准确的插件详情页面，给用户留下深刻的第一印象，从而赢得用户信任。优质的插件详情页面会使用插件说明、图片和其他插件详情元数据，清楚地传达插件将提供的内容

- 设计美观
- 该插件的用途明确，可以满足用户真正的需求
- 设置和新手入门流程直观
- 项目易于使用

### 4. 在 `chrome` 应用商店发布

#### 1. 上传插件内容

> 在 Chrome 网上应用店中发布的插件不能超过 20 个

1. 前往 [Chrome 开发者信息中心](https://chrome.google.com/webstore/devconsole)
2. 登录开发者帐号
3. 点击添加新插件按钮
4. 依次点击选择文件 > 你的 ZIP 文件 > 上传。如果内容的清单和 ZIP 文件均有效，可以在下一页中修改该内容。

插件上传后，就会作为一项内容显示在信息中心内。

![chrome](/image-73.png)

#### 2. 填写插件相关信息

- `Package`（打包）标签页会显示所上传项目的详细信息。首次创建项时，此页面无法修改。
- 插件详情标签包含插件详情及其在 `Chrome` 应用商店中的显示方式的详细信息。
- 可以在隐私标签页中声明插件的单一用途以及插件会如何处理用户数据。
- 可以通过分发标签页声明你的插件是否为付费插件，以及哪些国家/地区将列出的插件以及会看到该插件的用户群。

#### 3. 提交插件

当点击提交审核按钮后，系统会显示以下对话框，确认是否要提交插件以供审核

![submit](/image-74.png)

#### 4. 延迟发布

通过上面显示的确认对话框，还可以控制内容的发布时间。如果取消选中该复选框，你的项目不会在审核完成后立即发布。不过，审核完成后，可以在选择的时间手动发布模板。

如果在审核后提交内容以自动发布，仍可以选择延迟发布，只需选择该内容菜单中的延迟发布选项即可

![defer](/image-75.png)

这样一来，如果在提交提交的内容后发现错误，或者只想更改发布时间，可以暂停发布

> 审核完成后，可以在 30 天内发布广告

## 三、管理插件

### 1. 插件审核

提交插件以供审核后，审核团队会审核该插件是否符合开发者计划政策。如果发现任何违规行为，审核团队会采取适当的违规处置措施。

#### 1.1. 审核时间

`Chrome` 应用商店的审核时间可能会有所不同。2021 年初，大多数提交内容在 24 小时内完成审核，其中 90% 以上在三天内完成

审核流程结合使用手动系统和自动化系统。所有提交内容都要通过相同的审核系统，无论开发者的资历如何，也无论活跃用户有多少。 

有些信号可能会导致审核人员更加仔细地检查插件，其中包括：
- 新开发者
- 新附加信息
- 危险的权限请求
- 重大代码更改

> 所有插件提交，无论是为新插件还是对现有插件的更新，都需要完成相同的审核流程。

#### 1.2. 导致审核时间增加的重要因素

- 广泛的主机权限
  - \*\:\/\/\*\/\*、https:\/\/\*\/\* 和 `<all_urls>` 等主机权限模式
- 敏感的执行权限
- 代码数量和格式

#### 1.3. 审核结果

- 未发现任何违规行为
  - 提交内容已获批准，并且可以发布到 `Chrome` 应用商店。
- 发现违规问题
  - 提交内容会遭拒，并告知开发者原因。

### 2. 更新插件

#### 2.1. 更新方式

- 升级插件，在 Chrome 应用商店中发布该插件的新版本，并将其推送到用户群。
- 针对之前以部分发布的方式发布的内容更新发布比例 (%)。 （适用于过去 7 天活跃用户数量超过 1 万的插件）

#### 2.2. 升级插件

- 上传一个新的 ZIP 文件

在开发者信息中心条目的“Package”（软件包）标签页上，使用“Upload New Package”（上传新的软件包）按钮上传 ZIP 文件：

![upload](/image-76.png)

#### 2.3. 设置部分发布百分比

![upload](/image-77.png)

#### 2.4. 提交更新

提交更新以供审核后，这并不会影响已发布的内容。现有用户将不会看到任何变化，并且新用户可以继续安装之前发布的当前版本。只有相应内容之后发布时，这些用户才会受到影响

如需提交更新以供审核，请执行以下操作：
1. 确保已填写上述所有标签页中的详细信息。
2. 点击提交审核按钮。
3. 系统会显示以下对话框，确认是否要提交插件以供审核。

![upload](/image-78.png)





