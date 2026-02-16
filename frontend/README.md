# Frontend — Django-React

A React-based frontend for the Django-React full-stack application. It provides user registration with email verification, login, and a simple home page, all styled with Bootstrap and tested thoroughly with React Testing Library and MSW.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
  - [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Routing](#routing)
- [Pages & Components](#pages--components)
  - [Header](#header)
  - [Footer](#footer)
  - [HomePage](#homepage)
  - [LoginPage](#loginpage)
  - [RegisterPage](#registerpage)
  - [VerificationPage](#verificationpage)
- [Utilities](#utilities)
  - [checkEmail](#checkemail)
  - [checkPassword](#checkpassword)
- [API Integration](#api-integration)
  - [Backend URL Configuration](#backend-url-configuration)
  - [Endpoints](#endpoints)
- [Testing](#testing)
  - [Test Setup](#test-setup)
  - [Running Tests](#running-tests)
  - [Test Suites](#test-suites)
- [Available Scripts](#available-scripts)
- [Browser Support](#browser-support)

---

## Tech Stack

| Category        | Technology                                                      |
| --------------- | --------------------------------------------------------------- |
| Framework       | [React 19](https://react.dev/)                                  |
| Routing         | [React Router DOM 6](https://reactrouter.com/)                  |
| UI Library      | [React Bootstrap 2](https://react-bootstrap.github.io/) + Bootstrap 5 |
| Icons           | [Font Awesome](https://fontawesome.com/) (via `@fortawesome/react-fontawesome`) |
| HTTP Client     | [Axios](https://axios-http.com/)                                |
| Auth Utilities  | [jwt-decode](https://github.com/auth0/jwt-decode), [jwt-encode](https://github.com/niceg1/jwt-encode) |
| Testing         | [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [jest-dom](https://github.com/testing-library/jest-dom) |
| API Mocking     | [MSW (Mock Service Worker) 1.x](https://mswjs.io/)             |
| Build Tool      | [Create React App](https://create-react-app.dev/)               |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **npm** ≥ 8

### Installation

```bash
cd frontend
npm install
```

### Running the App

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000). The page reloads on edits.

### Building for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` directory.

---

## Project Structure

```
frontend/
├── public/
│   ├── index.html              # HTML template
│   ├── manifest.json           # PWA manifest
│   └── robots.txt              # Crawler directives
├── src/
│   ├── App.js                  # Root component with routing
│   ├── App.css                 # Global styles
│   ├── index.js                # Application entry point
│   ├── index.css               # Base CSS
│   ├── reportWebVitals.js      # Performance metrics
│   ├── setupTests.js           # Global test setup (jest-dom + MSW)
│   ├── components/
│   │   ├── Header.jsx          # Navigation bar
│   │   └── Footer.jsx          # Copyright footer
│   ├── constants/
│   │   └── urls.js             # API endpoint constants
│   ├── mocks/
│   │   └── server.js           # MSW mock server & handlers
│   ├── pages/
│   │   ├── HomePage/
│   │   │   └── HomePage.jsx
│   │   ├── LoginPage/
│   │   │   └── LoginPage.jsx
│   │   ├── RegisterPage/
│   │   │   ├── RegisterPage.jsx
│   │   │   └── tests/
│   │   │       ├── RegisterationPagePasswordComplexity.test.jsx
│   │   │       ├── RegistrationPageEmail.test.jsx
│   │   │       ├── RegistrationPageErrore.test.jsx
│   │   │       ├── RegistrationPageLoading.test.jsx
│   │   │       └── RegistrationPageSubmitButton.test.jsx
│   │   └── VerificationPage/
│   │       ├── VerificationPage.jsx
│   │       └── tests/
│   │           └── VerificationPage.test.jsx
│   ├── tests/
│   │   └── HappyPath.test.jsx  # End-to-end happy path integration test
│   └── utilities/
│       ├── checkEmail.js       # Email format validator
│       └── checkPassword.js    # Password complexity checker
└── package.json
```

---

## Routing

Defined in `App.js` using React Router v6:

| Path                    | Component           | Description                          |
| ----------------------- | ------------------- | ------------------------------------ |
| `/`                     | `HomePage`          | Landing page                         |
| `/Login`                | `LoginPage`         | User sign-in form                    |
| `/Register`             | `RegisterPage`      | User registration form               |
| `/verifyEmail/:token`   | `VerificationPage`  | Email verification via token in URL  |

All pages are wrapped by a shared `Header` (navigation bar) and `Footer`.

---

## Pages & Components

### Header

A dark Bootstrap navbar with:
- **Brand link** — navigates to the home page, prefixed with a home icon.
- **Login link** — navigates to `/Login`, with a sign-in icon.

### Footer

A simple copyright footer displaying the current year.

### HomePage

A minimal landing page rendering `"HomePage!"`.

### LoginPage

A sign-in form with:
- Email and password fields.
- A **disabled** "Sign In" submit button (login functionality not yet implemented).
- A link to the registration page.

### RegisterPage

A full registration form with client-side validation:

- **Fields:** Username, Email, Password, Confirm Password.
- **Validation:**
  - Submit button is **disabled** until all fields are filled, the email is valid, and passwords match.
  - Real-time password complexity feedback (see [checkPassword](#checkpassword)).
  - Email format validation (see [checkEmail](#checkemail)).
- **States:**
  - **Loading** — shows a spinner/message while the API call is in progress.
  - **Success** — displays a confirmation message prompting the user to check their inbox.
  - **Error** — displays an error message if registration fails.

### VerificationPage

Accepts a `:token` URL parameter and POSTs it to the backend verification endpoint:

- **Loading** — displayed while the request is in flight.
- **Success** — "Email verified successfully!" on a `200` response.
- **Error** — descriptive error message on failure.

---

## Utilities

### checkEmail

**`utilities/checkEmail.js`** — `checkEmail(email) → boolean`

Validates email format using a regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) and rejects domains with consecutive dots (`..`).

### checkPassword

**`utilities/checkPassword.js`** — `checkPasswordComplexity(password, confirmPassword) → string[]`

Returns an array of error messages. Rules enforced:

| Rule                                          | Error Message                                                              |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| Minimum 8 characters                          | "Password must be at least 8 characters long."                            |
| At least one uppercase letter                 | "Password must contain at least one uppercase letter."                    |
| At least one lowercase letter                 | "Password must contain at least one lowercase letter."                    |
| At least one digit                            | "Password must contain at least one number."                              |
| At least one special character (`@$!%*?&`)    | "Password must contain at least one special character (@, $, !, %, *, ?, &)." |
| Passwords must match                          | "Passwords do not match."                                                 |

---

## API Integration

### Backend URL Configuration

API base URL is configured in `constants/urls.js`:

```js
export const BACKEND_URL =
  "__env__" in window ? window.__env__.BACKEND_URL : "";
```

At runtime, inject `window.__env__.BACKEND_URL` (e.g., via a `env-config.js` script in `public/`) to point at the backend. If not set, it defaults to the same origin (`""`).

### Endpoints

| Constant           | URL                              | Method | Description                    |
| ------------------- | -------------------------------- | ------ | ------------------------------ |
| `REGISTER_URL`      | `{BACKEND_URL}/api/register/`    | POST   | Register a new user            |
| `VERIFY_EMAIL_URL`  | `{BACKEND_URL}/api/verify-email` | POST   | Verify email with a JWT token  |

**Register request body:**
```json
{ "username": "string", "email": "string", "password": "string" }
```

**Verify email request body:**
```json
{ "token": "string" }
```

---

## Testing

### Test Setup

Tests use the following global configuration in `setupTests.js`:

1. **jest-dom** — extends Jest with custom DOM matchers like `toBeInTheDocument()`, `toBeEnabled()`, `toBeDisabled()`.
2. **MSW** — a mock server intercepts HTTP requests during tests. Handlers are defined in `mocks/server.js`:
   - `POST /api/register/` — returns `200` for `testuser` / `testuser@example.com`, otherwise `500`.
   - `POST /api/verify-email` — returns `200` for token `"valid-token"`, otherwise `400`.

### Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run a specific test file
npm test -- --testPathPattern="HappyPath"
```

### Test Suites

#### Happy Path (`tests/HappyPath.test.jsx`)

An end-to-end integration test that navigates through the full app flow:

1. Renders the app and verifies the copyright footer and login link.
2. Navigates to the login page and checks form elements.
3. Navigates to the register page via the "Register here" link.
4. Fills in the registration form with valid data.
5. Submits the form and verifies the success message.

#### Registration Page Tests (`pages/RegisterPage/tests/`)

| Test File                                        | What It Tests                                              |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `RegisterationPagePasswordComplexity.test.jsx`   | Password complexity rules — each rule triggers an error, strong password passes |
| `RegistrationPageEmail.test.jsx`                 | Email validation — invalid formats keep button disabled, valid email enables it |
| `RegistrationPageSubmitButton.test.jsx`          | Submit button enable/disable based on form completeness and password match |
| `RegistrationPageLoading.test.jsx`               | Loading state is displayed after form submission           |
| `RegistrationPageErrore.test.jsx`                | Error message is displayed when registration API returns failure |

#### Verification Page Tests (`pages/VerificationPage/tests/`)

| Test File                       | What It Tests                                                    |
| ------------------------------- | ---------------------------------------------------------------- |
| `VerificationPage.test.jsx`     | Loading state, success with valid token, error with invalid token |

---

## Available Scripts

| Command           | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm start`       | Start development server on port 3000            |
| `npm run build`   | Create optimized production build                |
| `npm test`        | Run tests in interactive watch mode              |
| `npm run eject`   | Eject from CRA (irreversible)                    |

---

## Browser Support

| Environment  | Targets                                                    |
| ------------ | ---------------------------------------------------------- |
| Production   | `>0.2%`, `not dead`, `not op_mini all`                     |
| Development  | Last 1 version of Chrome, Firefox, Safari                  |
