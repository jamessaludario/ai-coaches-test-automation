import * as process from 'node:process'

/**
 * Shared route constants used by all modules (admin, web, lifecycles).
 * May contain static paths, regex patterns, and dynamic route helpers.
 * For admin-only routes use @e2e-admin/constants; for web-only use apps/web/tests/e2e/constants.
 */

// Onboarding step constant
const ONBOARDING_STEP_TWO = 2

/** Shared login/onboarding/redirect paths for auth flows across apps */
export const loginRoutes = {
  // Step 2 is the user role selection step
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
