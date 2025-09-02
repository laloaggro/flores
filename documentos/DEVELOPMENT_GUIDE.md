# Flores Development Guide

## Overview

This guide provides detailed information about developing, testing, and deploying the Flores e-commerce application.

## Project Structure

```
flores/
├── backend/                 # Backend server files
├── frontend/                # Frontend application files
│   ├── assets/              # Static assets (CSS, JS, images)
│   ├── components/          # Reusable UI components
│   └── pages/               # Individual page templates
├── scripts/                 # Utility scripts
├── cypress/                 # End-to-end tests
├── frontend/__tests__/      # Unit and integration tests
├── dist/                    # Production build output
└── docs/                    # Documentation files
```

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/flores.git
cd flores
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Development Workflow

### Creating a New Feature

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit them:
```bash
git add .
git commit -m "Add your feature description"
```

3. Push your branch and create a pull request:
```bash
git push origin feature/your-feature-name
```

### Code Quality

Before committing, ensure your code passes all checks:

1. Run linters:
```bash
npm run lint:js    # JavaScript linting
npm run lint:css   # CSS linting
```

2. Run tests:
```bash
npm run test       # All tests
npm run test:unit  # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e   # End-to-end tests only
```

3. Fix any issues that arise from linting or testing.

### Building

To create a production build:

```bash
npm run build
```

This will generate optimized files in the `dist/` directory.

## Testing

### Unit Tests

Unit tests are written with Jest and can be found in `frontend/__tests__/unit/`.

Run unit tests:
```bash
npm run test:unit
```

Run unit tests in watch mode:
```bash
npm run test:watch
```

### Integration Tests

Integration tests are written with Jest and can be found in `frontend/__tests__/integration/`.

Run integration tests:
```bash
npm run test:integration
```

### End-to-End Tests

E2E tests are written with Cypress and can be found in `cypress/e2e/`.

Run E2E tests:
```bash
npm run test:e2e
```

Run E2E tests with UI:
```bash
npx cypress open
```

## Deployment

### Manual Deployment

To deploy manually to production:

```bash
npm run deploy:prod
```

### Continuous Integration

All pushes and pull requests automatically run tests through GitHub Actions. The configuration can be found in `.github/workflows/ci.yml`.

## Coding Standards

Please refer to our [Style Guide](STYLE_GUIDE.md) for detailed coding standards.

## API Documentation

For API endpoints and usage, see our [API Documentation](API_DOCUMENTATION.md).

## Troubleshooting

### Common Issues

1. **Tests failing due to missing dependencies**
   Solution: Run `npm install` to ensure all dependencies are installed.

2. **Build errors**
   Solution: Check that all files are properly formatted and there are no syntax errors.

3. **E2E tests failing**
   Solution: Ensure the development server is running (`npm run dev`) before running E2E tests.

### Getting Help

If you encounter issues not covered in this guide:

1. Check the project's issue tracker
2. Contact the development team
3. Refer to the documentation of specific tools (Jest, Cypress, etc.)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit a pull request

Please ensure your code follows our style guide and includes appropriate tests.