import { defaultWorkshop, timeouts, workshopRoutes } from '../../constants'
import { test } from '../../fixtures'
import { createNuxtGoto } from '../../helpers'
import { WorkshopDetailPage } from '../../page-objects/marketing/workshop-detail.page'
import { expect } from '@playwright/test'

test.describe('Workshop Detail Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopDetailPage: WorkshopDetailPage

  test.beforeEach(async ({ page }) => {
    const goto = createNuxtGoto(page)
    workshopDetailPage = new WorkshopDetailPage(page, goto)
    await workshopDetailPage.navigateToWorkshopDetails(defaultWorkshop.name)
  })

  test('display workshop content', async ({ page }) => {
    await expect(page.getByText(defaultWorkshop.name).first()).toBeVisible()
  })

  test('navigate to schedules and back', async ({ page }) => {
    await workshopDetailPage.clickBrowseSchedules()
    await expect(page).toHaveURL(workshopRoutes.schedules)
    await page.goBack()
    await expect(page).toHaveURL(workshopRoutes.details)
    await workshopDetailPage.goBackToWorkshops()
    await expect(page).toHaveURL(workshopRoutes.workshops)
  })
})
