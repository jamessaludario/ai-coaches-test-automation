import { getMonthYear } from '../helpers/date.helper'

/**
 * Admin UI Selectors
 */

const sharedForms = {
  email: /Email/i,
  firstName: /First Name/i,
  lastName: /Last Name/i,
  username: /Username/i,
  password: /Password/i,
}

export const adminSelectors = {
  sidebar: {
    dashboard: /Dashboard/i,
    users: /Users/i,
    groups: /Groups/i,
    workshops: /^Workshops$/i,
    workshopSchedules: /Workshop Schedules/i,
    bookings: /Bookings/i,
    vouchers: /Vouchers/i,
    roles: /Roles & Permissions/i,
  },
  buttons: {
    addNewUser: /Add New User/i,
    create: /Create/i,
    edit: /Edit/i,
    delete: /Delete/i,
    save: /Save/i,
    saveAsDraft: /Save as Draft/i,
    createVoucher: /Create.*Voucher/i,
    cancel: /Cancel/i,
    close: /Close/i,
    new: /New/i,
    submit: /Submit/i,
    confirm: /Confirm/i,
    continue: /Continue/i,
    back: /Back/i,
    generatePassword: /Generate/i,
  },
  dashboard: {
    heading: /Dashboard/i,
    welcomeMessage: /Welcome back/i,
    metrics: {
      totalUsers: /Total Users/i,
      totalRevenue: /Total Revenue/i,
      activeBookings: /Active Bookings/i,
      activeWorkshops: /Active Workshops/i,
      conversionRate: /Conversion Rate/i,
      attendanceRate: /Attendance Rate/i,
      upcomingSessions: /Upcoming Sessions/i,
      pendingRevenue: /Pending Revenue/i,
    },
    calendar: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  },
  dataTable: {
    searchInput: /Search/i,
    filterButton: /Filter/i,
    sortButton: /Sort/i,
    actionsButton: /Actions/i,
    viewButton: /View/i,
    editButton: /Edit/i,
    deleteButton: /Delete/i,
    pagination: {
      previous: /Previous/i,
      next: /Next/i,
      first: /First/i,
      last: /Last/i,
    },
  },
  forms: {
    displayName: /Display Name/i,
    name: /Name/i,
    ...sharedForms,
    confirmPassword: /Confirm Password/i,
    phoneNumber: /Phone Number/i,
    country: /Country/i,
    headline: /Headline/i,
    bio: /Bio/i,
  },
  formsLabelMap: {
    ...sharedForms,
  },
  users: {
    heading: /Users/i,
    createButton: /New/i,
    dataTable: /Users Table|table/i,
    tabs: {
      details: /Details/i,
      coachProfile: /Coach Profile/i,
      workshops: /Workshops/i,
      payouts: /Payouts/i,
      edit: /Edit/i,
    },
  },
  workshops: {
    heading: /Workshops/i,
    addButton: /New/i,
    tabs: {
      overview: /Overview/i,
      calendar: /Calendar/i,
      resources: /Resources/i,
    },
    get tabHeadings() {
      return {
        overview: /Workshop Overview/i,
        calendar: new RegExp(getMonthYear(), 'i'),
        resources: /Workshop Resources/i,
      }
    },
  },
  workshopSchedules: {
    heading: /Workshop Schedules/i,
    addButton: /New/i,
    tabs: {
      overview: /Overview/i,
      bookings: /Bookings/i,
      resources: /Resources/i,
    },
  },
  bookings: {
    heading: /Bookings/i,
    addButton: /New/i,
    detailHeading: 'Booking ID:',
    tabs: {
      details: /Details/i,
      seats: /Seats/i,
      payments: /Payments/i,
    },
    headings: {
      seats: /Booking Seats/i,
      payments: /Payment Overview/i,
    },
  },
  vouchers: {
    heading: /Vouchers/i,
    addButton: /New/i,
    formDialog: {
      code: /Code/i,
      discountType: /Discount Type/i,
      discountAmount: /Discount Amount/i,
      discountPercentage: /Discount Percentage/i,
      expiresAt: /Expires At/i,
      maxUses: /Max Uses/i,
    },
    labels: {
      discountPercentage: /Discount Percentage/i,
      discountAmount: /Discount Amount/i,
    },
  },
  voucherDiscountTypes: {
    percentage: /Percentage/i,
    fixed: /Fixed Amount/i,
    free: /Free \(100% off\)/i,
  },
  roles: {
    heading: /Roles/i,
    addButton: /New/i,
    formFields: {
      roleName: /Name/i,
      permissions: /Permissions/i,
      description: /Description/i,
    },
  },
  notifications: {
    voucherCreated: /Voucher Created/i,
    voucherDeleted: /Voucher Deleted/i,
    userCreated: /User Created/i,
    userUpdated: /User.*Updated|Update.*successful/i,
    success: /Success|Created|Updated|Deleted/i,
    error: /Error|Failed/i,
    warning: /Warning/i,
    info: /Info/i,
    required: /Required/i,
    noResults: /No.*found|No results/i,
  },
  dialogs: {
    confirmDelete: /Are you sure|Confirm Delete/i,
    createUserFormDialog: /Create.*User/i,
    formDialog: /Create.*User|Edit.*User|Add.*User/i,
    voucherFormDialog: /Create.*Voucher|Add.*Voucher/i,
    closeButton: /Close|Cancel/i,
  },
} as const

