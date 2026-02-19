import process from 'node:process'

export interface WorkshopData {
  name: string
  description: string
  mode: 'Online' | 'In-Person' | 'Hybrid'
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
}

export interface ScheduleData {
  startDate: Date
  endDate: Date
  startTime?: string
  endTime?: string
  country?: string
  visibility?: 'Public' | 'Private' | 'Unlisted'
  mode?: 'Online' | 'In-Person' | 'Hybrid'
  level?: 'Beginner' | 'Intermediate' | 'Advanced'
  status?: 'Published' | 'Draft' | 'Active'
}

export interface AddressData {
  unitNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zip: string

}
export interface ScheduleReference {
  date: string
  time: string
  mode?: string
  level?: string
}

export const workshopModes = [
  {
    name: 'Online',
    textLocator: 'online',
  },
  {
    name: 'In-Person',
    textLocator: 'in-person',
  },
  {
    name: 'Hybrid',
    textLocator: 'hybrid',
  },
] as const

export const workshopDateFilters = [
  {
    name: 'Today',
    filterKey: 'today',
  },
  {
    name: 'This Week',
    filterKey: 'week',
  },
  {
    name: 'This Month',
    filterKey: 'month',
  },
] as const

const baseWorkshopData = {
  name: process.env.TEST_WORKSHOP_NAME || 'AI Agent Mastery for Sales',
  description: 'Equip sales teams with AI tools to automate prospecting and improve forecasting.',
  level: 'Beginner' as const,
  price: 189,
}

export const defaultWorkshop: WorkshopData = {
  ...baseWorkshopData,
  mode: 'Online',
}

export const workshops = {
  online: {
    ...baseWorkshopData,
    mode: 'Online' as const,
    textLocator: 'online',
  },

  inPerson: {
    ...baseWorkshopData,
    mode: 'In-Person' as const,
    textLocator: 'in-person',
  },

  hybrid: {
    ...baseWorkshopData,
    mode: 'Hybrid' as const,
    textLocator: 'hybrid',
  },
} as const

export const schedules = {
  immediate: {
    daysFromNow: 1,
    duration: 1,
    mode: 'Online',
    level: 'Beginner',
    status: 'Published',
  },

  nextWeek: {
    daysFromNow: 7,
    duration: 1,
    mode: 'In-Person',
    level: 'Intermediate',
    status: 'Published',
  },

  nextMonth: {
    daysFromNow: 30,
    duration: 1,
    mode: 'Hybrid',
    level: 'Advanced',
    status: 'Published',
  },
} as const

export const defaultAddress: AddressData = {
  unitNumber: '10',
  addressLine1: '123 Main St',
  addressLine2: 'Apt 4B',
  city: 'Cebu City',
  state: 'Cebu',
  zip: '6000',
}

export const addresses = {
  philippines: {
    unitNumber: '10',
    addressLine1: '123 Ayala Ave',
    addressLine2: 'Unit 5A',
    city: 'Makati',
    state: 'Metro Manila',
    zip: '1200',
  },

  usa: {
    unitNumber: '500',
    addressLine1: '123 Market Street',
    addressLine2: 'Suite 200',
    city: 'San Francisco',
    state: 'California',
    zip: '94103',
  },
} as const

export const paymentData = {
  validCard: {
    number: '4242 4242 4242 4242',
    expiry: '12/34',
    cvc: '999',
  },

  declinedCard: {
    number: '4000 0000 0000 0002',
    expiry: '12/34',
    cvc: '999',
  },
} as const

export const coaches = {
  default: {
    name: process.env.TEST_COACH_NAME || 'QA Tester',
    location: 'Philippines',
  },
} as const

export const workshopScheduleContent = {
  workshopSearchPlaceholder: /AI Workshop \(e.g. How To/i,
  workshopListHeading: /AI Workshops/i,
  workshopLocationPlaceholder: /Anywhere/i,
  learnMoreButton: /Learn more/i,
  noWorkshopsFound: 'No workshops found.',
} as const

export const workshopContent = {
  details: {
    bookButton: 'Book for your Business',
    bookNowButton: 'Book Now',
    shareButton: 'Share Workshop',
    backButton: 'Back to Workshops',
    browseSchedules: 'Browse All Schedules',
    priceText: '$',
    sections: [
      'Who is this workshop for?',
      'What You\'ll Master',
      'Available Schedules',
    ],
  },

  schedule: {
    bookButton: 'Book for your Business',
    shareButton: 'Share Workshop',
    spotText: 'Spots Available',
    sections: [
      'Who is this workshop for?',
      'What You\'ll Master',
      'Meet Your AI Coach',
    ],
    badges: ['Target Audience', 'Learning Outcomes', 'Expert Instructor'],
  },
} as const

export const bookingContent = {
  steps: [
    'You are booking for workshop:',
    'Review & Select Seats',
    'Payment Details',
    'Booking Confirmation',
  ],

  reviewSection: [
    'Schedule',
    'Location',
    'Select Seats',
    'Promo Code',
    'Booking Summary',
    'Total Amount',
  ],

  buttons: {
    continueToPayment: 'Continue to Payment',
    previousStep: 'Previous',
    manageBooking: 'Manage Booking',
    downloadInvoice: 'Download Invoice',
  },

  paymentSection: {
    heading: 'Payment Information',
    summary: 'Order Summary',
  },

  confirmation: {
    heading: 'Booking confirmed',
    paymentStatus: /^Payment (received|complete)$/i,
    bookingId: /ID: \d+/i,
    manageButton: 'Manage Booking',
    downloadButton: 'Download Invoice',
  },
} as const

export const exploreWorkshopsContent = {
  searchPlaceholder: /Search workshops/i,
  workshopListHeading: /Available Workshops/i,
} as const

export const SCHEDULE_EVENT_SELECTOR = '.hover-card-trigger'
export const WORKSHOP_CARD_SELECTOR = '.card.relative, .card'
