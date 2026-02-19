import { adminBaseUrl, bookingContent, coaches, pageRoutes, RESOURCE_DATA, timeouts, WORKSHOP_DATA, workshopContent, workshopRoutes } from '../constants'
import { expect, test } from '../fixtures'
import {
  adminAddsWorkshopResource,
  adminCreatesWorkshop,
  clientCompletesBooking,
  clientNavigatesToWorkshop,
  clientSelectsSchedule,
  coachSchedulesWorkshop,
  createNuxtGoto,
  verifyWorkshopBooking,
} from '../helpers'
import { WorkshopsPage } from '../page-objects'
import { escapeRegExp } from '../utils'

/**
 * Complete Workshop Lifecycle Integration Tests
 * Tests the full workshop lifecycle from creation to booking
 */

test.describe('Complete Workshop Lifecycle', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)

  test('creates workshop and completes booking end-to-end', async ({ page, browser }) => {
    let createdWorkshopTitle!: string
    let scheduleStartDate!: Date

    // ==================== PHASE 1: WORKSHOP CREATION (ADMIN) ====================
    await test.step('Phase 1: Admin creates workshop', async () => {
      createdWorkshopTitle = await adminCreatesWorkshop(
        page,
        WORKSHOP_DATA,
        adminBaseUrl,
        pageRoutes.workshops,
      )
    })

    // ==================== PHASE 2: RESOURCE MANAGEMENT (ADMIN) ====================
    await test.step('Phase 2: Admin adds workshop resource', async () => {
      await adminAddsWorkshopResource(page, RESOURCE_DATA)
      await page.close()
    })

    // ==================== PHASE 3: COACH ROLE - SCHEDULING ====================
    await test.step('Phase 3: Coach schedules workshop', async () => {
      const coachContext = await browser.newContext()
      const coachPage = await coachContext.newPage()

      scheduleStartDate = await coachSchedulesWorkshop(coachPage, createdWorkshopTitle)

      await coachPage.close()
      await coachContext.close()
    })

    // ==================== PHASE 4: CLIENT BOOKING ====================
    await test.step('Phase 4: Client books workshop', async () => {
      const clientContext = await browser.newContext()
      const clientPage = await clientContext.newPage()

      const goto = createNuxtGoto(clientPage)
      const workshopsPage = new WorkshopsPage(clientPage, goto)

      await test.step('Client logs in and finds workshop', async () => {
        await clientNavigatesToWorkshop(
          clientPage,
          createdWorkshopTitle,
          pageRoutes.home,
          workshopsPage,
        )
        await clientPage.waitForURL(workshopRoutes.details, { timeout: 10000 })
        await clientPage.waitForLoadState('networkidle')
      })

      await test.step('Client selects workshop schedule', async () => {
        const stringSections = workshopContent.details.sections.filter(s => typeof s === 'string')
        const scheduleSection = stringSections.find(s => s.match(/schedule/i))

        if (!scheduleSection) {
          throw new Error(`No schedule section found in workshopContent.details.sections. Available: ${stringSections.join(', ')}`)
        }
        await clientSelectsSchedule(
          clientPage,
          scheduleStartDate,
          scheduleSection,
          workshopContent.details.bookNowButton,
        )
      })

      await test.step('Client completes booking', async () => {
        const bookingId = await clientCompletesBooking(
          clientPage,
          bookingContent as unknown as Parameters<typeof clientCompletesBooking>[1],
          createdWorkshopTitle,
          coaches.default.name,
          escapeRegExp,
        )
        expect(bookingId).toBeTruthy()
      })

      await test.step('Client verifies booking', async () => {
        await verifyWorkshopBooking(
          clientPage,
          scheduleStartDate,
          bookingContent.confirmation.paymentStatus,
          coaches.default.name,
        )
      })

      await clientPage.close()
      await clientContext.close()
    })
  })
})
