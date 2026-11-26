export const name = 'dsh-workspace-tools';
export const inject = ['tools', 'workspaceRegistry', 'sessionTitle', 'sessions'];

function serializeWorkspace(ws) {
  return {
    id: ws.id,
    title: ws.title,
    path: ws.path,
    sessionCount: ws.sessionIds.length,
  };
}

function formatTitleSnapshot(sessionId, snapshot) {
  return {
    ok: true,
    sessionId,
    ...(snapshot?.title ? { title: snapshot.title } : {}),
    ...(snapshot?.source?.kind ? { source: snapshot.source.kind } : {}),
  };
}

export function apply(ctx) {
  ctx.effect(() =>
    ctx.tools.register({
      name: 'workspace_manage',
      description:
        'List, create, rename, reorder, or remove DeepSeek Harness sidebar workspaces directly via the Host workspace registry.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['action'],
        properties: {
          action: {
            type: 'string',
            enum: ['list', 'create', 'rename', 'delete', 'reorder'],
            description: 'Workspace operation to perform.',
          },
          path: {
            type: 'string',
            description: 'Existing absolute directory path (required for create).',
          },
          title: {
            type: 'string',
            description: 'Workspace display title (optional for create, required for rename).',
          },
          workspaceId: {
            type: 'string',
            description: 'Target workspace id (required for rename, delete, reorder).',
          },
          beforeWorkspaceId: {
            type: 'string',
            description: 'Optional anchor workspace id for reorder; omit to move to the end.',
          },
        },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['ok', 'action'],
          properties: {
            ok: { type: 'boolean' },
            action: { type: 'string' },
            workspace: {
              type: 'object',
              additionalProperties: false,
              required: ['id', 'title', 'path', 'sessionCount'],
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                path: { type: 'string' },
                sessionCount: { type: 'number' },
              },
            },
            deleted: { type: 'boolean' },
            workspaces: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                required: ['id', 'title', 'path', 'sessionCount'],
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  path: { type: 'string' },
                  sessionCount: { type: 'number' },
                },
              },
            },
          },
        },
        render(_args, value) {
          return [{ type: 'text', text: JSON.stringify(value, null, 2) }];
        },
      },
      async execute(args) {
        const reg = ctx.workspaceRegistry;
        const action = args.action;

        if (action === 'list') {
          return {
            ok: true,
            action,
            workspaces: reg.list().map(serializeWorkspace),
          };
        }

        if (action === 'create') {
          if (typeof args.path !== 'string' || !args.path.trim()) {
            throw new Error('workspace_manage: path is required for create');
          }
          const title = typeof args.title === 'string' && args.title.trim() ? args.title.trim() : undefined;
          const ws = await reg.create(args.path.trim(), title);
          if (title && ws.title !== title) {
            await ws.setTitle(title);
          }
          return {
            ok: true,
            action,
            workspace: serializeWorkspace(ws),
            workspaces: reg.list().map(serializeWorkspace),
          };
        }

        if (action === 'rename') {
          if (typeof args.workspaceId !== 'string' || !args.workspaceId.trim()) {
            throw new Error('workspace_manage: workspaceId is required for rename');
          }
          if (typeof args.title !== 'string' || !args.title.trim()) {
            throw new Error('workspace_manage: title is required for rename');
          }
          const ws = reg.get(args.workspaceId.trim());
          if (!ws) {
            throw new Error(`workspace_manage: workspace "${args.workspaceId.trim()}" not found`);
          }
          await ws.setTitle(args.title.trim());
          return {
            ok: true,
            action,
            workspace: serializeWorkspace(ws),
            workspaces: reg.list().map(serializeWorkspace),
          };
        }

        if (action === 'delete') {
          if (typeof args.workspaceId !== 'string' || !args.workspaceId.trim()) {
            throw new Error('workspace_manage: workspaceId is required for delete');
          }
          const deleted = await reg.delete(args.workspaceId.trim());
          return {
            ok: true,
            action,
            deleted,
            workspaces: reg.list().map(serializeWorkspace),
          };
        }

        if (action === 'reorder') {
          if (typeof args.workspaceId !== 'string' || !args.workspaceId.trim()) {
            throw new Error('workspace_manage: workspaceId is required for reorder');
          }
          const beforeId =
            typeof args.beforeWorkspaceId === 'string' && args.beforeWorkspaceId.trim()
              ? args.beforeWorkspaceId.trim()
              : undefined;
          await reg.insertBefore(args.workspaceId.trim(), beforeId);
          return {
            ok: true,
            action,
            workspaces: reg.list().map(serializeWorkspace),
          };
        }

        throw new Error(`workspace_manage: unsupported action "${action}"`);
      },
    }),
  );

  ctx.effect(() =>
    ctx.tools.register({
      name: 'session_title',
      description:
        'Read, rename, or refresh a DeepSeek Harness session title. Pass title to rename immediately (pins the title against automatic overwrites), pass refresh: true to regenerate via the configured title provider, or omit both to read the current title.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: {
            type: 'string',
            description:
              'New title text to set immediately. Must contain visible characters; cannot be combined with refresh.',
          },
          refresh: {
            type: 'boolean',
            description:
              'Set true to regenerate the title with the configured title provider. Cannot be combined with title.',
          },
          sessionId: {
            type: 'string',
            description: 'Optional live session id to target. Omit to act on the current session.',
          },
        },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['ok', 'sessionId'],
          properties: {
            ok: { type: 'boolean' },
            sessionId: { type: 'string' },
            title: { type: 'string' },
            source: { type: 'string' },
          },
        },
        render(_args, value) {
          const text = value.title ? `${value.title} (${value.source ?? 'unknown'})` : '(untitled)';
          return [{ type: 'text', text }];
        },
      },
      async execute(args, exec) {
        const hasTitle = args?.title !== undefined;
        const doRefresh = args?.refresh === true;
        if (hasTitle && doRefresh) {
          throw new Error('session_title: cannot pass both title and refresh: true');
        }

        let session;
        if (typeof args?.sessionId === 'string' && args.sessionId.trim().length > 0) {
          session = ctx.sessions.get(args.sessionId.trim());
          if (!session) {
            throw new Error(`session_title: session "${args.sessionId.trim()}" is not live`);
          }
        } else {
          session = exec?.agent?.session;
          if (!session) {
            throw new Error('session_title: no active agent session available');
          }
        }

        if (hasTitle) {
          const snapshot = ctx.sessionTitle.rename(session, String(args.title));
          return formatTitleSnapshot(session.id, snapshot);
        }

        if (doRefresh) {
          const snapshot = await ctx.sessionTitle.refresh(session, exec?.signal);
          return formatTitleSnapshot(session.id, snapshot);
        }

        const snapshot = ctx.sessionTitle.get(session);
        return formatTitleSnapshot(session.id, snapshot);
      },
    }),
  );
}
