/**
 * Admin module route constants only.
 * Contains static paths, regex patterns, and dynamic route helpers for the admin app.
 */

export const adminRoutes = {
  // Static
  dashboard: '/',
  users: '/users',
  workshops: '/workshops',
  workshopSchedules: '/workshop-schedules',
  bookings: '/bookings',
  vouchers: '/vouchers',
  roles: '/roles',
  roleCreate: '/roles/create',

  // Regex (for waitForURL / toHaveURL)
  usersRouteRegex: /\/users\/[^/]+$/i,
  workshopsRouteRegex: /\/workshops\/[^/]+$/i,
  workshopSchedulesRouteRegex: /\/workshop-schedules\/[^/]+$/i,
  bookingsRouteRegex: /\/bookings\/[^/]+$/i,
  vouchersRouteRegex: /\/vouchers\/[^/]+$/i,
  rolesRouteRegex: /\/roles\/[^/]+$/i,

  // Dynamic
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

  // Role routes (grouped together)
  roleDetail: (id: string) => `/roles/${id}`,
  roleEdit: (id: string) => `/roles/${id}/edit`,
} as const
