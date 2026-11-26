# dsh-workspace-tools

A DeepSeek Harness (DSH) plugin bundle that lets agents organize your **sidebar workspaces** and **session titles** directly through chat — no more manual clicking in the sidebar.

让 DeepSeek Harness 的 Agent 通过自然语言直接管理左侧栏的**工作区**与**会话标题**。

## Tools Included / 包含工具

### 1. `workspace_manage`

Directly manages DSH sidebar workspaces via the Host `workspaceRegistry` service:

| Action | Description |
| --- | --- |
| `list` | List all registered workspaces in current sidebar order |
| `create` | Register an existing directory as a workspace (with optional display title) |
| `rename` | Rename a workspace by `workspaceId` |
| `reorder` | Move a workspace before `beforeWorkspaceId` (or to the end when omitted) |
| `delete` | Unregister a workspace from the sidebar (keeps disk files & session logs intact) |

### 2. `session_title`

Reads, renames, or regenerates a live session's title via the Host `sessionTitle` service:

- **Read**: call with no `title` / `refresh` to inspect the current title and source
- **Rename**: pass `title` to set and pin a title immediately (protected from automatic overwrites)
- **Refresh**: pass `refresh: true` to regenerate the title with the configured title provider
- **Target another session**: optionally pass `sessionId` for any live session

## Installation / 安装方式

### Install from local path / 本地安装

Ask your DSH agent:

> Install the DSH bundle from `/path/to/dsh-workspace-tools`

Or call `plugin_manager` with:

```json
{
  "action": "install_bundle",
  "target": "/path/to/dsh-workspace-tools"
}
```

### Install from GitHub / 从 GitHub 安装

```bash
git clone https://github.com/fengguanghuai/dsh-workspace-tools.git
```

Then install the cloned directory with `plugin_manager` (`action: "install_bundle"`).

## Usage Examples / 使用示例

- 「把 `/path/to/my-project` 加到左侧工作区，改名叫“核心服务”，并放到最上面」
- 「列出我当前所有的工作区顺序」
- 「帮我把当前会话标题改成 `📂 排查订单超时问题`」
- 「根据刚才的聊天内容重新生成一下会话标题」

## License

[MIT](./LICENSE)
