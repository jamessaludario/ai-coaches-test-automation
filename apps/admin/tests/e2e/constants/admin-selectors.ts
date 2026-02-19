import { getMonthYear } from '../utils'

const sharedForms = {
  email: /Email/i,
  firstName: /First Name/i,
  lastName: /Last Name/i,
  username: /Username/i,
  password: /Password/i,
}

export const adminSelectors = {
  // Sidebar navigation
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

  // Common buttons
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

  // Dashboard
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

  // Data table common elements
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

  // Form fields common
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

  // Users page
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

  // Workshops page
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

  // Workshop Schedules page
  workshopSchedules: {
    heading: /Workshop Schedules/i,
    addButton: /New/i,
    tabs: {
      overview: /Overview/i,
      bookings: /Bookings/i,
      resources: /Resources/i,
    },
  },

  // Bookings page
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

  // Vouchers page
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

  // Roles page
  roles: {
    heading: /Roles/i,
    addButton: /New/i,
    formFields: {
      roleName: /Name/i,
      permissions: /Permissions/i,
      description: /Description/i,
    },
  },

  // Alerts and notifications
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

  // Modals and dialogs
  dialogs: {
    confirmDelete: /Are you sure|Confirm Delete/i,
    createUserFormDialog: /Create.*User/i,
    formDialog: /Create.*User|Edit.*User|Add.*User/i,
    voucherFormDialog: /Create.*Voucher|Add.*Voucher/i,
    closeButton: /Close|Cancel/i,
  },
} as const