/**
 * Shared admin selectors for cross-app workflows
 */
export const sharedAdminSelectors = {
  users: {
    heading: /Users/i,
    createButton: /New/i,
    tabs: {
      details: /Details/i,
      coachProfile: /Coach Profile/i,
      workshops: /Workshops/i,
      payouts: /Payouts/i,
      edit: /Edit/i,
    },
  },
  buttons: {
    save: /Save/i,
    submit: /Submit/i,
    continue: /Continue/i,
    cancel: /Cancel/i,
    confirm: /Confirm/i,
    generatePassword: /Generate/i,
  },
  forms: {
    firstName: /First Name/i,
    lastName: /Last Name/i,
    email: /Email/i,
    username: /Username/i,
    password: /Password/i,
    bio: /Bio/i,
    headline: /Headline/i,
  },
  notifications: {
    userCreated: /User Created/i,
    userUpdated: /User (Updated|Saved)|Profile updated/i,
  },
  dataTable: {
    searchInput: /Search/i,
  },
} as const

/**
 * Marketing page content selectors
 */
export const homePageContent = {
  hero: {
    mainHeading: /World's #1/i,
    tagline: 'Upskill, Accelerate, Outpace',
    badges: ['Workshops', 'Coaching', 'Consulting'],
    workshopTitle: /AI MASTERY FOR BUSINESS/i,
    workshopSubtitle: /One-Day Hands-On Workshop/i,
  },
  hostedBy: {
    text: /Hosted by Certified AI Coaches/i,
    poweredBy: /Powered By:/i,
  },
  workshopRequirements: [
    /Minimum \d+ Attendees/i,
    /Attendees must bring laptops/i,
    /Room must have a large screen for the presenter/i,
    /Internet Access/i,
  ],
  homepageSections: {
    gameChanger: {
      heading: /Why This Workshop is a Game-Changer/i,
      text: /not another AI.*talking head.*event/i,
      text2: /full-day interactive/i,
    },
    whatYoullMaster: {
      heading: /Here['\u2019]s What You['\u2019]ll Master/i,
      pillars: [
        { name: 'Marketing', value: /Save.*\$20,000/i },
        { name: 'Sales', value: /Lift close rates/i },
        { name: 'Customer Service', value: /Reduce ticket resolution time by 70%/i },
        { name: 'Operations', value: /Create clarity and scale/i },
        { name: 'Talent & HR', value: /Cut time-to-hire in half/i },
        { name: 'Finance', value: /Make smarter decisions/i },
      ],
      aicommandRoom: {
        heading: /AI Command Room/i,
        text: /convert every idea or challenge/i,
      },
    },
    whoShouldAttend: {
      heading: /Who Should Attend/i,
      numberOfEmployees: /50 to 2,000 employees/i,
      benefits: [
        { name: 'Scale without burning out', value: /Scale without burning out their teams/i },
        { name: 'Future-proof their operations', value: /Future-proof their operations/i },
        { name: 'Drive real business outcomes', value: /Drive real business outcomes with AI/i },
        { name: 'hands-on experience', value: /Get hands-on experience building AI systems—no code required/i },
      ],
    },
    secureYourWorkshopDate: {
      heading: /Secure Your.*Workshop Date/i,
      text: /Dates are limited due to demand./i,
    },
    workshopOutcomes: {
      outcomes: [
        { name: 'Real AI agents built for your business', value: /Real AI agents built for your business/i },
        { name: 'Tools you can use again and again', value: /Tools you can use again and again/i },
        { name: 'A system to identify new AI opportunities', value: /A system to identify new AI opportunities/i },
        { name: 'Confidence to lead AI transformation in-house', value: /Confidence to lead AI transformation in-house/i },
      ],
    },
  },
  valueProps: {
    mainMessage: /What if your business could scale output/i,
    deliveryInfo: /Delivered In-House at your Company or selected location/i,
    coachInfo: /Run by Certified AI Coaches/i,
    sections: [
      /Why This Workshop is a Game-Changer/i,
      /Here['\u2019]s What You['\u2019]ll Master/i,
      /Who Should Attend/i,
      /Secure Your.*Workshop Date/i,
    ],
  },
  navigation: {
    findCoaches: { text: /Find AI Coaches/i, url: /consultants/ },
    workshops: { text: /Explore AI Workshops/i, url: /workshops/ },
    contact: { text: /Contact an AI Coach/i },
  },
  legal: [
    { name: 'Terms of Use', heading: /^Terms and Conditions/ },
    { name: 'Privacy', heading: /^Privacy Policy/ },
  ],
} as const

