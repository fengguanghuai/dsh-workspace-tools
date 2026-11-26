<p align="center">
  <img src="assets/icon-180.png" width="96" alt="dsh-workspace-tools icon">
</p>

# dsh-workspace-tools

[![License: MIT](https://img.shields.io/github/license/fengguanghuai/dsh-workspace-tools)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/fengguanghuai/dsh-workspace-tools)](https://github.com/fengguanghuai/dsh-workspace-tools/releases)

A DeepSeek Harness (DSH) Host plugin bundle that exposes two agent tools — `workspace_manage` and `session_title` — so agents can organize sidebar workspaces and session titles directly through chat.

让 DeepSeek Harness 的 Agent 通过自然语言直接管理左侧栏工作区与会话标题，无需手动点击侧边栏。

## Tools Included / 包含工具

### 1. `workspace_manage`

Manages sidebar workspaces via the DSH Host `workspaceRegistry` service:

| Action | Parameters | Behavior |
| --- | --- | --- |
| `list` | — | Lists all registered workspaces (`id`, `title`, `path`, `sessionCount`) in current sidebar order |
| `create` | `path`, optional `title` | Registers an existing absolute directory path as a sidebar workspace |
| `rename` | `workspaceId`, `title` | Updates the display title of a registered workspace |
| `reorder` | `workspaceId`, optional `beforeWorkspaceId` | Moves a workspace before `beforeWorkspaceId` (or to the end when omitted) |
| `delete` | `workspaceId` | Unregisters a workspace from the sidebar (keeps disk files and session logs intact) |

### 2. `session_title`

Reads, renames, or refreshes a live session's title via the DSH Host `sessionTitle` and `sessions` services:

| Mode | Parameters | Behavior |
| --- | --- | --- |
| Read | *(none)* | Returns the current title and source of the target session |
| Rename | `title` | Sets and pins a new title immediately (protected from automatic overwrites) |
| Refresh | `refresh: true` | Regenerates the title using the configured title provider |

Pass optional `sessionId` to target another live session; omit it to act on the current session.

## Installation / 安装方式

### From GitHub (CLI) / 通过命令行从 GitHub 安装

```sh
dsh plugin --profile web add github:fengguanghuai/dsh-workspace-tools
```

> Replace `web` with your actual profile name if you use a custom profile.

### In DSH Desktop / 在桌面端安装

Open **Plugins → Add plugin**, enter `github:fengguanghuai/dsh-workspace-tools` (or the local cloned directory path), click **Install**, and enable the bundle.

### From a Release tarball / 从 Release 预打包文件安装

```sh
dsh plugin --profile web add https://github.com/fengguanghuai/dsh-workspace-tools/releases/download/v0.1.0/fengguanghuai-dsh-workspace-tools-0.1.0.tgz
```

## Usage Examples / 使用示例

- 「把 `/path/to/my-project` 加到左侧工作区，改名叫“核心服务”，并放到最上面」
- 「列出我当前所有的工作区顺序」
- 「帮我把当前会话标题改成 `📂 排查订单超时问题`」
- 「根据刚才的聊天内容重新生成一下会话标题」

## Compatibility & Limitations / 兼容性与说明

- Requires DeepSeek Harness `>=0.2.0` (uses Host `tools`, `workspaceRegistry`, `sessionTitle`, and `sessions` services).
- Zero external runtime dependencies; no build step required.
- `workspace_manage` (`delete`) only unregisters the workspace from the sidebar and never deletes files or session history on disk.
- Disabling the bundle removes `workspace_manage` and `session_title` from agent sessions.

## License

[MIT](./LICENSE)
