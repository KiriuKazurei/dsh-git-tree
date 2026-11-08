# DSH Git Tree

[简体中文](README.zh-CN.md)

A draggable Git graph HUD for **DeepSeek Harness (DSH) Web**, developed on **DSH 0.2.1-rc.5**. It shows the repository for the active conversation's working directory in the upper-right corner.

## Features

- View commit history and branch and merge lanes alongside the conversation.
- See the current branch, dirty working tree status, upstream ahead/behind counts, and stash count.
- Hover over a commit for its hash, author, timestamp, and message. Click it to open the built-in right sidebar with per-file diffs.
- Drag or collapse the HUD. DSH Git Tree remembers its position and collapsed state in the browser.

The plugin reads the local repository through Git. It does not fetch remote history or change branches or files. The DSH host needs Git on its PATH, and the conversation's working directory must be inside the repository you want to display.

## Install with one prompt

Copy this sentence to an agent that can access your DSH host and profile.

> Install and enable [dsh-git-tree](https://github.com/KiriuKazurei/dsh-git-tree) in my active DSH profile by cloning it to a persistent local directory, using the bundled `lib/` files and the DSH `plugin_manager` tool's `install_bundle` action with that directory as the target, and reusing any existing `dsh-git-tree` entry so the plugin is registered only once.

## Manual installation

1. Clone this repository or extract GitHub's source ZIP into a directory you can keep. The prebuilt Host and Web files are included in `lib/`.
2. In the target profile, use `plugin_manager` with `action=install_bundle` and set `target` to the absolute path of the directory containing `package.json`. If the profile already has a manually registered `dsh-git-tree` entry, reuse or replace it before registering the bundle.
3. Open a DSH Web conversation whose working directory is in a Git repository. Reload the Web page after enabling the plugin, or restart DSH if the host has not loaded it.

## Development

Install the development dependencies with `pnpm install`, then use `pnpm build` to regenerate `lib/` and `pnpm test` to run the existing suite. The HUD shows up to 60 commits, and the sidebar shows up to 240. Large diffs may be truncated.

## License

[MIT](LICENSE)
