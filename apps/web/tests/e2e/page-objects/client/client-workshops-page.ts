import { userRoutes } from '../../constants'
import { nuxtGoto } from '../../helpers'
import { BasePage } from '@layer-base/e2e/page-objects'

/**
 * Client Workshops Page Object
 *
 * Handles client workshops page interactions.
 * For assertions, use helpers from `helpers/client-assertions.ts`
 */
export class ClientWorkshopsPage extends BasePage {
  get heading() {
    return this.page.getByRole('heading', { name: /Workshops/i })
  }

  get searchInput() {
    return this.page.getByRole('textbox', { name: /Search/i }).first()
  }

  get dataTable() {
    return this.page.getByRole('table')
  }

  get emptyState() {
    return this.page.getByText(/No workshops|No results/i)
  }

  async goto() {
    await nuxtGoto(this.page, userRoutes.client.workshops)
  }

  async searchWorkshops(query: string) {
    await this.searchInput.fill(query)
    await this.searchInput.press('Enter')
  }
}
