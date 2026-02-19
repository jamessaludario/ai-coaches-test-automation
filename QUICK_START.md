# Quick Start Guide

## Prerequisites Check

Before running tests, ensure:
- [ ] Node.js is installed (v18+)
- [ ] Web app is running at `http://localhost:3212`
- [ ] Admin app is running at `http://localhost:3213`
- [ ] Test user accounts are set up

## Setup (One-time)

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Projects

**Web Tests** (Client + Coach + Marketing)
```bash
npm run test:web
```

**Admin Tests**
```bash
npm run test:admin
```

**Lifecycle Tests** (Full workflows)
```bash
npm run test:lifecycles
```

### Interactive Testing

**UI Mode** (Recommended for debugging)
```bash
npm run test:ui
```

**Headed Mode** (See browser window)
```bash
npm run test:headed
```

**Debug Mode** (Step through tests)
```bash
npm run test:debug
```

### List Tests Without Running

```bash
npm run test:list
```

## Test Breakdown

| Project | Tests | Description |
|---------|-------|-------------|
| web-marketing | 41 tests | Marketing pages, home, consultants, etc. |
| admin | 54 tests | Admin dashboard, users, bookings, etc. |
| web-client | 13 tests | Client portal tests |
| web-coach | 17 tests | Coach portal tests |
| lifecycles | 2 tests | Full user workflow tests |
| **TOTAL** | **127 tests** | Across 31 test files |

## Common Commands

```bash
# List all available tests
npm run test:list

# Run specific test file
npx playwright test apps/web/tests/e2e/marketing/pages/home.spec.ts

# Run tests matching pattern
npx playwright test --grep "dashboard"

# Run tests in specific project
npx playwright test --project=web-marketing

# Run in headed mode for single project
PLAYWRIGHT_HEADLESS=false npx playwright test --project=admin

# Generate HTML report
npx playwright show-report
```

## Troubleshooting

### Tests fail immediately
- Check if web/admin apps are running
- Verify URLs in `.env` files match running apps
- Ensure test user credentials are valid

### "Missing required environment variable"
- Check `.env` files exist:
  - `apps/web/.env`
  - `apps/admin/.env`
- Verify all required variables are set

### "Navigation timeout"
- Ensure the target application is running
- Check if the URLs in `.env` are accessible
- Verify network connectivity

### Auth errors
- Delete auth state files: `rm -rf packages/layer-base/app/tests/.auth/`
- Re-run tests to regenerate auth state

### Browser not found
- Run: `npx playwright install chromium`

## Environment Variables Reference

Required in both `apps/web/.env` and `apps/admin/.env`:

```bash
# Application URLs
NUXT_PUBLIC_WEB_BASE=http://localhost:3212
NUXT_PUBLIC_ADMIN_BASE=http://localhost:3213

# Test Configuration
PLAYWRIGHT_HEADLESS=true

# Test Users (must exist in your database)
ADMIN_TEST_EMAIL='automationt700@gmail.com'
ADMIN_TEST_PASSWORD='password'

COACH_TEST_EMAIL='automationt700@gmail.com'
COACH_TEST_PASSWORD='password'

CLIENT_TEST_EMAIL='automationt700@gmail.com'
CLIENT_TEST_PASSWORD='password'
```

## Project Structure

```
├── apps/
│   ├── admin/tests/e2e/         # Admin tests (54 tests)
│   └── web/tests/e2e/
│       ├── client/              # Client portal (13 tests)
│       ├── coach/               # Coach portal (17 tests)
│       └── marketing/           # Marketing pages (41 tests)
├── packages/
│   └── layer-base/app/tests/
│       ├── e2e/                 # Shared test utilities
│       └── lifecycles/          # Workflow tests (2 tests)
└── playwright.config.ts         # Test configuration
```

## Tips

1. **Use UI Mode** for development: `npm run test:ui`
2. **Run specific project** to save time during development
3. **Check test list** before running: `npm run test:list`
4. **Headed mode** helps debug visual issues: `npm run test:headed`
5. **Test isolation**: Each test should work independently

## Next Steps

1. Verify apps are running
2. Run `npm run test:list` to see all available tests
3. Start with a small test: `npx playwright test apps/web/tests/e2e/marketing/pages/home.spec.ts`
4. Use `npm run test:ui` for interactive testing

## Need Help?

- See [README.md](./README.md) for detailed documentation
- See [MIGRATION.md](./MIGRATION.md) for migration details
- Check Playwright docs: https://playwright.dev
