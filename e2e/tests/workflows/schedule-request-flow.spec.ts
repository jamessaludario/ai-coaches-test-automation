import { createNuxtGoto, type NuxtGoto } from '@e2e/helpers/navigation.helper'
import { WorkshopDetailPage } from '@e2e/page-objects/marketing/workshop-detail.page'
import { expectToastMessage } from '@e2e/helpers/toast.helper'
import { waitForModalOpen } from '@e2e/helpers/form.helper'
import { coaches, defaultWorkshop, timeouts } from '../../constants'
import { expect, test } from '../../fixtures'

const SCHEDULE_REQUEST = {
  modal: {
    heading: 'New Schedule Request',
    submitButton: 'Submit Schedule Request',
  },
  toast: {
    success: /Schedule Request Created/i,
  },
  form: {
    name: 'James Saludario',
    email: 'james.saludario@go.team',
    participants: '10',
    mode: 'ONLINE',
    country: 'Philippines',
    state: 'Cebu',
    city: 'Cebu City',
    message: 'We would like to schedule a workshop for our sales team. Preferred morning sessions.',
  },
} as const

test.describe('Schedule Request Flow', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)

  test('client requests schedule and coach responds', async ({ page }) => {
    const goto = createNuxtGoto(page)

    await test.step('client opens schedule request modal from workshop detail', async () => {
      const workshopDetailPage = new WorkshopDetailPage(page, goto)
      await workshopDetailPage.navigateToWorkshopDetails(defaultWorkshop.name)
      await workshopDetailPage.clickScheduleRequestButton()
      await waitForModalOpen(page, SCHEDULE_REQUEST.modal.heading)
    })

    await test.step('client fills in personal information', async () => {
      await page.getByLabel(/Full Name/i).fill(SCHEDULE_REQUEST.form.name)
      await page.getByLabel(/Email Address/i).fill(SCHEDULE_REQUEST.form.email)
    })

    await test.step('client selects workshop and coach', async () => {
      const label = page.locator('label', { hasText: /^Preferred Coach$/i });
      const forId = await label.getAttribute('for');
      page.locator(`#${forId} button`).click()
      await page.getByRole('option', { name: new RegExp(coaches.default.name, 'i') }).click()
    })

    await test.step('client selects preferred dates', async () => {
      const datePickerButton = page.getByRole('button', { name: /Pick dates/i })
      await datePickerButton.click()

      const nextMonthButton = page.getByRole('button', { name: /next/i }).or(page.locator('button[aria-label*="Next"]'))
      await nextMonthButton.first().click()
      await page.waitForTimeout(timeouts.animation.transition)

      const availableDays = page.locator('[data-reka-calendar-cell-trigger]').filter({
        hasNot: page.locator('[data-disabled]'),
      })
      const dayCount = await availableDays.count()
      const datesToSelect = Math.min(3, dayCount)
      for (let i = 0; i < datesToSelect; i++) {
        await availableDays.nth(i + 8).click()
        await page.waitForTimeout(timeouts.animation.fadeIn)
      }

      await page.keyboard.press('Escape')
    })

    await test.step('client fills in details', async () => {
      await page.getByLabel(/Number of Participants/i).fill(SCHEDULE_REQUEST.form.participants)

      const modeSelect = page.getByLabel(/Preferred Mode/i)
      await modeSelect.click()
      await page.getByRole('option', { name: new RegExp(SCHEDULE_REQUEST.form.mode, 'i') }).click()

      const countrySelect = page.getByLabel(/Country/i)
      await countrySelect.click()
      await page.getByRole('option', { name: SCHEDULE_REQUEST.form.country }).click()

      await page.getByLabel(/^State$/i).fill(SCHEDULE_REQUEST.form.state)
      await page.getByLabel(/^City$/i).fill(SCHEDULE_REQUEST.form.city)
    })

    await test.step('client adds additional message', async () => {
      await page.getByLabel(/Additional message/i).fill(SCHEDULE_REQUEST.form.message)
    })

    await test.step('client submits schedule request', async () => {
      const submitButton = page.getByRole('button', { name: SCHEDULE_REQUEST.modal.submitButton })
      await expect(submitButton).toBeEnabled()
      await submitButton.click()
      await expectToastMessage(page, SCHEDULE_REQUEST.toast.success)
    })

    // await test.step('coach responds', async () => {
    //   // TODO: Implement coach response flow
    // })
  })
})
