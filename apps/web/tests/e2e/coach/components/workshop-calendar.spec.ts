import { defaultWorkshop, timeouts } from '../../constants'
import { cleanupAuthFile, expect, test } from '../../fixtures'
import {
  expectToastMessage,
  fillScheduleForm,
  findScheduleInCalendar,
  navigateToCalendarTab,
  openNewScheduleDialog,
  openWorkshop,
  updateAndConfirmSchedule,
} from '../../helpers'
import { CoachDashboardPage } from '../../page-objects'
import { addDays, getFutureDate, getPastDate, setTime } from '../../utils'

/**
 * Workshop Calendar - Component Tests
 *
 * Tests calendar scheduling dialog and form validation
 */

test.describe('Workshop Calendar Component', () => {
  test.setTimeout(timeouts.workflow.extended)
  let dashboard: CoachDashboardPage

  test.beforeEach(async ({ authenticatedCoachPage }) => {
    dashboard = new CoachDashboardPage(authenticatedCoachPage)
    await dashboard.goto()
    await dashboard.navigateToWorkshops()
    await openWorkshop(authenticatedCoachPage, defaultWorkshop.name)
    await navigateToCalendarTab(authenticatedCoachPage)
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('coach', testInfo.workerIndex)
  })

  test.describe('Schedule Form Validation', () => {
    test('prevent scheduling with past date', async ({ authenticatedCoachPage }) => {
      test.skip(true, 'Skipping test')
      await openNewScheduleDialog(authenticatedCoachPage)

      const pastDate = getPastDate(7)
      const startDateTime = setTime(pastDate, 10, 0)
      const endDateTime = setTime(pastDate, 11, 0)

      await fillScheduleForm(authenticatedCoachPage, {
        startDate: startDateTime,
        endDate: endDateTime,
        startTime: '10:00',
        endTime: '11:00',
        country: 'Philippines',
        level: 'Beginner',
        status: 'Published',
        visibility: 'Public',
        mode: 'Online',
      })

      const scheduleButton = authenticatedCoachPage.getByRole('button', { name: /schedule|create|save/i })
      const isEnabled = await scheduleButton.isEnabled().catch(() => false)

      if (isEnabled) {
        await scheduleButton.click()

        const hasError = await authenticatedCoachPage.locator('[role="alert"]').filter({ hasText: /date|past|future/i }).isVisible().catch(() => false)
        const dialogOpen = await authenticatedCoachPage.getByRole('heading', { name: /schedule|new event/i }).isVisible().catch(() => false)

        expect(hasError || dialogOpen).toBe(true)
      }
      else {
        await expect(scheduleButton).toBeDisabled()
      }
    })

    test('accept future dates for scheduling', async ({ authenticatedCoachPage }) => {
      await openNewScheduleDialog(authenticatedCoachPage)

      const futureDate = getFutureDate(7)
      const startDateTime = setTime(futureDate, 10, 0)
      const endDateTime = setTime(futureDate, 11, 0)

      await fillScheduleForm(authenticatedCoachPage, {
        startDate: startDateTime,
        endDate: endDateTime,
        startTime: '10:00',
        endTime: '11:00',
        country: 'Philippines',
        level: 'Beginner',
        status: 'Published',
        visibility: 'Public',
        mode: 'Online',
      })

      const scheduleButton = authenticatedCoachPage.getByRole('button', { name: /schedule|create|save/i })
      await expect(scheduleButton).toBeEnabled()
      await scheduleButton.click()

      const dialogHeading = authenticatedCoachPage.getByRole('heading', { name: /schedule|new event/i })
      await expect(dialogHeading).toBeHidden({ timeout: 10000 })

      await expectToastMessage(authenticatedCoachPage, /schedule created/i)

      const newSchedule = await findScheduleInCalendar(authenticatedCoachPage, {
        date: startDateTime,
      })
      expect(newSchedule.found).toBe(true)
      if (!newSchedule.element) {
        const targetDay = startDateTime.toLocaleDateString()
        throw new Error(`Schedule for ${targetDay} not found in the calendar`)
      }
      await expect(newSchedule.element).toBeVisible({ timeout: 10000 })
    })

    test('update schedule date and time', async ({ authenticatedCoachPage }) => {
      await authenticatedCoachPage.waitForTimeout(timeouts.wait.long)
      let scheduleResult = await findScheduleInCalendar(authenticatedCoachPage, { status: 'Published' })

      if (!scheduleResult.found) {
        scheduleResult = await findScheduleInCalendar(authenticatedCoachPage, {})
      }

      if (!scheduleResult.found) {
        test.skip(true, 'No schedules available to edit')
      }

      await scheduleResult.element?.click()

      await authenticatedCoachPage.getByRole('heading', { name: 'Edit Workshop Schedule' })
        .waitFor({ state: 'visible', timeout: 5000 })

      const newStartDate = scheduleResult.reference?.date ? addDays(scheduleResult.reference.date, 14) : addDays(new Date(), 14)
      const newStartDateTime = setTime(newStartDate, 14, 30)
      const newEndDateTime = setTime(newStartDate, 15, 30)

      await fillScheduleForm(authenticatedCoachPage, {
        startDate: newStartDateTime,
        endDate: newEndDateTime,
        startTime: '14:30',
        endTime: '15:30',
      })

      await updateAndConfirmSchedule(authenticatedCoachPage)
      await authenticatedCoachPage.getByRole('heading', { name: 'Edit Workshop Schedule' })
        .waitFor({ state: 'hidden', timeout: 5000 })

      await authenticatedCoachPage.reload({ waitUntil: 'networkidle' })
      await navigateToCalendarTab(authenticatedCoachPage)

      const updatedSchedule = await findScheduleInCalendar(authenticatedCoachPage, {
        date: newStartDateTime,
      })
      if (!updatedSchedule.element) {
        throw new Error(`Updated schedule for ${newStartDateTime.toLocaleDateString()} not found`)
      }
      await expect(updatedSchedule.element).toBeVisible({ timeout: 10000 })
    })
  })
})
