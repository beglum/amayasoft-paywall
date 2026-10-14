/** Состояния экрана (фреймы Figma) для форса через ?state= или демо-панель. */
export const PREVIEW_STATES = ['default', 'loading', 'error', 'purchasing', 'success', 'restore-empty', 'restore-success'] as const
export type PreviewState = (typeof PREVIEW_STATES)[number]
