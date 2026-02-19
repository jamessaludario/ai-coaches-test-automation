import { timeouts, WORKSHOP_DATA } from '../constants'
import { cleanupAuthFile, test } from '../fixtures'
import {
  expectCalendarTabVisible,
  expectOverviewTabVisible,
  expectResourcesTabVisible,
  expectWorkshopCreated,
  expectWorkshopDetailPageLoaded,
  expectWorkshopInTable,
  expectWorkshopsPageLoaded,
} from '../helpers'
import { WorkshopsPage } from '../page-objects'
import { getTimestamp } from '../utils'

test.describe('Admin Workshops Page', () => {
  test.setTimeout(timeouts.workflow.extended)
  let workshopsPage: WorkshopsPage

  test.beforeEach(async ({ authenticatedAdminPage }) => {
    workshopsPage = new WorkshopsPage(authenticatedAdminPage)
    await workshopsPage.goto()
  })

  // eslint-disable-next-line no-empty-pattern
  test.afterAll(async ({ }, testInfo) => {
    await cleanupAuthFile('admin', testInfo.workerIndex)
  })

  test('display workshops page with data table', async ({ authenticatedAdminPage }) => {
    // Assert
    await expectWorkshopsPageLoaded(authenticatedAdminPage)
  })

  test('search for workshops in data table', async ({ authenticatedAdminPage }) => {
    // Arrange
    const searchQuery = 'Admin Test Workshop'

    // Act
    await workshopsPage.searchWorkshop(searchQuery)

    // Assert
    await expectWorkshopInTable(authenticatedAdminPage, searchQuery)
  })

  test('navigate to workshop detail page', async ({ authenticatedAdminPage }) => {
    // Act
    const workshopName = await workshopsPage.getFirstWorkshopCellText(1)

    if (!workshopName) {
      test.skip(true, 'No workshop data available in table - cannot test navigation')
      return
    }

    await workshopsPage.viewWorkshop(workshopName)

    // Assert
    await expectWorkshopDetailPageLoaded(authenticatedAdminPage, workshopName)
  })

  test('display and navigate to all workshop detail tabs', async ({ authenticatedAdminPage }) => {
    // Arrange
    const workshopName = await workshopsPage.getFirstWorkshopCellText(1)

    if (!workshopName) {
      test.skip(true, 'No workshop data available in table - cannot test tabs')
      return
    }

    await workshopsPage.viewWorkshop(workshopName)
    await expectWorkshopDetailPageLoaded(authenticatedAdminPage, workshopName)

    // Act & Assert
    await workshopsPage.clickOverviewTab()
    await expectOverviewTabVisible(authenticatedAdminPage)

    await workshopsPage.clickCalendarTab()
    await expectCalendarTabVisible(authenticatedAdminPage)

    await workshopsPage.clickResourcesTab()
    await expectResourcesTabVisible(authenticatedAdminPage)
  })

  // Create a new workshop
  test('create a new workshop', async ({ authenticatedAdminPage }) => {
    // Arrange - Use shared workshop data with unique timestamp
    const timestamp = getTimestamp()
    const workshopData = {
      ...WORKSHOP_DATA,
      title: `Admin Test Workshop - ${timestamp}`,
      description: `Admin test workshop description - ${timestamp}`,
    }

    // Act
    await workshopsPage.createWorkshop(workshopData)

    // Assert
    await expectWorkshopCreated(authenticatedAdminPage, workshopData.title)
  })
})
