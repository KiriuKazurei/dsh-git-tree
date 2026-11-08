# DSH Git Tree

[English](README.md)

**DSH Git Tree** 是 **DeepSeek Harness（DSH）Web** 的可拖动 Git 树悬浮窗（HUD），在 **DSH 0.2.1-rc.5** 上开发。它在对话界面右上角显示当前会话工作目录所在仓库的 Git 树。

## 功能

- 在对话旁查看提交历史、分支和合并泳道。
- 查看当前分支、工作区状态、与上游相比的领先或落后数，以及贮藏数。
- 悬停提交可查看哈希、作者、时间和说明。点击提交可在内置右侧栏查看逐文件 diff。
- 悬浮窗支持拖动和收起，浏览器会记住位置和收起状态。

插件通过 Git 读取本地仓库，不拉取远端历史，也不切换分支或修改文件。DSH 宿主需要能从 PATH 找到 Git，会话工作目录需要位于要展示的仓库中。

## 一句话交给 Agent 安装

把下面这句话发给能够操作 DSH 宿主和 profile 的 Agent。

> 请把 [dsh-git-tree](https://github.com/KiriuKazurei/dsh-git-tree) 安装并启用到我当前使用的 DSH profile：克隆到长期保留的本地目录，直接使用仓库自带的 `lib/` 产物，通过 DSH 的 `plugin_manager` 工具执行 `install_bundle` 并把该目录设为目标，若已有同名条目请复用，确保只注册一次。

## 手动安装

1. 克隆仓库，或下载 GitHub 源码 ZIP 并解压到长期保留的目录。仓库已包含 `lib/` 下的宿主端和 Web 端产物。
2. 在目标 profile 中使用 `plugin_manager`，将 `action` 设为 `install_bundle`，将 `target` 设为包含 `package.json` 的目录绝对路径。如果 profile 已手动注册同名条目，先复用或替换该条目。
3. 在 DSH Web 中打开工作目录位于 Git 仓库内的对话。启用后刷新 Web 页面，若宿主还未加载插件则重启 DSH。

## 开发

用 `pnpm install` 安装开发依赖，通过 `pnpm build` 重新生成 `lib/`，用 `pnpm test` 运行现有测试。悬浮窗最多显示 60 条提交，右侧栏最多显示 240 条。较大的 diff 可能被截断。

## 许可证

[MIT](LICENSE)
