/**
 * Shared Admin Constants
 *
 * These constants provide minimal shared routes and selectors for admin UI
 * that are needed by cross-app workflows (e.g., web tests that interact with admin)
 *
 * NOTE: This is a MINIMAL subset. For full admin constants, see:
 * apps/admin/tests/e2e/constants/admin-selectors.ts
 * apps/admin/tests/e2e/constants/admin-routes.ts
 */

/**
 * Shared admin routes for cross-app workflows
 */
export const sharedAdminRoutes = {
  users: '/users',
  userDetail: (id: string) => `/users/${id}`,
} as const

/**
 * Shared admin selectors for cross-app workflows
 *
 * Only includes selectors that are commonly used across apps
 */
export const sharedAdminSelectors = {
  users: {
    heading: /Users/i,
    createButton: /New/i,
    tabs: {
      details: /Details/i,
      coachProfile: /Coach Profile/i,
      workshops: /Workshops/i,
      payouts: /Payouts/i,
      edit: /Edit/i,
    },
  },
  buttons: {
    save: /Save/i,
    submit: /Submit/i,
    continue: /Continue/i,
    cancel: /Cancel/i,
    confirm: /Confirm/i,
    generatePassword: /Generate/i,
  },
  forms: {
    firstName: /First Name/i,
    lastName: /Last Name/i,
    email: /Email/i,
    username: /Username/i,
    password: /Password/i,
    bio: /Bio/i,
    headline: /Headline/i,
  },
  notifications: {
    userCreated: /User Created/i,
    userUpdated: /User (Updated|Saved)|Profile updated/i,
  },
  dataTable: {
    searchInput: /Search/i,
  },
} as const
