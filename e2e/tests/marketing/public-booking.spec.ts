import { defaultWorkshop, timeouts, workshopContent } from '../../constants'
import { test } from '../../fixtures'
import { createNuxtGoto, navigateToWorkshopScheduleDetails } from '../../helpers'
import { expect } from '@playwright/test'

test.describe('Public Booking Flow', () => {
  test.setTimeout(timeouts.workflow.extended)

  test('navigate to booking from schedule details', async ({ page }) => {
    const goto = createNuxtGoto(page)
    await navigateToWorkshopScheduleDetails(page, goto, defaultWorkshop.name)

    await page.getByRole('link', { name: workshopContent.schedule.bookButton }).click()
    await expect(page).toHaveURL(/\/(book|login)/)
  })
})
