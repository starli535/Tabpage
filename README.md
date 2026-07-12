# 🚀 新标签页 · V1.6 Gecko Pro

> 一个功能丰富、可高度定制的浏览器新标签页，集成时钟、搜索、书签、待办、天气、番茄钟、便签、工具箱等众多实用功能，所有数据本地保存，无需联网即可使用。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-1e3799.svg)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
[![GitHub stars](https://img.shields.io/github/stars/your-username/tab-page?style=social)](https://github.com/your-username/tab-page/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/tab-page?style=social)](https://github.com/your-username/tab-page/network/members)

---

## ✨ 功能特性

| 模块 | 功能描述 |
|------|----------|
| 🕐 **时钟** | 12/24小时制切换，显示秒数，日期展示 |
| 🔍 **搜索** | 多引擎支持（Google、百度、Bing、GitHub、B站），搜索建议 |
| 🌤️ **天气** | 自动定位（浏览器定位 → IP定位 → 默认城市），手动切换城市 |
| 🔖 **书签** | 增删改，右键菜单操作，快捷访问 |
| 📋 **待办** | 优先级（高/中/低），筛选（全部/未完成/已完成），统计 |
| 🍅 **番茄钟** | 计时/暂停/重置，完成次数统计，桌面通知 |
| 📝 **便签** | 工具箱便签 + 首页可拖动便签，独立存储 |
| 📅 **日历** | 首页日历，月份切换，今日高亮 |
| 🧰 **工具箱** | 计算器、单位换算（7种单位）、倒计时 |
| 🖼️ **壁纸** | 预设图片（6张）、渐变（8种）、纯色、上传自定义 |
| ⚙️ **个性化** | 遮罩透明度/颜色、模糊、亮度、各组件显示开关 |
| 💾 **数据管理** | 导出/导入 JSON 备份，一键重置 |
| ⌨️ **快捷键** | `Ctrl+K` 搜索、`Ctrl+T` 待办、`Ctrl+P` 番茄钟、`Ctrl+,` 设置 |

---

## 📁 项目结构

```bash
tab-page/
├── index.html              # 主页面骨架
├── style.css               # 全局样式（约 500 行）
├── README.md               # 项目说明
├── LICENSE                 # MIT 许可证
└── js/
    ├── app.js              # 🚀 主入口（初始化、事件绑定、快捷键）
    ├── config.js           # ⚙️ 配置数据（预设图片、渐变、名言）
    ├── store.js            # 💾 状态管理 + localStorage 持久化
    ├── utils.js            # 🛠️ 工具函数（转义、格式化等）
    ├── wallpaper.js        # 🖼️ 壁纸引擎（切换、遮罩、模糊、亮度）
    ├── clock.js            # 🕐 时钟 + 日期
    ├── weather.js          # 🌤️ 天气获取（定位 + 刷新 + 城市切换）
    ├── particles.js        # ✨ 粒子背景动画
    ├── search.js           # 🔍 搜索栏 + 搜索建议
    ├── bookmarks.js        # 🔖 书签管理（增删改 + 右键菜单）
    ├── todos.js            # 📋 待办管理（增删改 + 筛选）
    ├── notes.js            # 📝 便签（工具箱 + 首页可拖动）
    ├── pomodoro.js         # 🍅 番茄钟（计时、暂停、重置）
    ├── calendar.js         # 📅 首页日历（月份切换 + 今日高亮）
    ├── tools.js            # 🧰 工具箱（计算器、换算、倒计时）
    ├── keyboard.js         # ⌨️ 软键盘（布局切换、输入控制）
    ├── settings.js         # ⚙️ 设置面板 UI 同步
    └── ui-helpers.js       # 🎨 UI 辅助（面板开关、右键菜单）