export const coachProfileContent = {
  sections: [
    'Experience',
    'Certifications',
    'AI Schedules',
  ],
} as const

export const DEFAULT_COUNTRY = 'Philippines'

export const consultantPageContent = {
  namePlaceholder: /Search coach or consultant/i,
  locationPlaceholder: /Anywhere/i,
  coachListHeading: /Available Coaches/i,
} as const

export const dashboardContent = {
  coach: {
    heading: /Dashboard/i,
    welcomeMessage: /Dashboard|Welcome/i,
    metrics: [
      /Total Workshops/i,
      /Upcoming Sessions?/i,
      /Total Revenue/i,
      /Clients Taught/i,
      /Completed Sessions/i,
      /Pending Bookings/i,
    ],
    sections: {
      upcomingSessions: /Upcoming.*Sessions?/i,
      recentBookings: /Recent.*Bookings?/i,
    },
    accountProfileSections: {
      introductionVideo: /Introduction Video/i,
      avatar: /Avatar/i,
      displayName: /Display Name/i,
      headline: /Headline/i,
      bio: /Bio/i,
      certifications: /Certifications/i,
      experience: /Experience/i,
      specializations: /Specializations/i,
      socialPlatforms: /Social Platforms/i,
      username: /Username/i,
      email: /Email/i,
      phoneNumber: /Phone Number/i,
      country: /Country/i,
    },
    emptyStates: {
      noSessions: /No upcoming sessions|Schedule.*workshop/i,
      noBookings: /No bookings|No recent bookings/i,
    },
    navigation: {
      workshops: { text: 'Workshops', url: /\/c\/workshops/ },
      bookings: { text: 'Bookings', url: /\/c\/bookings/ },
      account: { text: 'Profile', url: /\/c\/account\/profile/ },
    },
  },
  client: {
    heading: 'Dashboard',
    welcomeMessage: /Welcome back/i,
    metrics: [
      /Upcoming.*Sessions?/i,
      /Completed.*Workshops?/i,
      /Total.*Bookings?/i,
      /Total.*Invested/i,
    ],
    workshopMetrics: [
      /my.*bookings/i,
      /available.*sessions/i,
      /total.*spent/i,
      /sessions.*completed/i,
    ],
    elements: [
      /Upcoming.*Sessions?/i,
      /Bookings?/i,
      /Workshops?/i,
    ],
    navigation: {
      workshops: { text: 'Workshops', url: /\/b\/workshops/ },
      bookings: { text: 'Bookings', url: /\/b\/bookings/ },
    },
  },
} as const

