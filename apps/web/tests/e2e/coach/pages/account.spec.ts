import { timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import { expectCoachProfileSectionsVisible } from '../../helpers'
import { CoachAccountPage } from '../../page-objects'

/**
 * Coach Account - Page Tests
 *
 * Tests coach account profile functionality
 */

test.describe('Coach Account Profile', () => {
  test.setTimeout(timeouts.workflow.extended)
  let accountPage: CoachAccountPage

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    accountPage = new CoachAccountPage(authenticatedCoachPage)
    await accountPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test('display account profile page', async ({ authenticatedCoachPage }) => {
    await expect(authenticatedCoachPage).toHaveURL(/account\/profile/)
    await expectCoachProfileSectionsVisible(authenticatedCoachPage)
  })
})
