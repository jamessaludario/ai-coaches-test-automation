import * as process from 'node:process'

/**
 * Shared login/onboarding/redirect paths for auth flows
 */
const ONBOARDING_STEP_TWO = 2

export const loginRoutes = {
  onboarding: `/onboarding/${ONBOARDING_STEP_TWO}`,
  home: '/',
  login: '/login',
  loginRedirect: '/login?redirect=',
  redirectToClientDashboard: '/b',
  redirectToCoachDashboard: '/c',
} as const

function getAdminBaseUrl() {
  const adminBaseUrl = process.env.NUXT_PUBLIC_ADMIN_BASE || 'http://localhost:3001'
  return adminBaseUrl.endsWith('/') ? adminBaseUrl : `${adminBaseUrl}/`
}

export const adminBaseUrl = getAdminBaseUrl()

/**
 * Web app user routes (coach & client portals)
 */
export const userRoutes = {
  coach: {
    login: '/login?redirect=/c',
    dashboard: '/c',
    workshops: '/c/workshops',
    bookings: '/c/bookings',
    account: '/c/account/profile',
    workshopSchedules: '/c/workshop-schedules',
    workshopDetails: /\/c\/workshops\/[^/]+$/,
    workshopScheduleDetails: /\/c\/workshop-schedules\/([^/]+)$/,
    bookingDetails: /\/c\/bookings\/([^/]+)$/,
  },
  client: {
    login: '/login?redirect=/b',
    dashboard: '/b',
    workshops: '/b/workshops',
    bookings: '/b/bookings',
    account: '/b/account/profile',
    workshopDetails: /\/b\/workshops\/[^/]+$/,
    bookingDetails: /\/b\/bookings\/([^/]+)$/,
  },
} as const

/** Marketing/public page routes */
export const pageRoutes = {
  home: '/',
  workshops: '/workshops',
  consultants: '/consultants',
  consultantProfilePattern: '/:username',
  login: '/login',
  loginRedirect: '/login?redirect=',
  workshopSchedules: '/workshops/schedules',
} as const

/** Regex patterns for workshop marketing URLs */
export const workshopRoutes = {
  schedules: /\/workshops\/schedules\/?(?:\?.*)?$/,
  scheduleDetails: /\/workshops\/schedules\/[a-z0-9]+\/?(?:\?.*)?$/,
  details: /\/workshops\/[^/]+(\/[^/]+)?\/?$/,
  workshops: /\/workshops\/?(?:\?.*)?$/,
  bookOrLogin: /\/workshops\/schedules\/[^/]+\/(book|login)/,
} as const

/** Legal page paths (coach/client) */
export const legalRoutes = {
  privacyPolicyCoach: '/c/privacy-policy',
  termsAndConditionsCoach: '/c/terms-and-conditions',
  privacyPolicyClient: '/b/privacy-policy',
  termsAndConditionsClient: '/b/terms-and-conditions',
} as const

/**
 * Admin app routes
 */
export const adminRoutes = {
  dashboard: '/',
  users: '/users',
  workshops: '/workshops',
  workshopSchedules: '/workshop-schedules',
  bookings: '/bookings',
  vouchers: '/vouchers',
  roles: '/roles',
  roleCreate: '/roles/create',

  usersRouteRegex: /\/users\/[^/]+$/i,
  workshopsRouteRegex: /\/workshops\/[^/]+$/i,
  workshopSchedulesRouteRegex: /\/workshop-schedules\/[^/]+$/i,
  bookingsRouteRegex: /\/bookings\/[^/]+$/i,
  vouchersRouteRegex: /\/vouchers\/[^/]+$/i,
  rolesRouteRegex: /\/roles\/[^/]+$/i,

  userDetail: (id: string) => `/users/${id}`,
  userEdit: (id: string) => `/users/${id}/edit`,
  userWorkshops: (id: string) => `/users/${id}/workshops`,
  userPayouts: (id: string) => `/users/${id}/payouts`,
  userCoachProfile: (id: string) => `/users/${id}/coach-profile`,

  workshopDetail: (id: string) => `/workshops/${id}`,
  workshopCalendar: (id: string) => `/workshops/${id}/calendar`,
  workshopHistory: (id: string) => `/workshops/${id}/history`,
  workshopInvoices: (id: string) => `/workshops/${id}/invoices`,
  workshopPayouts: (id: string) => `/workshops/${id}/payouts`,
  workshopResources: (id: string) => `/workshops/${id}/resources`,

  bookingDetail: (id: string) => `/bookings/${id}`,
  bookingSeats: (id: string) => `/bookings/${id}/seats`,
  bookingPayments: (id: string) => `/bookings/${id}/payments`,

  voucherDetail: (id: string) => `/vouchers/${id}`,

  roleDetail: (id: string) => `/roles/${id}`,
  roleEdit: (id: string) => `/roles/${id}/edit`,
} as const

/**
 * Shared admin routes for cross-app workflows
 */
export const sharedAdminRoutes = {
  users: '/users',
  userDetail: (id: string) => `/users/${id}`,
} as const
