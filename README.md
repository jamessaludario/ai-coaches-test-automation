# AI Coaches Test Suite

This is a Playwright test suite for the AI Coaches application, organized in a monorepo structure.

## Prerequisites

- Node.js (v18 or higher)
- npm
- Running instances of the web and admin applications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install chromium
```

3. Configure environment variables:
   - Copy the appropriate `.env` file for each app
   - Ensure `NUXT_PUBLIC_WEB_BASE` and `NUXT_PUBLIC_ADMIN_BASE` point to running instances
   - Set up test user credentials for admin, coach, and client roles

## Project Structure

```
├── apps/
│   ├── admin/tests/e2e/         # Admin app E2E tests
│   └── web/tests/e2e/           # Web app E2E tests
│       ├── client/              # Client portal tests
│       ├── coach/               # Coach portal tests
│       └── marketing/           # Marketing pages tests
├── packages/
│   └── layer-base/app/tests/    # Shared test utilities
│       ├── e2e/                 # Shared E2E helpers, fixtures, page objects
│       └── lifecycles/          # Full lifecycle workflow tests
└── playwright.config.ts         # Main Playwright configuration
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests for specific projects
```bash
npm run test:web          # All web tests (client, coach, marketing)
npm run test:admin        # Admin app tests
npm run test:lifecycles   # Full lifecycle workflow tests
```

### Run tests in UI mode
```bash
npm run test:ui
```

### Run tests in headed mode (see browser)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### List all tests
```bash
npm run test:list
```

## Test Organization

### Projects
- **web-client**: Client portal tests
- **web-coach**: Coach portal tests  
- **web-marketing**: Marketing pages tests
- **admin**: Admin dashboard tests
- **lifecycles**: Full user workflow tests

### Test Types

#### E2E Tests (`apps/*/tests/e2e/`)
- Page-specific tests for individual features
- Component tests for isolated UI components
- Navigation and routing tests

#### Lifecycle Tests (`packages/layer-base/app/tests/lifecycles/`)
- End-to-end workflows spanning multiple pages
- Multi-user scenarios
- Full feature lifecycles (e.g., workshop creation → booking → completion)

### Shared Test Utilities (`packages/layer-base/app/tests/e2e/`)

#### Fixtures (`fixtures/`)
- `auth-fixtures.ts`: Pre-authenticated page contexts for different roles
- Usage: `test('...', async ({ authenticatedClientPage }) => { ... })`

#### Page Objects (`page-objects/`)
- Encapsulate page structure and interactions
- Reusable across tests
- Example: `LoginPage`, `DashboardPage`

#### Helpers (`helpers/`)
- `auth-helpers.ts`: Login functions for different roles
- `navigation-helpers.ts`: Common navigation patterns
- `form-helpers.ts`: Form filling and validation
- `assertions.ts`: Custom assertions for common checks

#### Constants (`constants/`)
- Test data (URLs, timeouts, expected content)
- Shared across test files

## Environment Variables

Required variables in `.env` files:

```bash
# Application URLs
NUXT_PUBLIC_WEB_BASE=http://localhost:3212
NUXT_PUBLIC_ADMIN_BASE=http://localhost:3213
NUXT_PUBLIC_APP_BASE=http://localhost:3214
NUXT_PUBLIC_API_BASE=http://localhost:3215

# Playwright Settings
PLAYWRIGHT_HEADLESS=true

# Test User Credentials
ADMIN_TEST_EMAIL='automationt700@gmail.com'
ADMIN_TEST_PASSWORD='password'
ADMIN_TEST_FULL_NAME='QA Tester'

COACH_TEST_EMAIL='automationt700@gmail.com'
COACH_TEST_PASSWORD='password'
COACH_TEST_FULL_NAME='QA Tester'

CLIENT_TEST_EMAIL='automationt700@gmail.com'
CLIENT_TEST_PASSWORD='password'
CLIENT_TEST_FULL_NAME='QA Tester'

# Test Data
TEST_BUNDLE_URL='https://dev.rea.pro/chat?bundle=66b71831-3472-4349-9578-00559b5c3684'
```

## Authentication

The test suite uses Playwright's [authentication storage](https://playwright.dev/docs/auth) to avoid logging in before every test:

1. First test run creates auth state files in `packages/layer-base/app/tests/.auth/`
2. Subsequent tests reuse stored authentication
3. Each worker thread gets its own auth file to prevent conflicts

Auth files are automatically cleaned up when needed and should not be committed to version control.

## Configuration

### Playwright Config (`playwright.config.ts`)

Key features:
- Multi-project setup for different app areas
- Automatic environment variable loading per project
- Chromium browser testing
- Video and screenshot capture on failures
- Configurable headless/headed mode

### TypeScript Config (`tsconfig.json`)

- ES2022 target with ESNext modules
- Path aliases for cleaner imports:
  - `@e2e-web/*` → web test files
  - `@layer-base/e2e/*` → shared test utilities

## CI/CD Integration

The test suite is CI-ready:
- Retries on failure (2 retries in CI, 1 locally)
- Stops on first failure in CI
- Exports videos and screenshots for debugging

## Troubleshooting

### Tests fail with "Missing required environment variable"
- Ensure `.env` files exist in `apps/web/` and `apps/admin/`
- Verify environment variables are set correctly

### Tests fail with "Navigation timeout"
- Ensure the web/admin applications are running
- Check that the URLs in `.env` are correct and accessible

### Auth state errors
- Delete files in `packages/layer-base/app/tests/.auth/`
- Re-run tests to regenerate auth state

### Import errors
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript paths in `tsconfig.json` are correct

## Best Practices

1. **Use Page Objects**: Encapsulate page interactions in page object classes
2. **Share Fixtures**: Use authenticated page fixtures for tests requiring login
3. **Avoid Hardcoded Waits**: Use Playwright's auto-waiting features
4. **Test Isolation**: Each test should be independent and able to run alone
5. **Meaningful Names**: Use descriptive test names that explain what's being tested
6. **Constants for Data**: Store test data in constants files
7. **Helper Functions**: Extract common operations into helper functions

## Contributing

When adding new tests:

1. Follow the existing structure (page-objects, helpers, fixtures)
2. Add shared utilities to `packages/layer-base/app/tests/e2e/`
3. Keep app-specific tests in respective `apps/*/tests/e2e/` folders
4. Update constants when adding new test data
5. Document any new patterns or helpers

## Resources

- [Playwright Documentation](https://playwright.dev)
- [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing)
