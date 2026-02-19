import type { Page } from 'playwright'
import { timeouts } from '@layer-base/e2e/constants'
import { escapeRegExp } from '@layer-base/e2e/utils'
import { expect } from '@nuxt/test-utils/playwright'
import { defaultWorkshop, WORKSHOP_CARD_SELECTOR, workshopContent } from '../constants'
import { getVisibleCards, hasNoWorkshopsFound, waitForCardsToLoad } from './card-helpers'

export async function validateCardsContainText(
  page: Page,
  searchText: string,
  elementType: 'heading' | 'text',
  errorMessage: string,
  cardSelector = WORKSHOP_CARD_SELECTOR,
) {
  if (await hasNoWorkshopsFound(page)) {
    return
  }

  const searchRegex = escapeRegExp(searchText)

  await waitForCardsToLoad(page, cardSelector, timeouts.api.cardLoad)

  if (await hasNoWorkshopsFound(page)) {
    return
  }

  const visibleCards = await getVisibleCards(page, cardSelector)
  if (visibleCards.length === 0) {
    throw new Error(errorMessage)
  }

  for (const card of visibleCards) {
    const element = elementType === 'heading'
      ? card.getByRole('heading').filter({ hasText: searchRegex })
      : card.getByText(searchRegex)

    if (await element.count() === 0) {
      throw new Error(errorMessage)
    }
  }
}

export async function verifyWorkshopDetails(page: Page, workshopName: string = defaultWorkshop.name) {
  const [targetAudienceSection, whatYoullMasterSection, meetYourCoachSection] = workshopContent.schedule.sections
  const [targetAudienceBadge, learningOutcomesBadge, expertInstructorBadge] = workshopContent.schedule.badges

  await expect(page.getByRole('link', { name: workshopContent.schedule.bookButton })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByRole('button', { name: workshopContent.schedule.shareButton })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByRole('heading', { name: targetAudienceSection })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByRole('heading', { name: whatYoullMasterSection })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByRole('heading', { name: meetYourCoachSection })).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(workshopContent.schedule.spotText)).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(targetAudienceBadge)).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(learningOutcomesBadge)).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByText(expertInstructorBadge)).toBeVisible({ timeout: timeouts.ui.elementVisible })
  await expect(page.getByRole('heading', { name: workshopName })).toBeVisible({ timeout: timeouts.ui.elementVisible })
}

export async function validateCardsContainMode(
  page: Page,
  expectedMode: string,
  cardSelector = WORKSHOP_CARD_SELECTOR,
) {
  if (await hasNoWorkshopsFound(page))
    return

  await waitForCardsToLoad(page, cardSelector, timeouts.api.cardLoad)

  if (await hasNoWorkshopsFound(page))
    return

  const visibleCards = await getVisibleCards(page, cardSelector)
  if (visibleCards.length === 0)
    throw new Error('No cards found')

  const regex = new RegExp(escapeRegExp(expectedMode), 'i')
  for (const card of visibleCards) {
    if (await card.locator('span').filter({ hasText: regex }).count() === 0) {
      throw new Error(`Card does not contain the expected mode "${expectedMode}"`)
    }
  }
}
