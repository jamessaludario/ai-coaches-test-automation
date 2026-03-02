import type { UserCredentials } from '../../constants'
import { coachProfileLifecycleConstants, timeouts } from '../../constants'
import { test } from '../../fixtures'
import { getTimestamp } from '../../helpers/date.helper'
import { generateUserTestData } from '../../helpers/date.helper'

test.describe('Onboarding to Booking', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)

  test.skip(true, 'Onboarding to booking workflow pending implementation')

  test('new user completes onboarding and makes first booking', async ({ page, browser }) => {
    // TODO: Implement full lifecycle from registration to booking
  })
})