export const legalContent = {
  pages: [
    {
      path: '/b/privacy-policy',
      name: 'Client Privacy Policy',
      heading: /Privacy Policy \(For Clients\)/i,
      keywords: ['information', 'data', 'privacy', 'personal'],
      homepageLinkName: 'Privacy',
      role: 'client',
    },
    {
      path: '/b/terms-and-conditions',
      name: 'Client Terms',
      heading: /Terms and Conditions/i,
      keywords: ['terms', 'agreement', 'service', 'conditions'],
      homepageLinkName: 'Terms of Use',
      role: 'client',
    },
    {
      path: '/c/privacy-policy',
      name: 'Coach Privacy Policy',
      heading: /Privacy Policy \(For Coaches\)/i,
      keywords: ['information', 'data', 'privacy', 'personal'],
      homepageLinkName: 'Privacy',
      role: 'coach',
    },
    {
      path: '/c/terms-and-conditions',
      name: 'Coach Terms',
      heading: /Terms and Conditions/i,
      keywords: ['terms', 'agreement', 'service', 'conditions'],
      homepageLinkName: 'Terms of Use',
      role: 'coach',
    },
  ],
} as const

/**
 * Coach profile lifecycle constants
 */
export const coachProfileLifecycleConstants = {
  routes: {
    coachDashboard: /\/c/,
    clientDashboard: /\/b/,
    coachProfile: '/c/account/profile',
    onboarding: /\/onboarding\/2/,
  },
  onboarding: {
    heading: /complete.*account/i,
    countryOption: 'Philippines',
    termsCheckbox: /agree.*Privacy Policy.*Terms of Use/i,
    submitButton: /continue|submit|complete/i,
  },
  adminApproval: {
    statusPending: /Pending/i,
    statusCompleted: /Completed/i,
  },
  profile: {
    labels: {
      username: /Username/i,
      firstName: /First Name/i,
      lastName: /Last Name/i,
      country: /Country/i,
      phoneNumber: /Phone Number/i,
      headline: /Headline/i,
      bio: /Bio/i,
    },
    sections: {
      headline: /Headline/i,
      bio: /Bio/i,
      certifications: /Certifications/i,
      experience: /Experience/i,
      specializations: /Specializations/i,
      socialAccounts: /Social Platforms/i,
    },
    buttons: {
      addCertification: /add.*certification/i,
      addExperience: /add.*experience/i,
      addSocial: /add.*social/i,
    },
  },
  sampleData: {
    headline: 'Senior AI Consultant & Coach',
    bio: 'I help businesses implement AI agents and automated workflows.',
    adminBio: 'Approved after verification of credentials.',
    certification: {
      title: 'Certified AI Specialist',
      organization: 'AI Institute',
      date: '2023-01-01',
      url: 'https://example.com/cert',
    },
    experience: {
      title: 'Lead AI Engineer',
      company: 'Tech Solutions',
      years: '5',
      months: '6',
    },
    specializations: ['AI', 'Business', 'Marketing'],
    socialAccount: {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/testcoach',
    },
  },
  profileSwitches: [
    'Completed Business Consultant Accelerator',
    'Completed Video Resources',
    'Completed Live Call',
    'Completed Quizzes',
  ],
} as const
