import { expect } from '@playwright/test'
import {
  adminSelectors,
  BOOKING_DATA,
  bookingContent,
  coaches,
  defaultWorkshop,
  PAYMENT_DATA,
  RESOURCE_DATA,
  SCHEDULE_DATA,
  timeouts,
  userRoutes,
  WORKSHOP_DATA,
} from '../../constants'
import { test } from '../../fixtures'
import { getFutureDate, formatDateToISO } from '../../helpers/date.helper'
import {
  createNuxtGoto,
  navigateToWorkshopScheduleDetails,
} from '../../helpers/navigation.helper'
import {
  fillAddressForm,
  fillStripePayment,
  selectDropdownOption,
  submitFormAndWaitForSuccess,
  waitForModalClose,
  waitForModalOpen,
} from '../../helpers/form.helper'
import { expectToastMessage } from '../../helpers/toast.helper'
import { searchDataTable } from '../../helpers/table.helper'
import { AdminWorkshopsPage } from '../../page-objects/admin/workshops.page'
import { CoachWorkshopDetailPage } from '../../page-objects/coach/workshop-detail.page'
import { BookingStepperPage } from '../../page-objects/marketing/booking-stepper.page'
import { ScheduleDetailPage } from '../../page-objects/marketing/schedule-detail.page'

/**
 * Complete Workshop Lifecycle Integration Test
 *
 * Phases:
 *   1. Admin creates a workshop
 *   2. Admin adds a resource to the workshop
 *   3. Coach schedules the workshop
 *   4. Client books the workshop and verifies the booking
 */
