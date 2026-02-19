import { defaultWorkshop, testUsers, timeouts } from '../../constants'
import { test } from '../../fixtures'
import {
  createNuxtGoto,
  expectAllScheduleSections,
  expectBookingOrLoginUrl,
  expectScheduleCoachSection,
  expectScheduleDetailsVisible,
  expectSchedulesListUrl,
} from '../../helpers'
import { WorkshopScheduleDetailsPage } from '../../page-objects'

test.describe('Workshop Schedule Details Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let scheduleDetailsPage: WorkshopScheduleDetailsPage

  test.beforeEach(async ({ page }) => {
    const goto = createNuxtGoto(page)
    scheduleDetailsPage = new WorkshopScheduleDetailsPage(page, goto)
    await scheduleDetailsPage.navigateToScheduleDetails(defaultWorkshop.name)
  })

  test('display schedule content and key elements', async ({ page }) => {
    await expectScheduleDetailsVisible(page, defaultWorkshop.name)
  })

  test('display all workshop sections', async ({ page }) => {
    await expectAllScheduleSections(page)
  })

  test('navigate to booking and back', async ({ page }) => {
    await scheduleDetailsPage.clickBookButton()
    await expectBookingOrLoginUrl(page)
    await scheduleDetailsPage.goBack()
    await expectSchedulesListUrl(page)
  })

  test('display coach information section', async ({ page }) => {
    await scheduleDetailsPage.scrollToCoachSection()
    await expectScheduleCoachSection(page, testUsers.coach.fullName)
  })
})
