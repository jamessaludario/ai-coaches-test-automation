/**
 * Timeout Constants
 */
export const pageTimeouts = {
  pageLoad: 15000,
  navigation: 10000,
  hydration: 10000,
  networkIdle: 10000,
} as const

export const apiTimeouts = {
  request: 15000,
  dataTableLoad: 20000,
  cardLoad: 20000,
  fileUpload: 30000,
  create: 15000,
  update: 15000,
  delete: 10000,
} as const

export const uiTimeouts = {
  elementVisible: 15000,
  elementHidden: 15000,
  modalOpen: 3000,
  modalClose: 3000,
  buttonClick: 5000,
  formSubmit: 15000,
  formWait: 500,
  toggleSwitch: 5000,
} as const

export const notificationTimeouts = {
  success: 5000,
  error: 10000,
  warning: 5000,
  info: 5000,
} as const

export const animationTimeouts = {
  transition: 500,
  fadeIn: 300,
  slideIn: 400,
} as const

export const workflowTimeouts = {
  fullWorkflow: 600000,
  standard: 60000,
  extended: 120000,
  quick: 30000,
} as const

export const waitTimeouts = {
  short: 500,
  medium: 1000,
  long: 2000,
  extraLong: 5000,
} as const

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
 * Workshop mode enums
 */
export const workshopModes = [
  { name: 'Online', textLocator: 'online' },
  { name: 'In-Person', textLocator: 'in-person' },
  { name: 'Hybrid', textLocator: 'hybrid' },
] as const

export const workshopDateFilters = [
  { name: 'Today', filterKey: 'today' },
  { name: 'This Week', filterKey: 'week' },
  { name: 'This Month', filterKey: 'month' },
] as const
