/**
 * Unified Timeout Constants
 *
 * Centralized timeout configuration for all E2E tests across the monorepo.
 * These values are used by admin, web, and lifecycle tests for consistent wait behaviors.
 */

/**
 * Page-level timeouts for navigation and loading
 */
export const pageTimeouts = {
  /** Standard page load timeout (15s) */
  pageLoad: 15000,
  /** Navigation timeout between pages (10s) */
  navigation: 10000,
  /** Hydration timeout for Nuxt apps (10s) */
  hydration: 10000,
  /** Network idle state timeout (10s) */
  networkIdle: 10000,
} as const

/**
 * API and data operation timeouts
 */
export const apiTimeouts = {
  /** Standard API request timeout (15s) */
  request: 15000,
  /** Data table loading timeout (20s) */
  dataTableLoad: 20000,
  /** Card loading timeout (20s) */
  cardLoad: 20000,
  /** File upload timeout (30s) */
  fileUpload: 30000,
  /** Create operation timeout (15s) */
  create: 15000,
  /** Update operation timeout (15s) */
  update: 15000,
  /** Delete operation timeout (10s) */
  delete: 10000,
} as const

/**
 * UI interaction timeouts
 */
export const uiTimeouts = {
  /** Element visibility timeout (15s) */
  elementVisible: 15000,
  /** Element hidden timeout (15s) */
  elementHidden: 15000,
  /** Modal/dialog open timeout (3s) */
  modalOpen: 3000,
  /** Modal/dialog close timeout (3s) */
  modalClose: 3000,
  /** Button click timeout (5s) */
  buttonClick: 5000,
  /** Form submission timeout (15s) */
  formSubmit: 15000,
  /** Form field wait (500ms) */
  formWait: 500,
  /** Toggle switch timeout (5s) */
  toggleSwitch: 5000,
} as const

/**
 * Notification and toast timeouts
 */
export const notificationTimeouts = {
  /** Success notification timeout (5s) */
  success: 5000,
  /** Error notification timeout (10s) */
  error: 10000,
  /** Warning notification timeout (5s) */
  warning: 5000,
  /** Info notification timeout (5s) */
  info: 5000,
} as const

/**
 * Animation timeouts
 */
export const animationTimeouts = {
  /** Standard transition timeout (500ms) */
  transition: 500,
  /** Fade in animation (300ms) */
  fadeIn: 300,
  /** Slide in animation (400ms) */
  slideIn: 400,
} as const

/**
 * Test workflow timeouts
 */
export const workflowTimeouts = {
  /** Full workflow timeout for complex multi-step operations (10 minutes) */
  fullWorkflow: 600000,
  /** Standard test timeout (60s) */
  standard: 60000,
  /** Extended test timeout for complex operations (120s) */
  extended: 120000,
  /** Quick test timeout (30s) */
  quick: 30000,
} as const

/**
 * Wait and retry timeouts
 */
export const waitTimeouts = {
  /** Short wait (500ms) */
  short: 500,
  /** Medium wait (1s) */
  medium: 1000,
  /** Long wait (2s) */
  long: 2000,
  /** Extra long wait (5s) */
  extraLong: 5000,
} as const

/**
 * All timeouts combined for convenience
 */
export const timeouts = {
  page: pageTimeouts,
  api: apiTimeouts,
  ui: uiTimeouts,
  notification: notificationTimeouts,
  animation: animationTimeouts,
  workflow: workflowTimeouts,
  wait: waitTimeouts,
} as const

/**
 * Legacy flat structure for backward compatibility
 * @deprecated Use the structured `timeouts` object instead
 */
export const legacyTimeouts = {
  // Page timeouts
  pageLoad: pageTimeouts.pageLoad,
  navigation: pageTimeouts.navigation,
  hydration: pageTimeouts.hydration,

  // API timeouts
  apiRequest: apiTimeouts.request,
  dataTableLoad: apiTimeouts.dataTableLoad,
  fileUpload: apiTimeouts.fileUpload,

  // UI timeouts
  elementVisible: uiTimeouts.elementVisible,
  modalOpen: uiTimeouts.modalOpen,
  modalClose: uiTimeouts.modalClose,
  buttonClick: uiTimeouts.buttonClick,
  formSubmit: uiTimeouts.formSubmit,

  // Notification timeouts
  notificationSuccess: notificationTimeouts.success,
  notificationError: notificationTimeouts.error,
  notificationWarning: notificationTimeouts.warning,
  notificationInfo: notificationTimeouts.info,

  // Data operation timeouts
  create: apiTimeouts.create,
  update: apiTimeouts.update,
  delete: apiTimeouts.delete,

  // Animation timeouts
  transition: animationTimeouts.transition,
  fadeIn: animationTimeouts.fadeIn,
  slideIn: animationTimeouts.slideIn,
} as const

// Type exports
export type PageTimeouts = typeof pageTimeouts
export type ApiTimeouts = typeof apiTimeouts
export type UiTimeouts = typeof uiTimeouts
export type NotificationTimeouts = typeof notificationTimeouts
export type AnimationTimeouts = typeof animationTimeouts
export type WorkflowTimeouts = typeof workflowTimeouts
export type WaitTimeouts = typeof waitTimeouts
export type Timeouts = typeof timeouts
export type LegacyTimeouts = typeof legacyTimeouts
