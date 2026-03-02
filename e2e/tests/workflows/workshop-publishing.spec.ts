import { adminBaseUrl, bookingContent, coaches, pageRoutes, RESOURCE_DATA, timeouts, WORKSHOP_DATA, workshopContent, workshopRoutes } from '../../constants'
import { expect, test } from '../../fixtures'
import { createNuxtGoto } from '../../helpers'
import { escapeRegExp } from '../../helpers/date.helper'
import { WorkshopsCatalogPage } from '../../page-objects/marketing/workshops-catalog.page'

test.describe('Workshop Publishing Workflow', () => {
  test.setTimeout(timeouts.workflow.fullWorkflow)

  test.skip(true, 'Workshop publishing workflow pending migration')

  test('creates workshop and completes booking end-to-end', async ({ page, browser }) => {
    // TODO: Migrate from workshop-lifecycle.spec.ts
  })
})
