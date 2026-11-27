<p align="center">
  <img src="assets/icon-180.png" width="96" alt="dsh-workspace-tools icon">
</p>

# dsh-workspace-tools

[![npm](https://img.shields.io/npm/v/@fengguanghuai/dsh-workspace-tools)](https://www.npmjs.com/package/@fengguanghuai/dsh-workspace-tools)
[![License: MIT](https://img.shields.io/github/license/fengguanghuai/dsh-workspace-tools)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/fengguanghuai/dsh-workspace-tools)](https://github.com/fengguanghuai/dsh-workspace-tools/releases)

A DeepSeek Harness (DSH) Host + Web UI plugin bundle that combines a **toggleable left-sidebar organization & global pinning suite** with two agent tools (`workspace_manage` and `session_title`).

集成了**可独立开关的左侧栏置顶与工作区整理增强套件**，以及让 Agent 通过自然语言管理工作区与会话标题的 `workspace_manage`、`session_title` 两个工具。

## Sidebar & Pin Enhancements / 左侧栏增强（均可独立开关）

Click the sliders icon on the **Pinned** (or **Workspaces**) header to open the settings modal and toggle any feature independently:

1. **Global Pinned Section / 顶部跨工作区置顶汇总区** — Aggregates native DSH pinned sessions (`pinnedSessionIds`) above **Workspaces** with source workspace pills, hover unpin, and optional deduplication (hides pinned sessions in the workspace list below by default).
2. **Pinned Workspaces & Inline Expand / 工作区置顶与就地展开** — Right-click any workspace to pin it to the top section and expand its sessions inline.
3. **Workspaces Header Quick Actions / 工作区标题栏快捷按钮** — Adds **Locate current session**, **Collapse all**, and **Expand all** buttons directly to the Workspaces header.
4. **Status Highlights / 运行中、未读与待处理状态高亮** — Syncs live Host status indicators: blue pulsing (running), amber (waiting for approval/answer), and green (completed unread).
5. **Inline Search in Pinned Section / 置顶区就地搜索** — Filter pinned sessions and workspaces by title or workspace name (`Esc` to close).
6. **macOS-style 7-Color Labels / macOS 风格 7 色标签** — Right-click any session to assign one of 7 soft row tints (synced across both the Pinned section and native workspace list).
7. **Workspace Recency Sort & Auto-Fold History / 工作区按最近活跃排序 + 超期历史自动折叠** — Floats recently active workspaces to the top via non-invasive CSS flex order, and folds idle sessions older than N days (`1 / 3 / 7 / 14 / 30d`, keeping pinned/active/running/unread visible).
8. **Drag-to-Reorder Pinned Sessions / 置顶行拖拽排序** — Drag pinned session rows in the top section to customize their order.

> Non-invasive by design: reuses DSH's native `sidebar.workspaces` browser, native pinning, and native right-click context menu API instead of replacing the built-in sidebar.

## Agent Tools Included / 包含 Agent 工具

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

```sh
# From npm
dsh plugin --profile web add @fengguanghuai/dsh-workspace-tools

# Or from GitHub
dsh plugin --profile web add github:fengguanghuai/dsh-workspace-tools
```

Or in DSH Desktop: **Plugins → Add plugin** → enter `@fengguanghuai/dsh-workspace-tools` (or `github:fengguanghuai/dsh-workspace-tools`) → **Install** and enable.

## Compatibility & Limitations / 兼容性与说明

- Requires DeepSeek Harness `>=0.2.0` (`0.2.2-rc.5` verified).
- Zero external runtime dependencies; no build step required.
- Preferences, pinned workspaces, custom pin order, and color labels are persisted locally in `localStorage` (`dsh-workspace-tools:prefs:v1`).
- Disabling the bundle cleanly removes all sidebar UI enhancements, context menu entries, and agent tools.

## License

[MIT](./LICENSE)
