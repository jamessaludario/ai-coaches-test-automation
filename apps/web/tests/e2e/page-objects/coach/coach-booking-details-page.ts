import { BasePage } from '../../page-objects'

/**
 * Coach Booking Details Page Object
 *
 * Handles booking details page interactions for coaches.
 * For assertions, use helpers from `helpers/coach-assertions.ts`
 */
export class CoachBookingDetailsPage extends BasePage {
  get detailsTab() {
    return this.page.getByRole('tab', { name: /details/i })
  }

  get paymentsTab() {
    return this.page.getByRole('tab', { name: /payments/i })
  }

  get resourcesTab() {
    return this.page.getByRole('tab', { name: /resources/i })
  }

  get seatsTab() {
    return this.page.getByRole('tab', { name: /seats/i })
  }

  get bookingIdText() {
    return this.page.getByText(/booking.*id/i)
  }

  get workshopTitle() {
    return this.page.getByRole('heading', { level: 1 })
  }

  get bookingStatus() {
    return this.page.locator('[data-slot="badge"]', { hasText: /confirmed|pending|cancelled/i })
  }

  get paymentSummary() {
    return this.page.getByText(/payment.*summary|total.*amount/i)
  }

  get clientName() {
    return this.page.getByText(/booking.*owner|client/i).first()
  }

  get scheduleInfo() {
    return this.page.getByText(/schedule|date|time/i).first()
  }

  get customerNotes() {
    return this.page.getByText(/customer.*notes/i)
  }

  get coachNotes() {
    return this.page.getByText(/coach.*notes/i)
  }

  get bookingTimeline() {
    return this.page.getByText(/timeline|created/i)
  }

  async navigateToBooking(bookingId: string) {
    await this.page.goto(`/c/bookings/${bookingId}`)
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToDetails() {
    await this.detailsTab.click()
  }

  async navigateToPayments() {
    await this.paymentsTab.click()
    await this.page.waitForURL(/\/payments$/, { timeout: 10000 })
  }

  async navigateToResources() {
    await this.resourcesTab.click()
    await this.page.waitForURL(/\/resources$/, { timeout: 10000 })
  }

  async navigateToSeats() {
    await this.seatsTab.click()
    await this.page.waitForURL(/\/seats$/, { timeout: 10000 })
  }
}
