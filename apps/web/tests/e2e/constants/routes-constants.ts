/**
 * Web module route constants only.
 * Contains static paths, regex patterns, and dynamic route helpers for the web app.
 */

export const userRoutes = {
  coach: {
    // Static
    login: '/login?redirect=/c',
    dashboard: '/c',
    workshops: '/c/workshops',
    bookings: '/c/bookings',
    account: '/c/account/profile',
    workshopSchedules: '/c/workshop-schedules',
    // Regex
    workshopDetails: /\/c\/workshops\/[^/]+$/,
    workshopScheduleDetails: /\/c\/workshop-schedules\/([^/]+)$/,
    bookingDetails: /\/c\/bookings\/([^/]+)$/,
  },
  client: {
    // Static
    login: '/login?redirect=/b',
    dashboard: '/b',
    workshops: '/b/workshops',
    bookings: '/b/bookings',
    account: '/b/account/profile',
    // Regex
    workshopDetails: /\/b\/workshops\/[^/]+$/,
    bookingDetails: /\/b\/bookings\/([^/]+)$/,
  },
} as const

/** Static marketing/page routes */
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

/** Static legal page paths (coach/client) */
export const legalRoutes = {
  privacyPolicyCoach: '/c/privacy-policy',
  termsAndConditionsCoach: '/c/terms-and-conditions',
  privacyPolicyClient: '/b/privacy-policy',
  termsAndConditionsClient: '/b/terms-and-conditions',
} as const