test.describe('Complete Workshop Lifecycle', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)

  test('creates workshop and completes booking end-to-end', async ({
    authenticatedAdminPage,
    authenticatedCoachPage,
    authenticatedClientPage,
  }) => {
    const workshopTitle = WORKSHOP_DATA.title

    // ==================== PHASE 1: ADMIN CREATES WORKSHOP ====================
    await test.step('Phase 1: Admin creates workshop', async () => {
      const workshopsPage = new AdminWorkshopsPage(authenticatedAdminPage)
      await workshopsPage.goto()
      await expect(workshopsPage.heading).toBeVisible()

      // Open create dialog
      await workshopsPage.createButton.click()
      await waitForModalOpen(authenticatedAdminPage, /create.*workshop|new.*workshop|add.*workshop/i)

      // Fill workshop form
      await authenticatedAdminPage.getByLabel(/title|name/i).first().fill(workshopTitle)
      await authenticatedAdminPage.getByLabel(/description/i).first().fill(WORKSHOP_DATA.description)
      await authenticatedAdminPage.getByLabel(/price/i).first().fill(String(WORKSHOP_DATA.price))

      // Submit workshop creation
      await submitFormAndWaitForSuccess(
        authenticatedAdminPage,
        adminSelectors.buttons.create,
        adminSelectors.notifications.success,
      )

      // Verify workshop appears in the data table
      await workshopsPage.searchWorkshop(workshopTitle)
      await expect(authenticatedAdminPage.getByText(workshopTitle).first()).toBeVisible({
        timeout: timeouts.ui.elementVisible,
      })
    })

    // ==================== PHASE 2: ADMIN ADDS RESOURCE ====================
    await test.step('Phase 2: Admin adds workshop resource', async () => {
      const workshopsPage = new AdminWorkshopsPage(authenticatedAdminPage)

      // Navigate into the workshop detail
      await workshopsPage.viewWorkshop(workshopTitle)
      await workshopsPage.clickResourcesTab()

      // Add resource
      const addButton = authenticatedAdminPage.getByRole('button', { name: /add|new|upload/i }).first()
      await addButton.click()
      await waitForModalOpen(authenticatedAdminPage, /resource|add.*resource|new.*resource/i)

      await authenticatedAdminPage.getByLabel(/title|name/i).first().fill(RESOURCE_DATA.title)
      await authenticatedAdminPage.getByLabel(/description/i).first().fill(RESOURCE_DATA.description)
      await authenticatedAdminPage.getByLabel(/url|link/i).first().fill(RESOURCE_DATA.url)

      await submitFormAndWaitForSuccess(
        authenticatedAdminPage,
        adminSelectors.buttons.create,
        adminSelectors.notifications.success,
      )
    })

    // ==================== PHASE 3: COACH SCHEDULES WORKSHOP ====================
    const scheduleStartDate = getFutureDate(SCHEDULE_DATA.daysOffset)

    await test.step('Phase 3: Coach schedules workshop', async () => {
      // Navigate to coach workshops and find the created workshop
      const coachWorkshopPage = new CoachWorkshopDetailPage(authenticatedCoachPage)
      await authenticatedCoachPage.goto(userRoutes.coach.workshops, { waitUntil: 'networkidle' })

      // Search and open the workshop
      await searchDataTable(authenticatedCoachPage, workshopTitle)
      await authenticatedCoachPage.getByRole('link', { name: new RegExp(workshopTitle, 'i') }).first().click()
      await authenticatedCoachPage.waitForURL(userRoutes.coach.workshopDetails, { timeout: timeouts.page.navigation })

      // Navigate to calendar and create schedule
      await coachWorkshopPage.navigateToCalendar()

      // Open schedule creation dialog
      const scheduleButton = authenticatedCoachPage.getByRole('button', { name: /schedule|new.*schedule|add.*schedule|create/i }).first()
      await scheduleButton.click()
      await waitForModalOpen(authenticatedCoachPage, /schedule|new.*event|create.*schedule/i)

      // Fill schedule dates
      const startDateInput = authenticatedCoachPage.getByLabel(/start.*date/i).first()
      await startDateInput.fill(formatDateToISO(scheduleStartDate))

      const endDate = getFutureDate(SCHEDULE_DATA.daysOffset + SCHEDULE_DATA.duration)
      const endDateInput = authenticatedCoachPage.getByLabel(/end.*date/i).first()
      await endDateInput.fill(formatDateToISO(endDate))

      // Fill optional schedule fields
      const countryInput = authenticatedCoachPage.getByLabel(/country/i)
      if (await countryInput.isVisible().catch(() => false)) {
        await selectDropdownOption(authenticatedCoachPage, /country/i, SCHEDULE_DATA.country)
      }

      const visibilityInput = authenticatedCoachPage.getByLabel(/visibility/i)
      if (await visibilityInput.isVisible().catch(() => false)) {
        await selectDropdownOption(authenticatedCoachPage, /visibility/i, SCHEDULE_DATA.visibility)
      }

      // Submit schedule
      await submitFormAndWaitForSuccess(
        authenticatedCoachPage,
        /schedule|create|save|submit/i,
        /created|success|scheduled/i,
      )
    })

    // ==================== PHASE 4: CLIENT BOOKS WORKSHOP ====================
    await test.step('Phase 4: Client books workshop', async () => {
      const goto = createNuxtGoto(authenticatedClientPage)
      const scheduleDetailPage = new ScheduleDetailPage(authenticatedClientPage, goto)
      const bookingStepper = new BookingStepperPage(authenticatedClientPage)

      // Navigate to the workshop schedule details
      await test.step('Client finds workshop schedule', async () => {
        await navigateToWorkshopScheduleDetails(authenticatedClientPage, goto, workshopTitle)
        await expect(scheduleDetailPage.bookButton.first()).toBeVisible({ timeout: timeouts.ui.elementVisible })
      })

      // Start booking flow
      await test.step('Client starts booking', async () => {
        await scheduleDetailPage.clickBookButton()
        await authenticatedClientPage.waitForURL(/\/(book|login)/, { timeout: timeouts.page.navigation })
      })

      // Fill booking details (address + seats)
      await test.step('Client fills booking details', async () => {
        // Fill address form
        await fillAddressForm(authenticatedClientPage, BOOKING_DATA)

        // Select number of seats if visible
        const seatsInput = authenticatedClientPage.getByLabel(/seats|number.*seats|quantity/i)
        if (await seatsInput.isVisible().catch(() => false)) {
          await seatsInput.fill(String(BOOKING_DATA.numberOfSeats))
        }

        // Continue to payment
        await bookingStepper.continueToPayment()
      })

      // Fill payment details
      await test.step('Client completes payment', async () => {
        await authenticatedClientPage.getByText(bookingContent.paymentSection.heading).waitFor({
          state: 'visible',
          timeout: timeouts.ui.elementVisible,
        })

        await fillStripePayment(authenticatedClientPage, PAYMENT_DATA.validCard)

        // Submit payment
        const payButton = authenticatedClientPage.getByRole('button', { name: /pay|confirm|submit|complete/i }).first()
        await payButton.click()
      })

      // Verify booking confirmation
      await test.step('Client verifies booking confirmation', async () => {
        await expect(bookingStepper.confirmationHeading).toBeVisible({
          timeout: timeouts.workflow.standard,
        })
        await expect(bookingStepper.bookingIdText).toBeVisible({
          timeout: timeouts.ui.elementVisible,
        })

        // Verify coach name appears on confirmation
        await expect(authenticatedClientPage.getByText(coaches.default.name).first()).toBeVisible({
          timeout: timeouts.ui.elementVisible,
        })
      })
    })
  })
})
