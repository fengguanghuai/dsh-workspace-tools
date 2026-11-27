window.__ModuleLoader__.load({
  id: '@fengguanghuai/dsh-workspace-tools',
  factory(require) {
    const React = require('react');
    const ReactDOM = (() => {
      try {
        return require('react-dom');
      } catch {
        return null;
      }
    })();

    const h = React.createElement;
    const { useState, useEffect, useMemo, useCallback, useRef } = React;

    const NS = 'dsh-workspace-tools';
    const STORAGE_KEY = 'dsh-workspace-tools:prefs:v1';
    const STYLE_ID = 'dwt-sidebar-styles';

    const COLOR_LABELS = [
      { id: 'red', hex: '#ff5f57', zh: '红色', en: 'Red' },
      { id: 'orange', hex: '#ff9f0a', zh: '橙色', en: 'Orange' },
      { id: 'yellow', hex: '#ffd60a', zh: '黄色', en: 'Yellow' },
      { id: 'green', hex: '#30d158', zh: '绿色', en: 'Green' },
      { id: 'blue', hex: '#0a84ff', zh: '蓝色', en: 'Blue' },
      { id: 'purple', hex: '#bf5af2', zh: '紫色', en: 'Purple' },
      { id: 'gray', hex: '#8e8e93', zh: '灰色', en: 'Gray' },
    ];
    const COLOR_MAP = Object.fromEntries(COLOR_LABELS.map((c) => [c.id, c]));

    const DEFAULT_PREFS = {
      enablePinnedSection: true,
      hidePinnedInWorkspace: true,
      enablePinnedWorkspaces: true,
      enableHeaderActions: true,
      enableStatusHighlight: true,
      enablePinnedSearch: true,
      enableColorLabels: true,
      enableRecencySort: true,
      enableAutoFold: true,
      foldDays: 3,
      enableDragReorder: true,
      pinnedCollapsed: false,
      pinnedWorkspaceIds: [],
      expandedPinnedWsIds: [],
      pinnedSessionOrder: [],
      colorLabels: {},
    };

    const LOCALE_ZH = {
      'pinned.title': '置顶',
      'pinned.empty': '暂无置顶会话或工作区',
      'pinned.searchPlaceholder': '过滤置顶会话或工作区…',
      'pinned.searchToggle': '搜索置顶项',
      'pinned.unpinSession': '取消置顶会话',
      'pinned.unpinWorkspace': '取消置顶工作区',
      'pinned.newSession': '在此工作区新建会话',
      'pinned.noMatches': '没有匹配的置顶项',
      'pinned.ungrouped': '未分组',
      'pinned.untitled': '未命名会话',
      'header.locate': '定位当前会话',
      'header.collapseAll': '全部收起工作区',
      'header.expandAll': '全部展开工作区',
      'header.settings': '侧栏增强设置',
      'menu.colorLabel': '颜色标签',
      'menu.clearColor': '清除标签',
      'menu.pinWorkspace': '置顶工作区到顶部',
      'menu.unpinWorkspace': '取消置顶工作区',
      'fold.expand': '展开 {n} 条超过 {days} 天的历史',
      'fold.collapse': '收起更早历史',
      'status.running': '运行中',
      'status.pending': '待处理',
      'status.unread': '已完成未读',
      'settings.title': '侧栏与置顶增强',
      'settings.subtitle': '独立开关各项侧栏增强功能，即改即生效',
      'settings.group.pin': '顶部置顶区',
      'settings.group.workspace': '工作区整理',
      'settings.enablePinnedSection': '顶部跨工作区置顶汇总区',
      'settings.enablePinnedSection.desc': '读取原生置顶会话并汇总到「工作区」上方',
      'settings.hidePinnedInWorkspace': '工作区中隐藏已置顶会话',
      'settings.hidePinnedInWorkspace.desc': '开启顶部置顶区时，避免已置顶会话在下方工作区重复显示',
      'settings.enablePinnedWorkspaces': '工作区置顶与就地展开',
      'settings.enablePinnedWorkspaces.desc': '右键工作区可置顶到顶部，点开直接浏览会话',
      'settings.enablePinnedSearch': '置顶区就地搜索',
      'settings.enablePinnedSearch.desc': '在置顶栏内快速过滤置顶会话与工作区',
      'settings.enableDragReorder': '置顶行拖拽排序',
      'settings.enableDragReorder.desc': '拖拽调整顶部置顶会话的显示顺序',
      'settings.enableHeaderActions': '工作区标题栏快捷按钮',
      'settings.enableHeaderActions.desc': '提供定位当前会话、一键全收、一键全展',
      'settings.enableStatusHighlight': '运行中 / 未读 / 待处理高亮',
      'settings.enableStatusHighlight.desc': '在置顶行与原生列表同步展示蓝/绿/橙状态',
      'settings.enableColorLabels': 'macOS 风格 7 色标签',
      'settings.enableColorLabels.desc': '右键会话设置 7 色柔和行底色',
      'settings.enableRecencySort': '工作区按最近活跃自动排序',
      'settings.enableRecencySort.desc': '刚聊过的工作区自动排到最前面',
      'settings.enableAutoFold': '自动折叠超期历史会话',
      'settings.enableAutoFold.desc': '折叠超过指定天数的旧会话（置顶/运行/未读不折叠）',
      'settings.foldDays': '折叠阈值（天）',
      'settings.reset': '恢复默认设置',
      'settings.close': '关闭',
    };

    const LOCALE_EN = {
      'pinned.title': 'Pinned',
      'pinned.empty': 'No pinned sessions or workspaces yet',
      'pinned.searchPlaceholder': 'Filter pinned items…',
      'pinned.searchToggle': 'Filter pinned items',
      'pinned.unpinSession': 'Unpin session',
      'pinned.unpinWorkspace': 'Unpin workspace',
      'pinned.newSession': 'New session in workspace',
      'pinned.noMatches': 'No matching pinned items',
      'pinned.ungrouped': 'Ungrouped',
      'pinned.untitled': 'Untitled session',
      'header.locate': 'Locate current session',
      'header.collapseAll': 'Collapse all workspaces',
      'header.expandAll': 'Expand all workspaces',
      'header.settings': 'Sidebar enhancements',
      'menu.colorLabel': 'Color label',
      'menu.clearColor': 'Clear label',
      'menu.pinWorkspace': 'Pin workspace to top',
      'menu.unpinWorkspace': 'Unpin workspace',
      'fold.expand': 'Show {n} older ({days}d+)',
      'fold.collapse': 'Hide older history',
      'status.running': 'Running',
      'status.pending': 'Needs attention',
      'status.unread': 'Completed (unread)',
      'settings.title': 'Sidebar & pin enhancements',
      'settings.subtitle': 'Toggle each sidebar enhancement independently',
      'settings.group.pin': 'Top pinned section',
      'settings.group.workspace': 'Workspace organization',
      'settings.enablePinnedSection': 'Global pinned section',
      'settings.enablePinnedSection.desc': 'Aggregate native pinned sessions above Workspaces',
      'settings.hidePinnedInWorkspace': 'Hide pinned sessions in workspaces',
      'settings.hidePinnedInWorkspace.desc': 'Avoid duplicate display in workspace lists when the top pinned section is enabled',
      'settings.enablePinnedWorkspaces': 'Pinned workspaces & inline expand',
      'settings.enablePinnedWorkspaces.desc': 'Right-click any workspace to pin and expand inline',
      'settings.enablePinnedSearch': 'Inline search in pinned section',
      'settings.enablePinnedSearch.desc': 'Quickly filter pinned sessions and workspaces',
      'settings.enableDragReorder': 'Drag-to-reorder pinned sessions',
      'settings.enableDragReorder.desc': 'Drag rows in the pinned section to customize order',
      'settings.enableHeaderActions': 'Workspaces header quick actions',
      'settings.enableHeaderActions.desc': 'Locate current session, collapse all, expand all',
      'settings.enableStatusHighlight': 'Running / unread / pending highlights',
      'settings.enableStatusHighlight.desc': 'Show blue/green/amber status accents on rows',
      'settings.enableColorLabels': 'macOS-style 7-color labels',
      'settings.enableColorLabels.desc': 'Right-click sessions to apply soft 7-color row tints',
      'settings.enableRecencySort': 'Sort workspaces by recent activity',
      'settings.enableRecencySort.desc': 'Float recently active workspaces to the top',
      'settings.enableAutoFold': 'Auto-fold older history sessions',
      'settings.enableAutoFold.desc': 'Fold sessions older than N days (keeps pinned/active/unread)',
      'settings.foldDays': 'Fold threshold (days)',
      'settings.reset': 'Reset defaults',
      'settings.close': 'Close',
    };

    function loadPrefs() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...DEFAULT_PREFS };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_PREFS };
        return {
          ...DEFAULT_PREFS,
          ...parsed,
          pinnedWorkspaceIds: Array.isArray(parsed.pinnedWorkspaceIds) ? parsed.pinnedWorkspaceIds : [],
          expandedPinnedWsIds: Array.isArray(parsed.expandedPinnedWsIds) ? parsed.expandedPinnedWsIds : [],
          pinnedSessionOrder: Array.isArray(parsed.pinnedSessionOrder) ? parsed.pinnedSessionOrder : [],
          colorLabels: parsed.colorLabels && typeof parsed.colorLabels === 'object' ? parsed.colorLabels : {},
          foldDays: typeof parsed.foldDays === 'number' && parsed.foldDays >= 1 ? parsed.foldDays : 3,
        };
      } catch {
        return { ...DEFAULT_PREFS };
      }
    }

    function createPrefsStore() {
      let state = loadPrefs();
      const listeners = new Set();
      const emit = () => {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {}
        for (const fn of listeners) {
          try { fn(); } catch {}
        }
      };
      return {
        getSnapshot: () => state,
        subscribe: (fn) => {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
        update: (updater) => {
          const next = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
          if (next === state) return;
          state = next;
          emit();
        },
        reset: () => {
          state = {
            ...DEFAULT_PREFS,
            pinnedWorkspaceIds: state.pinnedWorkspaceIds,
            expandedPinnedWsIds: state.expandedPinnedWsIds,
            pinnedSessionOrder: state.pinnedSessionOrder,
            colorLabels: state.colorLabels,
          };
          emit();
        },
      };
    }

    function useStoreSnapshot(store) {
      const [snap, setSnap] = useState(() => store.getSnapshot());
      useEffect(() => {
        setSnap(store.getSnapshot());
        return store.subscribe(() => setSnap(store.getSnapshot()));
      }, [store]);
      return snap;
    }

    function getLocaleLang(ctx) {
      try {
        const snap = ctx.locale?.getSnapshot?.();
        const raw = typeof snap === 'string'
          ? snap
          : (snap?.active || ctx.locale?.language || document.documentElement.lang || navigator.language || 'zh');
        return String(raw).toLowerCase().startsWith('zh') ? 'zh' : 'en';
      } catch {
        return 'zh';
      }
    }

    function formatText(dict, key, vars) {
      let text = dict[key] ?? LOCALE_EN[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replaceAll(`{${k}}`, String(v));
        }
      }
      return text;
    }

    // --- Minimal crisp SVG icons (no external icon library needed) ---
    function SvgIcon({ size = 14, viewBox = '0 0 16 16', children, style, className }) {
      return h('svg', {
        width: size,
        height: size,
        viewBox,
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.5,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className,
        style: { display: 'block', flexShrink: 0, ...style },
        'aria-hidden': true,
      }, children);
    }

    const IconPin = ({ size = 13, filled = false }) => h(SvgIcon, { size }, [
      h('path', {
        key: 'p1',
        d: 'M9.8 2.2l4 4-1.6 1.6-1-.3-2.5 2.5.4 1.8-1.1 1.1-2.3-2.3-2.9 2.9-.7-.7 2.9-2.9-2.3-2.3 1.1-1.1 1.8.4 2.5-2.5-.3-1 1.6-1.6z',
        fill: filled ? 'currentColor' : 'none',
      }),
    ]);

    const IconChevron = ({ size = 12, open = false }) => h(SvgIcon, {
      size,
      style: { transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 140ms ease' },
    }, [h('path', { key: 'c', d: 'M6 4l4 4-4 4' })]);

    const IconSearch = ({ size = 13 }) => h(SvgIcon, { size }, [
      h('circle', { key: 'c', cx: 7, cy: 7, r: 4.5 }),
      h('path', { key: 'l', d: 'M10.5 10.5L14 14' }),
    ]);

    const IconClose = ({ size = 12 }) => h(SvgIcon, { size }, [
      h('path', { key: 'x', d: 'M4 4l8 8M12 4l-8 8' }),
    ]);

    const IconFolder = ({ size = 13, open = false }) => h(SvgIcon, { size }, open
      ? [
          h('path', { key: 'f1', d: 'M2 5.5A1.5 1.5 0 013.5 4h2.8l1.2 1.5H12.5A1.5 1.5 0 0114 7v1H2V5.5z' }),
          h('path', { key: 'f2', d: 'M2 8h12l-1 4.5A1.5 1.5 0 0111.5 13.5h-7A1.5 1.5 0 013 12.5L2 8z' }),
        ]
      : [
          h('path', { key: 'f', d: 'M2 4.5A1.5 1.5 0 013.5 3h2.8l1.3 1.5h4.9A1.5 1.5 0 0114 6v6a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 12V4.5z' }),
        ]);

    const IconPlus = ({ size = 12 }) => h(SvgIcon, { size }, [
      h('path', { key: 'p', d: 'M8 3v10M3 8h10' }),
    ]);

    const IconLocate = ({ size = 13 }) => h(SvgIcon, { size }, [
      h('circle', { key: 'c1', cx: 8, cy: 8, r: 4.5 }),
      h('circle', { key: 'c2', cx: 8, cy: 8, r: 1.2, fill: 'currentColor' }),
      h('path', { key: 'l', d: 'M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2' }),
    ]);

    const IconCollapseAll = ({ size = 13 }) => h(SvgIcon, { size }, [
      h('path', { key: 'p1', d: 'M4.5 3.5L8 6.5l3.5-3' }),
      h('path', { key: 'p2', d: 'M4.5 12.5L8 9.5l3.5 3' }),
    ]);

    const IconExpandAll = ({ size = 13 }) => h(SvgIcon, { size }, [
      h('path', { key: 'p1', d: 'M4.5 6L8 3l3.5 3' }),
      h('path', { key: 'p2', d: 'M4.5 10L8 13l3.5-3' }),
    ]);

    const IconSliders = ({ size = 13 }) => h(SvgIcon, { size }, [
      h('path', { key: 'l1', d: 'M2.5 4.5h11M2.5 8h11M2.5 11.5h11' }),
      h('circle', { key: 'c1', cx: 5.5, cy: 4.5, r: 1.4, fill: 'currentColor' }),
      h('circle', { key: 'c2', cx: 10.5, cy: 8, r: 1.4, fill: 'currentColor' }),
      h('circle', { key: 'c3', cx: 6.5, cy: 11.5, r: 1.4, fill: 'currentColor' }),
    ]);

    const IconTag = ({ size = 14 }) => h(SvgIcon, { size }, [
      h('path', { key: 't', d: 'M2.5 8.2V3.5a1 1 0 011-1h4.7l5.3 5.3a1 1 0 010 1.4l-4.3 4.3a1 1 0 01-1.4 0L2.5 8.2z' }),
      h('circle', { key: 'd', cx: 5.5, cy: 5.5, r: 0.8, fill: 'currentColor' }),
    ]);

    const IconColorDot = ({ hex, size = 12 }) => h('span', {
      style: {
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '999px',
        background: hex,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.16)',
        flexShrink: 0,
      },
    });

    // --- Stylesheet injected into document.head (cleaned up on unload) ---
    const CSS_TEXT = `
      [data-dwt-pinned-host] {
        flex: none;
        padding: 2px 0 8px;
        margin-bottom: 4px;
        border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.16));
      }
      [data-dwt-pinned-host]:empty {
        display: none;
      }
      .dwt-pin-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        height: 28px;
        padding: 0 2px 0 calc(var(--dsh-sidebar-row-padding, 12px) - 4px);
        color: var(--dsw-alias-label-tertiary, #8e8e93);
        font-size: 12px;
        font-weight: 500;
        user-select: none;
      }
      .dwt-pin-header-left {
        display: flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        cursor: pointer;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
        padding: 2px 4px;
        border-radius: 6px;
      }
      .dwt-pin-header-left:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
        color: var(--dsw-alias-label-primary, inherit);
      }
      .dwt-pin-count {
        font-size: 11px;
        opacity: 0.72;
        font-variant-numeric: tabular-nums;
      }
      .dwt-pin-header-actions {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .dwt-icon-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: var(--dsw-alias-label-secondary, #8e8e93);
        cursor: pointer;
        padding: 0;
        transition: background 120ms ease, color 120ms ease;
      }
      .dwt-icon-btn:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.14));
        color: var(--dsw-alias-label-primary, inherit);
      }
      .dwt-icon-btn.dwt-active {
        background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.18));
        color: var(--dsw-alias-label-primary, inherit);
      }
      .dwt-search-wrap {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 4px 2px 6px;
        padding: 0 8px;
        height: 28px;
        border-radius: 8px;
        background: var(--dsw-alias-bg-layer-2, rgba(128, 128, 128, 0.1));
        border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.18));
      }
      .dwt-search-wrap:focus-within {
        border-color: var(--dsw-alias-brand-primary, #3b82f6);
      }
      .dwt-search-input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        color: var(--dsw-alias-label-primary, inherit);
        font-size: 12px;
        font-family: inherit;
      }
      .dwt-pin-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-top: 2px;
      }
      .dwt-pin-empty {
        padding: 6px 8px;
        font-size: 11.5px;
        color: var(--dsw-alias-label-tertiary, #8e8e93);
        opacity: 0.85;
      }
      .dwt-row {
        position: relative;
        display: flex;
        align-items: center;
        gap: 6px;
        min-height: 30px;
        padding: 0 6px 0 8px;
        border-radius: 8px;
        cursor: pointer;
        user-select: none;
        color: var(--dsw-alias-label-primary, inherit);
        font-size: 13px;
        transition: background 100ms ease;
      }
      .dwt-row:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.12));
      }
      .dwt-row.dwt-selected {
        background: var(--dsw-alias-interactive-bg-selected, rgba(128, 128, 128, 0.18));
        font-weight: 500;
      }
      .dwt-row.dwt-drag-before::before {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        top: -1px;
        height: 2px;
        border-radius: 2px;
        background: var(--dsw-alias-brand-primary, #3b82f6);
      }
      .dwt-row.dwt-drag-after::after {
        content: '';
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: -1px;
        height: 2px;
        border-radius: 2px;
        background: var(--dsw-alias-brand-primary, #3b82f6);
      }
      .dwt-row-title {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12.5px;
        line-height: 1.3;
      }
      .dwt-ws-pill {
        flex-shrink: 0;
        max-width: 82px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 10.5px;
        padding: 1px 5px;
        border-radius: 5px;
        background: var(--dsw-alias-bg-layer-2, rgba(128, 128, 128, 0.12));
        color: var(--dsw-alias-label-secondary, #8e8e93);
      }
      .dwt-row-actions {
        display: none;
        align-items: center;
        gap: 2px;
        flex-shrink: 0;
      }
      .dwt-row:hover .dwt-row-actions {
        display: inline-flex;
      }
      .dwt-row:hover .dwt-ws-pill {
        display: none;
      }
      .dwt-ws-children {
        padding-left: 14px;
        display: flex;
        flex-direction: column;
        gap: 1px;
        margin: 1px 0 3px;
      }
      .dwt-status-dot {
        width: 7px;
        height: 7px;
        border-radius: 999px;
        flex-shrink: 0;
      }
      .dwt-status-running {
        background: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
        animation: dwtPulse 1.6s ease-in-out infinite;
      }
      .dwt-status-pending {
        background: #f59e0b;
        box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
      }
      .dwt-status-unread {
        background: #22c55e;
        box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.22);
      }
      @keyframes dwtPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.45; transform: scale(0.85); }
      }
      /* Header quick actions container */
      [data-dwt-header-actions] {
        display: inline-flex;
        align-items: center;
        gap: 1px;
        margin-left: auto;
        margin-right: 2px;
      }
      /* Color tints on both pinned rows and native session rows (clean soft fill, no left bar) */
      [data-dwt-color="red"] { background: rgba(255, 95, 87, 0.11) !important; }
      [data-dwt-color="orange"] { background: rgba(255, 159, 10, 0.11) !important; }
      [data-dwt-color="yellow"] { background: rgba(255, 214, 10, 0.12) !important; }
      [data-dwt-color="green"] { background: rgba(48, 209, 88, 0.11) !important; }
      [data-dwt-color="blue"] { background: rgba(10, 132, 255, 0.11) !important; }
      [data-dwt-color="purple"] { background: rgba(191, 90, 242, 0.11) !important; }
      [data-dwt-color="gray"] { background: rgba(142, 142, 147, 0.12) !important; }

      /* Subtle status tint on native rows without color label */
      [data-dwt-status="running"]:not([data-dwt-color]) { background: rgba(59, 130, 246, 0.06); }
      [data-dwt-status="pending"]:not([data-dwt-color]) { background: rgba(245, 158, 11, 0.07); }
      [data-dwt-status="unread"]:not([data-dwt-color]) { background: rgba(34, 197, 94, 0.06); }

      /* Locate flash animation */
      @keyframes dwtLocateFlash {
        0% { box-shadow: 0 0 0 2px var(--dsw-alias-brand-primary, #3b82f6); background: rgba(59, 130, 246, 0.22); }
        100% { box-shadow: 0 0 0 0 transparent; }
      }
      [data-dwt-flash="1"] {
        animation: dwtLocateFlash 1.2s ease-out;
      }

      /* Recency sort flex layout on native tree */
      [data-dwt-recency-tree="1"] {
        display: flex !important;
        flex-direction: column !important;
      }

      /* Auto-folded old sessions & deduplicated pinned sessions */
      [data-dwt-folded="1"],
      [data-dwt-pinned-hidden="1"] {
        display: none !important;
      }
      .dwt-fold-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        width: calc(100% - 16px);
        margin: 2px 8px 4px;
        padding: 4px 8px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: var(--dsw-alias-label-tertiary, #8e8e93);
        font-size: 11.5px;
        font-family: inherit;
        cursor: pointer;
        text-align: left;
      }
      .dwt-fold-toggle:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.1));
        color: var(--dsw-alias-label-secondary, inherit);
      }

      /* Settings Modal Overlay */
      .dwt-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.38);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .dwt-modal {
        width: min(440px, 94vw);
        max-height: 84vh;
        display: flex;
        flex-direction: column;
        border-radius: 14px;
        background: var(--dsw-alias-bg-layer-1, #1e1e20);
        color: var(--dsw-alias-label-primary, #f4f4f5);
        border: 1px solid var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.24));
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
        overflow: hidden;
      }
      .dwt-modal-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 16px 18px 12px;
        border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.16));
      }
      .dwt-modal-title {
        font-size: 15px;
        font-weight: 600;
        margin: 0;
      }
      .dwt-modal-sub {
        font-size: 12px;
        color: var(--dsw-alias-label-secondary, #8e8e93);
        margin: 3px 0 0;
      }
      .dwt-modal-body {
        padding: 10px 18px 14px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .dwt-group-label {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.03em;
        color: var(--dsw-alias-label-tertiary, #8e8e93);
        margin: 4px 0 2px;
      }
      .dwt-setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
      }
      .dwt-setting-text {
        min-width: 0;
      }
      .dwt-setting-name {
        font-size: 13px;
        font-weight: 500;
      }
      .dwt-setting-desc {
        font-size: 11.5px;
        color: var(--dsw-alias-label-secondary, #8e8e93);
        margin-top: 2px;
      }
      .dwt-switch {
        position: relative;
        width: 36px;
        height: 20px;
        border-radius: 999px;
        border: none;
        padding: 2px;
        cursor: pointer;
        flex-shrink: 0;
        background: var(--dsw-alias-border-l2, rgba(128, 128, 128, 0.35));
        transition: background 150ms ease;
      }
      .dwt-switch[aria-checked="true"] {
        background: var(--dsw-alias-brand-primary, #3b82f6);
      }
      .dwt-switch-thumb {
        display: block;
        width: 16px;
        height: 16px;
        border-radius: 999px;
        background: #fff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.25);
        transform: translateX(0);
        transition: transform 150ms ease;
      }
      .dwt-switch[aria-checked="true"] .dwt-switch-thumb {
        transform: translateX(16px);
      }
      .dwt-days-bar {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 2px 0 6px;
      }
      .dwt-day-chip {
        padding: 3px 9px;
        border-radius: 6px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.24));
        background: transparent;
        color: var(--dsw-alias-label-secondary, inherit);
        font-size: 12px;
        cursor: pointer;
      }
      .dwt-day-chip.dwt-active {
        background: var(--dsw-alias-brand-primary, #3b82f6);
        border-color: var(--dsw-alias-brand-primary, #3b82f6);
        color: #fff;
      }
      .dwt-modal-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 18px;
        border-top: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.16));
      }
      .dwt-btn {
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(128, 128, 128, 0.24));
        background: transparent;
        color: var(--dsw-alias-label-primary, inherit);
        font-size: 12.5px;
        cursor: pointer;
      }
      .dwt-btn:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(128, 128, 128, 0.14));
      }
      .dwt-btn-primary {
        background: var(--dsw-alias-brand-primary, #3b82f6);
        border-color: var(--dsw-alias-brand-primary, #3b82f6);
        color: #fff;
      }
      .dwt-btn-primary:hover {
        opacity: 0.92;
      }
    `;

    function getSessionStatusKind(status) {
      if (!status) return null;
      if (status.pendingInteraction) return 'pending';
      if (status.running) return 'running';
      if (status.completionUnread) return 'unread';
      return null;
    }

    function workspaceTitle(ws) {
      if (!ws) return '';
      if (ws.title && ws.title.trim()) return ws.title.trim();
      if (ws.path) {
        const parts = ws.path.replace(/[\\/]+$/, '').split(/[\\/]/);
        return parts[parts.length - 1] || ws.path;
      }
      return ws.workspaceId || '';
    }

    function SettingsModal({ prefs, store, t, onClose }) {
      useEffect(() => {
        const onKey = (e) => {
          if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [onClose]);

      const toggle = (key) => store.update((s) => ({ ...s, [key]: !s[key] }));

      const renderSwitch = (key) => h('div', { key, className: 'dwt-setting-row' }, [
        h('div', { key: 'txt', className: 'dwt-setting-text' }, [
          h('div', { key: 'n', className: 'dwt-setting-name' }, t(`settings.${key}`)),
          h('div', { key: 'd', className: 'dwt-setting-desc' }, t(`settings.${key}.desc`)),
        ]),
        h('button', {
          key: 'sw',
          type: 'button',
          role: 'switch',
          'aria-checked': Boolean(prefs[key]),
          className: 'dwt-switch',
          onClick: () => toggle(key),
        }, h('span', { className: 'dwt-switch-thumb' })),
      ]);

      return h('div', {
        className: 'dwt-modal-backdrop',
        onClick: (e) => { if (e.target === e.currentTarget) onClose(); },
      }, h('div', { className: 'dwt-modal', role: 'dialog', 'aria-modal': 'true' }, [
        h('div', { key: 'head', className: 'dwt-modal-head' }, [
          h('div', { key: 'titles' }, [
            h('h3', { key: 't', className: 'dwt-modal-title' }, t('settings.title')),
            h('p', { key: 's', className: 'dwt-modal-sub' }, t('settings.subtitle')),
          ]),
          h('button', {
            key: 'x',
            type: 'button',
            className: 'dwt-icon-btn',
            'aria-label': t('settings.close'),
            onClick: onClose,
          }, h(IconClose, { size: 14 })),
        ]),
        h('div', { key: 'body', className: 'dwt-modal-body' }, [
          h('div', { key: 'g1', className: 'dwt-group-label' }, t('settings.group.pin')),
          renderSwitch('enablePinnedSection'),
          renderSwitch('hidePinnedInWorkspace'),
          renderSwitch('enablePinnedWorkspaces'),
          renderSwitch('enablePinnedSearch'),
          renderSwitch('enableDragReorder'),
          h('div', { key: 'g2', className: 'dwt-group-label' }, t('settings.group.workspace')),
          renderSwitch('enableHeaderActions'),
          renderSwitch('enableStatusHighlight'),
          renderSwitch('enableColorLabels'),
          renderSwitch('enableRecencySort'),
          renderSwitch('enableAutoFold'),
          prefs.enableAutoFold && h('div', { key: 'days', className: 'dwt-days-bar' }, [
            h('span', { key: 'lbl', style: { fontSize: 12, color: 'var(--dsw-alias-label-secondary, #8e8e93)', marginRight: 4 } }, t('settings.foldDays')),
            ...[1, 3, 7, 14, 30].map((d) => h('button', {
              key: d,
              type: 'button',
              className: `dwt-day-chip${prefs.foldDays === d ? ' dwt-active' : ''}`,
              onClick: () => store.update((s) => ({ ...s, foldDays: d })),
            }, `${d}d`)),
          ]),
        ]),
        h('div', { key: 'foot', className: 'dwt-modal-foot' }, [
          h('button', {
            key: 'reset',
            type: 'button',
            className: 'dwt-btn',
            onClick: () => store.reset(),
          }, t('settings.reset')),
          h('button', {
            key: 'close',
            type: 'button',
            className: 'dwt-btn dwt-btn-primary',
            onClick: onClose,
          }, t('settings.close')),
        ]),
      ]));
    }

    function PinnedSection({
      prefs,
      store,
      workspacesSnap,
      sessionsSnap,
      statusMap,
      currentSessionId,
      uiWorkspace,
      useContextMenu,
      t,
      onOpenSettings,
    }) {
      const [searchOpen, setSearchOpen] = useState(false);
      const [query, setQuery] = useState('');
      const [dragId, setDragId] = useState(null);
      const [dragOver, setDragOver] = useState(null);
      const searchInputRef = useRef(null);
      const { getTriggerProps } = useContextMenu();

      const archivedSet = useMemo(
        () => new Set(workspacesSnap?.archivedSessionIds || []),
        [workspacesSnap?.archivedSessionIds],
      );

      const wsById = useMemo(() => {
        const map = new Map();
        for (const ws of workspacesSnap?.items || []) {
          map.set(ws.workspaceId, ws);
        }
        return map;
      }, [workspacesSnap?.items]);

      const sessionToWs = useMemo(() => {
        const map = new Map();
        for (const ws of workspacesSnap?.items || []) {
          for (const sid of ws.sessionIds || []) {
            map.set(sid, ws);
          }
        }
        return map;
      }, [workspacesSnap?.items]);

      const pinnedSessions = useMemo(() => {
        const nativeIds = (workspacesSnap?.pinnedSessionIds || []).filter((id) => !archivedSet.has(id));
        const nativeSet = new Set(nativeIds);
        const savedOrder = (prefs.pinnedSessionOrder || []).filter((id) => nativeSet.has(id));
        const savedSet = new Set(savedOrder);
        const newlyPinned = nativeIds.filter((id) => !savedSet.has(id));
        const ordered = [...newlyPinned, ...savedOrder];
        const byId = sessionsSnap?.byId || {};
        return ordered
          .map((id) => {
            const summary = byId[id];
            if (!summary) return null;
            const ws = sessionToWs.get(id);
            return {
              id,
              title: summary.title || summary.displayTitle || t('pinned.untitled'),
              wsTitle: ws ? workspaceTitle(ws) : t('pinned.ungrouped'),
              updatedAt: summary.updatedAt || 0,
            };
          })
          .filter(Boolean);
      }, [workspacesSnap?.pinnedSessionIds, archivedSet, prefs.pinnedSessionOrder, sessionsSnap?.byId, sessionToWs, t]);

      const pinnedWorkspaces = useMemo(() => {
        if (!prefs.enablePinnedWorkspaces) return [];
        const byId = sessionsSnap?.byId || {};
        return (prefs.pinnedWorkspaceIds || [])
          .map((id) => wsById.get(id))
          .filter(Boolean)
          .map((ws) => {
            const sessions = (ws.sessionIds || [])
              .filter((sid) => !archivedSet.has(sid) && byId[sid])
              .map((sid) => ({
                id: sid,
                title: byId[sid].title || byId[sid].displayTitle || t('pinned.untitled'),
                updatedAt: byId[sid].updatedAt || 0,
              }))
              .sort((a, b) => b.updatedAt - a.updatedAt);
            return {
              workspaceId: ws.workspaceId,
              path: ws.path,
              title: workspaceTitle(ws),
              sessions,
            };
          });
      }, [prefs.enablePinnedWorkspaces, prefs.pinnedWorkspaceIds, wsById, archivedSet, sessionsSnap?.byId, t]);

      const normalizedQ = query.trim().toLowerCase();
      const filteredSessions = useMemo(() => {
        if (!normalizedQ) return pinnedSessions;
        return pinnedSessions.filter(
          (item) => item.title.toLowerCase().includes(normalizedQ) || item.wsTitle.toLowerCase().includes(normalizedQ),
        );
      }, [pinnedSessions, normalizedQ]);

      const filteredWorkspaces = useMemo(() => {
        if (!normalizedQ) return pinnedWorkspaces;
        return pinnedWorkspaces.filter(
          (ws) => ws.title.toLowerCase().includes(normalizedQ)
            || ws.sessions.some((s) => s.title.toLowerCase().includes(normalizedQ)),
        );
      }, [pinnedWorkspaces, normalizedQ]);

      const totalCount = pinnedSessions.length + pinnedWorkspaces.length;

      useEffect(() => {
        if (searchOpen) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      }, [searchOpen]);

      const commitReorder = useCallback((sourceId, targetId, half) => {
        if (!sourceId || !targetId || sourceId === targetId) return;
        const currentIds = pinnedSessions.map((s) => s.id);
        const filtered = currentIds.filter((id) => id !== sourceId);
        const idx = filtered.indexOf(targetId);
        if (idx === -1) return;
        const insertAt = half === 'after' ? idx + 1 : idx;
        filtered.splice(insertAt, 0, sourceId);
        store.update((s) => ({ ...s, pinnedSessionOrder: filtered }));
      }, [pinnedSessions, store]);

      const togglePinnedWsExpand = (wsId) => {
        store.update((s) => {
          const cur = new Set(s.expandedPinnedWsIds || []);
          if (cur.has(wsId)) cur.delete(wsId);
          else cur.add(wsId);
          return { ...s, expandedPinnedWsIds: Array.from(cur) };
        });
      };

      const unpinWorkspace = (wsId) => {
        store.update((s) => ({
          ...s,
          pinnedWorkspaceIds: (s.pinnedWorkspaceIds || []).filter((id) => id !== wsId),
          expandedPinnedWsIds: (s.expandedPinnedWsIds || []).filter((id) => id !== wsId),
        }));
      };

      const renderSessionRow = (item, { draggable = false, showWsPill = true } = {}) => {
        const statusKind = prefs.enableStatusHighlight ? getSessionStatusKind(statusMap?.get(item.id)) : null;
        const colorKey = prefs.enableColorLabels ? prefs.colorLabels?.[item.id] : undefined;
        const colorInfo = colorKey ? COLOR_MAP[colorKey] : undefined;
        const selected = item.id === currentSessionId;
        const isDragOver = dragOver && dragOver.id === item.id;
        const className = [
          'dwt-row',
          selected ? 'dwt-selected' : '',
          isDragOver && dragOver.half === 'before' ? 'dwt-drag-before' : '',
          isDragOver && dragOver.half === 'after' ? 'dwt-drag-after' : '',
        ].filter(Boolean).join(' ');

        const ctxTrigger = getTriggerProps({
          kind: 'session',
          value: { sessionId: item.id, displayTitle: item.title },
        });

        return h('div', {
          key: item.id,
          className,
          'data-dwt-pinned-sid': draggable ? item.id : undefined,
          'data-dwt-color': colorInfo ? colorInfo.id : undefined,
          draggable: draggable && prefs.enableDragReorder && !normalizedQ,
          onClick: () => uiWorkspace.openSession(item.id),
          ...ctxTrigger,
          onDragStart: (draggable && prefs.enableDragReorder && !normalizedQ) ? (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.id);
            setDragId(item.id);
          } : undefined,
          onDragOver: (draggable && prefs.enableDragReorder && dragId && dragId !== item.id) ? (e) => {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            const half = e.clientY - rect.top > rect.height / 2 ? 'after' : 'before';
            setDragOver({ id: item.id, half });
          } : undefined,
          onDrop: (draggable && prefs.enableDragReorder && dragId) ? (e) => {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            const half = e.clientY - rect.top > rect.height / 2 ? 'after' : 'before';
            commitReorder(dragId, item.id, half);
            setDragId(null);
            setDragOver(null);
          } : undefined,
          onDragEnd: () => {
            setDragId(null);
            setDragOver(null);
          },
        }, [
          statusKind && h('span', {
            key: 'st',
            className: `dwt-status-dot dwt-status-${statusKind}`,
            title: t(`status.${statusKind}`),
          }),
          h('span', { key: 'title', className: 'dwt-row-title', title: item.title }, item.title),
          showWsPill && h('span', { key: 'ws', className: 'dwt-ws-pill', title: item.wsTitle }, item.wsTitle),
          draggable && h('span', { key: 'acts', className: 'dwt-row-actions' }, [
            h('button', {
              key: 'unpin',
              type: 'button',
              className: 'dwt-icon-btn',
              title: t('pinned.unpinSession'),
              onClick: (e) => {
                e.stopPropagation();
                uiWorkspace.unpinSession(item.id).catch(() => {});
              },
            }, h(IconPin, { size: 12, filled: true })),
          ]),
        ]);
      };

      const expandedWsSet = new Set(prefs.expandedPinnedWsIds || []);

      return h('div', { className: 'dwt-pinned-section' }, [
        h('div', { key: 'hdr', className: 'dwt-pin-header' }, [
          h('button', {
            key: 'left',
            type: 'button',
            className: 'dwt-pin-header-left',
            onClick: () => store.update((s) => ({ ...s, pinnedCollapsed: !s.pinnedCollapsed })),
          }, [
            h(IconChevron, { key: 'ch', size: 11, open: !prefs.pinnedCollapsed }),
            h(IconPin, { key: 'ic', size: 12, filled: true }),
            h('span', { key: 'lbl' }, t('pinned.title')),
            h('span', { key: 'cnt', className: 'dwt-pin-count' }, `(${totalCount})`),
          ]),
          h('div', { key: 'right', className: 'dwt-pin-header-actions' }, [
            prefs.enablePinnedSearch && !prefs.pinnedCollapsed && totalCount > 0 && h('button', {
              key: 'search',
              type: 'button',
              className: `dwt-icon-btn${searchOpen ? ' dwt-active' : ''}`,
              title: t('pinned.searchToggle'),
              onClick: () => {
                setSearchOpen((v) => {
                  if (v) setQuery('');
                  return !v;
                });
              },
            }, h(IconSearch, { size: 12 })),
            h('button', {
              key: 'cfg',
              type: 'button',
              className: 'dwt-icon-btn',
              title: t('header.settings'),
              onClick: onOpenSettings,
            }, h(IconSliders, { size: 12 })),
          ]),
        ]),
        !prefs.pinnedCollapsed && prefs.enablePinnedSearch && searchOpen && h('div', { key: 'sbox', className: 'dwt-search-wrap' }, [
          h(IconSearch, { key: 'si', size: 12 }),
          h('input', {
            key: 'inp',
            ref: searchInputRef,
            type: 'text',
            className: 'dwt-search-input',
            placeholder: t('pinned.searchPlaceholder'),
            value: query,
            onChange: (e) => setQuery(e.target.value),
            onKeyDown: (e) => {
              if (e.key === 'Escape') {
                setQuery('');
                setSearchOpen(false);
              }
            },
          }),
          query && h('button', {
            key: 'clr',
            type: 'button',
            className: 'dwt-icon-btn',
            onClick: () => setQuery(''),
          }, h(IconClose, { size: 11 })),
        ]),
        !prefs.pinnedCollapsed && h('div', { key: 'list', className: 'dwt-pin-list' }, [
          totalCount === 0 && h('div', { key: 'empty', className: 'dwt-pin-empty' }, t('pinned.empty')),
          totalCount > 0 && filteredWorkspaces.length === 0 && filteredSessions.length === 0 && h(
            'div',
            { key: 'nomatch', className: 'dwt-pin-empty' },
            t('pinned.noMatches'),
          ),
          ...filteredWorkspaces.map((ws) => {
            const expanded = expandedWsSet.has(ws.workspaceId) || Boolean(normalizedQ);
            const wsCtxTrigger = getTriggerProps({
              kind: 'workspace',
              value: { workspaceId: ws.workspaceId, path: ws.path, displayTitle: ws.title },
            });
            const visibleChildren = normalizedQ
              ? ws.sessions.filter((s) => s.title.toLowerCase().includes(normalizedQ) || ws.title.toLowerCase().includes(normalizedQ))
              : ws.sessions.slice(0, 8);
            return h('div', { key: `ws:${ws.workspaceId}` }, [
              h('div', {
                key: 'row',
                className: 'dwt-row',
                onClick: () => togglePinnedWsExpand(ws.workspaceId),
                ...wsCtxTrigger,
              }, [
                h(IconChevron, { key: 'ch', size: 11, open: expanded }),
                h(IconFolder, { key: 'f', size: 13, open: expanded }),
                h('span', { key: 't', className: 'dwt-row-title', title: ws.title }, ws.title),
                h('span', { key: 'cnt', className: 'dwt-ws-pill' }, String(ws.sessions.length)),
                h('span', { key: 'acts', className: 'dwt-row-actions' }, [
                  h('button', {
                    key: 'new',
                    type: 'button',
                    className: 'dwt-icon-btn',
                    title: t('pinned.newSession'),
                    onClick: (e) => {
                      e.stopPropagation();
                      uiWorkspace.startSession(ws.workspaceId);
                    },
                  }, h(IconPlus, { size: 12 })),
                  h('button', {
                    key: 'unpin',
                    type: 'button',
                    className: 'dwt-icon-btn',
                    title: t('pinned.unpinWorkspace'),
                    onClick: (e) => {
                      e.stopPropagation();
                      unpinWorkspace(ws.workspaceId);
                    },
                  }, h(IconPin, { size: 12, filled: true })),
                ]),
              ]),
              expanded && visibleChildren.length > 0 && h('div', { key: 'kids', className: 'dwt-ws-children' },
                visibleChildren.map((child) => renderSessionRow(child, { draggable: false, showWsPill: false })),
              ),
            ]);
          }),
          ...filteredSessions.map((item) => renderSessionRow(item, { draggable: true, showWsPill: true })),
        ]),
      ]);
    }

    function HeaderQuickActions({ prefs, store, currentSessionId, workspacesSnap, t, onOpenSettings, onRevealWorkspace }) {
      const handleLocate = () => {
        if (!currentSessionId) return;
        const isPinned = (workspacesSnap?.pinnedSessionIds || []).includes(currentSessionId);
        if (isPinned && prefs.enablePinnedSection && prefs.hidePinnedInWorkspace) {
          if (prefs.pinnedCollapsed) {
            store.update((s) => ({ ...s, pinnedCollapsed: false }));
          }
          const scrollToPinned = (attempt = 0) => {
            const pinnedRow = document.querySelector(`[data-dwt-pinned-host] [data-dwt-pinned-sid="${CSS.escape(currentSessionId)}"]`);
            if (pinnedRow) {
              pinnedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
              pinnedRow.setAttribute('data-dwt-flash', '1');
              setTimeout(() => pinnedRow.removeAttribute('data-dwt-flash'), 1250);
            } else if (attempt < 5) {
              setTimeout(() => scrollToPinned(attempt + 1), 60);
            }
          };
          setTimeout(() => scrollToPinned(0), 40);
          return;
        }

        const listArea = document.querySelector('[data-sidebar-list-area]');
        if (!listArea) return;

        // Ensure owning workspace is expanded and not auto-folded
        const ownerWs = (workspacesSnap?.items || []).find((ws) => (ws.sessionIds || []).includes(currentSessionId));
        if (ownerWs) {
          onRevealWorkspace(ownerWs.workspaceId);
          const wsRow = listArea.querySelector(`[data-row-key="workspace:${CSS.escape(ownerWs.workspaceId)}"]`);
          if (wsRow && wsRow.getAttribute('aria-expanded') === 'false') {
            wsRow.click();
          }
        }

        const scrollToRow = (attempt = 0) => {
          const row = listArea.querySelector(`[data-row-key="session:${CSS.escape(currentSessionId)}"]`);
          if (row) {
            row.removeAttribute('data-dwt-folded');
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.setAttribute('data-dwt-flash', '1');
            setTimeout(() => row.removeAttribute('data-dwt-flash'), 1250);
          } else if (attempt < 5) {
            setTimeout(() => scrollToRow(attempt + 1), 80);
          }
        };
        setTimeout(() => scrollToRow(0), 50);
      };

      const handleToggleAll = (expand) => {
        const listArea = document.querySelector('[data-sidebar-list-area]');
        if (!listArea) return;
        const targetVal = expand ? 'false' : 'true';
        const rows = listArea.querySelectorAll(`[data-row-key^="workspace:"][aria-expanded="${targetVal}"]`);
        rows.forEach((row) => row.click());
      };

      return h(React.Fragment, null, [
        prefs.enableHeaderActions && h('button', {
          key: 'locate',
          type: 'button',
          className: 'dwt-icon-btn',
          title: t('header.locate'),
          disabled: !currentSessionId,
          style: currentSessionId ? undefined : { opacity: 0.4, cursor: 'default' },
          onClick: (e) => { e.stopPropagation(); handleLocate(); },
        }, h(IconLocate, { size: 13 })),
        prefs.enableHeaderActions && h('button', {
          key: 'collapse',
          type: 'button',
          className: 'dwt-icon-btn',
          title: t('header.collapseAll'),
          onClick: (e) => { e.stopPropagation(); handleToggleAll(false); },
        }, h(IconCollapseAll, { size: 13 })),
        prefs.enableHeaderActions && h('button', {
          key: 'expand',
          type: 'button',
          className: 'dwt-icon-btn',
          title: t('header.expandAll'),
          onClick: (e) => { e.stopPropagation(); handleToggleAll(true); },
        }, h(IconExpandAll, { size: 13 })),
        !prefs.enablePinnedSection && h('button', {
          key: 'cfg',
          type: 'button',
          className: 'dwt-icon-btn',
          title: t('header.settings'),
          onClick: (e) => { e.stopPropagation(); onOpenSettings(); },
        }, h(IconSliders, { size: 13 })),
      ]);
    }

    function createSidebarEnhancerComponent(ctx, store) {
      return function SidebarEnhancer(props) {
        const { useWorkspaces, useSessions, useSessionStatus, useContextMenu } = props;
        const workspacesSnap = useWorkspaces((s) => s);
        const sessionsSnap = useSessions((s) => s);
        const statusMap = useSessionStatus((s) => s);
        const prefs = useStoreSnapshot(store);

        const [lang, setLang] = useState(() => getLocaleLang(ctx));
        const [settingsOpen, setSettingsOpen] = useState(false);
        const [pinnedHost, setPinnedHost] = useState(null);
        const [headerHost, setHeaderHost] = useState(null);
        const [unfoldedWsMap, setUnfoldedWsMap] = useState({});

        useEffect(() => {
          const updateLang = () => setLang(getLocaleLang(ctx));
          updateLang();
          return ctx.locale?.subscribe?.(updateLang);
        }, []);

        const dict = lang === 'zh' ? LOCALE_ZH : LOCALE_EN;
        const t = useCallback((key, vars) => formatText(dict, key, vars), [dict]);

        const currentSessionId = useMemo(() => {
          const byId = sessionsSnap?.byId || {};
          for (const s of Object.values(byId)) {
            if ((s?.retainedBy?.mainView ?? 0) > 0) return s.id;
          }
          return undefined;
        }, [sessionsSnap?.byId]);

        // Attach portal containers into DSH sidebar DOM when wide sidebar is mounted
        useEffect(() => {
          let pinnedEl = null;
          let headerEl = null;

          const syncMounts = () => {
            const scrollport = document.querySelector('[data-sidebar-scrollport]');
            const wsHeader = document.querySelector('[data-sidebar-workspace-header]');

            if (scrollport && wsHeader) {
              // Find the direct child of scrollport that contains wsHeader (regionArea)
              let regionChild = wsHeader;
              while (regionChild && regionChild.parentElement !== scrollport) {
                regionChild = regionChild.parentElement;
              }
              if (regionChild && regionChild.parentElement === scrollport) {
                let existing = regionChild.querySelector(':scope > [data-dwt-pinned-host]');
                if (!existing) {
                  // Clean up any stale host placed directly under scrollport
                  scrollport.querySelectorAll(':scope > [data-dwt-pinned-host]').forEach((el) => {
                    try { el.remove(); } catch {}
                  });
                  existing = document.createElement('div');
                  existing.setAttribute('data-dwt-pinned-host', '');
                  regionChild.insertBefore(existing, regionChild.firstChild);
                }
                if (existing !== pinnedEl) {
                  pinnedEl = existing;
                  setPinnedHost(existing);
                }
              }
            } else if (pinnedEl) {
              pinnedEl = null;
              setPinnedHost(null);
            }

            if (wsHeader) {
              let existingHdr = wsHeader.querySelector('[data-dwt-header-actions]');
              if (!existingHdr) {
                existingHdr = document.createElement('div');
                existingHdr.setAttribute('data-dwt-header-actions', '');
                const lastChild = wsHeader.lastElementChild;
                if (lastChild) wsHeader.insertBefore(existingHdr, lastChild);
                else wsHeader.appendChild(existingHdr);
              }
              if (existingHdr !== headerEl) {
                headerEl = existingHdr;
                setHeaderHost(existingHdr);
              }
            } else if (headerEl) {
              headerEl = null;
              setHeaderHost(null);
            }
          };

          syncMounts();
          const observer = new MutationObserver(syncMounts);
          observer.observe(document.body, { childList: true, subtree: true });
          return () => {
            observer.disconnect();
            document.querySelectorAll('[data-dwt-pinned-host], [data-dwt-header-actions]').forEach((el) => {
              try { el.remove(); } catch {}
            });
          };
        }, []);

        // Apply non-invasive enhancements to native WorkspaceBrowser DOM:
        // (1) Color labels, (2) Status accents, (3) Workspace recency sort, (4) Auto-fold old sessions
        useEffect(() => {
          const applyDomEffects = () => {
            const listArea = document.querySelector('[data-sidebar-list-area]');
            if (!listArea) return;

            const byId = sessionsSnap?.byId || {};
            const pinnedSet = new Set(workspacesSnap?.pinnedSessionIds || []);
            const archivedSet = new Set(workspacesSnap?.archivedSessionIds || []);
            const now = Date.now();
            const cutoffMs = (prefs.foldDays || 3) * 86400000;

            // 1 & 2: Color labels, status accents & deduplicating pinned sessions on native session rows
            const shouldHidePinned = Boolean(prefs.enablePinnedSection && prefs.hidePinnedInWorkspace);
            const sessionRows = listArea.querySelectorAll('[data-row-key^="session:"]');
            sessionRows.forEach((row) => {
              const key = row.getAttribute('data-row-key') || '';
              const sid = key.slice('session:'.length);
              if (shouldHidePinned && pinnedSet.has(sid)) {
                if (row.getAttribute('data-dwt-pinned-hidden') !== '1') {
                  row.setAttribute('data-dwt-pinned-hidden', '1');
                }
              } else if (row.hasAttribute('data-dwt-pinned-hidden')) {
                row.removeAttribute('data-dwt-pinned-hidden');
              }

              const color = prefs.enableColorLabels ? prefs.colorLabels?.[sid] : undefined;
              if (color && COLOR_MAP[color]) {
                if (row.getAttribute('data-dwt-color') !== color) row.setAttribute('data-dwt-color', color);
              } else if (row.hasAttribute('data-dwt-color')) {
                row.removeAttribute('data-dwt-color');
              }

              const statusKind = prefs.enableStatusHighlight ? getSessionStatusKind(statusMap?.get(sid)) : null;
              if (statusKind) {
                if (row.getAttribute('data-dwt-status') !== statusKind) row.setAttribute('data-dwt-status', statusKind);
              } else if (row.hasAttribute('data-dwt-status')) {
                row.removeAttribute('data-dwt-status');
              }
            });

            // 3: Workspace recency sort via CSS flex order (never mutates React DOM child order)
            const treeEl = listArea.querySelector('[role="tree"]');
            const wsRows = listArea.querySelectorAll('[data-row-key^="workspace:"]');
            const isWorkspaceTree = treeEl && wsRows.length > 0;

            if (isWorkspaceTree && prefs.enableRecencySort) {
              treeEl.setAttribute('data-dwt-recency-tree', '1');
              const wsLatest = new Map();
              for (const ws of workspacesSnap?.items || []) {
                let latest = 0;
                for (const sid of ws.sessionIds || []) {
                  if (archivedSet.has(sid)) continue;
                  const s = byId[sid];
                  if (s && s.updatedAt > latest) latest = s.updatedAt;
                }
                if (latest === 0 && ws.createdAt) {
                  latest = Date.parse(ws.createdAt) || 0;
                }
                wsLatest.set(ws.workspaceId, latest);
              }
              const ranked = Array.from(wsLatest.entries()).sort((a, b) => b[1] - a[1]);
              const rankMap = new Map(ranked.map(([id], idx) => [id, idx]));

              wsRows.forEach((wsRow) => {
                const wsKey = (wsRow.getAttribute('data-row-key') || '').slice('workspace:'.length);
                let section = wsRow.parentElement;
                while (section && section.parentElement !== treeEl) {
                  section = section.parentElement;
                }
                if (section && section.parentElement === treeEl) {
                  const orderVal = rankMap.has(wsKey) ? String(rankMap.get(wsKey)) : '99999';
                  if (section.style.order !== orderVal) section.style.order = orderVal;
                }
              });
            } else if (treeEl) {
              if (treeEl.hasAttribute('data-dwt-recency-tree')) {
                treeEl.removeAttribute('data-dwt-recency-tree');
              }
              Array.from(treeEl.children).forEach((child) => {
                if (child.style && child.style.order) child.style.order = '';
              });
            }

            // 4: Auto-fold older sessions (> foldDays) per workspace group
            wsRows.forEach((wsRow) => {
              const wsKey = (wsRow.getAttribute('data-row-key') || '').slice('workspace:'.length);
              const groupSection = wsRow.parentElement;
              if (!groupSection) return;

              const directSessions = Array.from(groupSection.children).filter((el) =>
                (el.getAttribute('data-row-key') || '').startsWith('session:'),
              );
              const existingBtn = groupSection.querySelector(':scope > .dwt-fold-toggle');

              if (!prefs.enableAutoFold || wsRow.getAttribute('aria-expanded') !== 'true') {
                directSessions.forEach((el) => el.removeAttribute('data-dwt-folded'));
                if (existingBtn) {
                  try { existingBtn.remove(); } catch {}
                }
                return;
              }

              const oldRows = [];
              for (const row of directSessions) {
                const sid = (row.getAttribute('data-row-key') || '').slice('session:'.length);
                const summary = byId[sid];
                const st = statusMap?.get(sid);
                const keepVisible =
                  !summary
                  || sid === currentSessionId
                  || pinnedSet.has(sid)
                  || st?.running
                  || Boolean(st?.pendingInteraction)
                  || st?.completionUnread
                  || (now - (summary.updatedAt || now)) <= cutoffMs;
                if (!keepVisible) oldRows.push(row);
              }

              if (oldRows.length === 0) {
                directSessions.forEach((el) => el.removeAttribute('data-dwt-folded'));
                if (existingBtn) {
                  try { existingBtn.remove(); } catch {}
                }
                return;
              }

              const isUnfolded = Boolean(unfoldedWsMap[wsKey]);
              const oldSet = new Set(oldRows);
              directSessions.forEach((row) => {
                if (oldSet.has(row) && !isUnfolded) {
                  row.setAttribute('data-dwt-folded', '1');
                } else {
                  row.removeAttribute('data-dwt-folded');
                }
              });

              const label = isUnfolded
                ? t('fold.collapse')
                : t('fold.expand', { n: oldRows.length, days: prefs.foldDays });

              let btn = existingBtn;
              if (!btn) {
                btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'dwt-fold-toggle';
                btn.onclick = (e) => {
                  e.stopPropagation();
                  setUnfoldedWsMap((prev) => ({ ...prev, [wsKey]: !prev[wsKey] }));
                };
                groupSection.appendChild(btn);
              }
              if (btn.textContent !== label) btn.textContent = label;
            });
          };

          applyDomEffects();
          const listArea = document.querySelector('[data-sidebar-list-area]');
          if (!listArea) return undefined;
          let rafId = 0;
          const schedule = () => {
            if (rafId) return;
            rafId = window.requestAnimationFrame(() => {
              rafId = 0;
              applyDomEffects();
            });
          };
          const observer = new MutationObserver(schedule);
          observer.observe(listArea, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-expanded'] });

          return () => {
            if (rafId) window.cancelAnimationFrame(rafId);
            observer.disconnect();
          };
        }, [prefs, workspacesSnap, sessionsSnap, statusMap, currentSessionId, unfoldedWsMap, t]);

        // Cleanup all DOM attributes when component unmounts
        useEffect(() => () => {
          document.querySelectorAll('[data-dwt-color]').forEach((el) => el.removeAttribute('data-dwt-color'));
          document.querySelectorAll('[data-dwt-status]').forEach((el) => el.removeAttribute('data-dwt-status'));
          document.querySelectorAll('[data-dwt-folded]').forEach((el) => el.removeAttribute('data-dwt-folded'));
          document.querySelectorAll('[data-dwt-pinned-hidden]').forEach((el) => el.removeAttribute('data-dwt-pinned-hidden'));
          document.querySelectorAll('.dwt-fold-toggle').forEach((el) => { try { el.remove(); } catch {} });
          document.querySelectorAll('[data-dwt-recency-tree]').forEach((tree) => {
            tree.removeAttribute('data-dwt-recency-tree');
            Array.from(tree.children).forEach((child) => {
              if (child.style && child.style.order) child.style.order = '';
            });
          });
        }, []);

        const onRevealWorkspace = useCallback((wsId) => {
          setUnfoldedWsMap((prev) => (prev[wsId] ? prev : { ...prev, [wsId]: true }));
        }, []);

        return h(React.Fragment, null, [
          pinnedHost && prefs.enablePinnedSection && ReactDOM?.createPortal && ReactDOM.createPortal(
            h(PinnedSection, {
              prefs,
              store,
              workspacesSnap,
              sessionsSnap,
              statusMap,
              currentSessionId,
              uiWorkspace: ctx.uiWorkspace,
              useContextMenu,
              t,
              onOpenSettings: () => setSettingsOpen(true),
            }),
            pinnedHost,
          ),
          headerHost && (prefs.enableHeaderActions || !prefs.enablePinnedSection) && ReactDOM?.createPortal && ReactDOM.createPortal(
            h(HeaderQuickActions, {
              prefs,
              store,
              currentSessionId,
              workspacesSnap,
              t,
              onOpenSettings: () => setSettingsOpen(true),
              onRevealWorkspace,
            }),
            headerHost,
          ),
          settingsOpen && h(SettingsModal, {
            key: 'modal',
            prefs,
            store,
            t,
            onClose: () => setSettingsOpen(false),
          }),
        ]);
      };
    }

    return {
      name: NS,
      inject: ['slots', 'workspaces', 'sessions', 'uiWorkspace', 'contextMenus', 'locale'],
      apply(ctx) {
        const store = createPrefsStore();

        // Inject stylesheet
        ctx.effect(() => {
          let styleEl = document.getElementById(STYLE_ID);
          if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = STYLE_ID;
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = CSS_TEXT;
          return () => {
            try { styleEl.remove(); } catch {}
          };
        }, `${NS}: styles`);

        // Register context-menu icons
        ctx.slots.inject('contextMenu.icon', function* () {
          yield ctx.slots.register({ name: 'contextMenu.icon', key: 'dwt.pin' }, () => h(IconPin, { size: 14 }));
          yield ctx.slots.register({ name: 'contextMenu.icon', key: 'dwt.unpin' }, () => h(IconPin, { size: 14, filled: true }));
          yield ctx.slots.register({ name: 'contextMenu.icon', key: 'dwt.tag' }, () => h(IconTag, { size: 14 }));
          yield ctx.slots.register({ name: 'contextMenu.icon', key: 'dwt.clear' }, () => h(IconClose, { size: 13 }));
          for (const c of COLOR_LABELS) {
            yield ctx.slots.register(
              { name: 'contextMenu.icon', key: `dwt.color.${c.id}` },
              () => h(IconColorDot, { hex: c.hex, size: 11 }),
            );
          }
        });

        // Register native Session context menu: 7-color macOS labels
        ctx.effect(() => ctx.contextMenus.register({
          id: `${NS}.session.colorLabel`,
          target: 'session',
          order: 150,
          observe: () => [store, ctx.locale],
          resolve: (target) => {
            const prefs = store.getSnapshot();
            if (!prefs.enableColorLabels) return [];
            const lang = getLocaleLang(ctx);
            const dict = lang === 'zh' ? LOCALE_ZH : LOCALE_EN;
            const currentColor = prefs.colorLabels?.[target.sessionId];
            const children = COLOR_LABELS.map((c) => ({
              id: `color-${c.id}`,
              label: `${lang === 'zh' ? c.zh : c.en}${currentColor === c.id ? ' ✓' : ''}`,
              icon: { key: `dwt.color.${c.id}` },
              run: () => {
                store.update((s) => {
                  const next = { ...(s.colorLabels || {}) };
                  if (next[target.sessionId] === c.id) delete next[target.sessionId];
                  else next[target.sessionId] = c.id;
                  return { ...s, colorLabels: next };
                });
              },
            }));
            if (currentColor) {
              children.push({
                id: 'color-clear',
                label: dict['menu.clearColor'],
                icon: { key: 'dwt.clear' },
                separatorBefore: true,
                run: () => {
                  store.update((s) => {
                    const next = { ...(s.colorLabels || {}) };
                    delete next[target.sessionId];
                    return { ...s, colorLabels: next };
                  });
                },
              });
            }
            return [{
              id: 'color-label',
              label: dict['menu.colorLabel'],
              icon: { key: currentColor ? `dwt.color.${currentColor}` : 'dwt.tag' },
              children,
            }];
          },
        }), `${NS}: session color label menu`);

        // Register native Workspace context menu: Pin / Unpin workspace to top
        ctx.effect(() => ctx.contextMenus.register({
          id: `${NS}.workspace.pinTop`,
          target: 'workspace',
          order: 50,
          observe: () => [store, ctx.locale],
          resolve: (target) => {
            const prefs = store.getSnapshot();
            if (!prefs.enablePinnedSection || !prefs.enablePinnedWorkspaces) return [];
            const lang = getLocaleLang(ctx);
            const dict = lang === 'zh' ? LOCALE_ZH : LOCALE_EN;
            const pinned = (prefs.pinnedWorkspaceIds || []).includes(target.workspaceId);
            return [{
              id: 'pin-workspace',
              label: pinned ? dict['menu.unpinWorkspace'] : dict['menu.pinWorkspace'],
              icon: { key: pinned ? 'dwt.unpin' : 'dwt.pin' },
              run: () => {
                store.update((s) => {
                  const list = s.pinnedWorkspaceIds || [];
                  const next = list.includes(target.workspaceId)
                    ? list.filter((id) => id !== target.workspaceId)
                    : [target.workspaceId, ...list];
                  return { ...s, pinnedWorkspaceIds: next };
                });
              },
            }];
          },
        }), `${NS}: workspace pin menu`);

        // Mount sidebar enhancer controller in shell.overlay
        const SidebarEnhancer = createSidebarEnhancerComponent(ctx, store);
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: `${NS}.sidebar-enhancer`,
        }, SidebarEnhancer));
      },
    };
  },
});
