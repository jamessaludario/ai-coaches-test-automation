import { timeouts } from '../../constants'
import { expect, test } from '../../fixtures'
import { CoachAccountProfilePage } from '../../page-objects/coach/account-profile.page'

test.describe('Coach Account Profile', () => {
  test.setTimeout(timeouts.workflow.extended)
  let accountPage: CoachAccountProfilePage

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    accountPage = new CoachAccountProfilePage(authenticatedCoachPage)
    await accountPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  

  test('display account profile page', async ({ authenticatedCoachPage }) => {
    await expect(authenticatedCoachPage).toHaveURL(/account\/profile/)
    await expect(accountPage.introductionVideoSection).toBeVisible()
  })
})
