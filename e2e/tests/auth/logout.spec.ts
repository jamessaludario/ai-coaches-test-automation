import { testUsers, timeouts } from '../../constants'
import { test } from '../../fixtures'
import { logout } from '../../helpers'
import { expect } from '@playwright/test'

test.describe('Logout', () => {
  test.setTimeout(timeouts.workflow.extended)

  // eslint-disable-next-line no-empty-pattern
  

  test('logout from coach account', async ({ authenticatedCoachPage }) => {
    await authenticatedCoachPage.goto('/c')
    await authenticatedCoachPage.waitForLoadState('networkidle')
    await logout(authenticatedCoachPage, testUsers.coach)
    await expect(authenticatedCoachPage).toHaveURL(/\/login/)
  })
})
