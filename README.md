# 🧃 OWASP Juice Shop Automation Suite

A robust automation framework designed to test the [OWASP Juice Shop](https://owasp-juice.shop/). This suite leverages **Playwright** and **TypeScript** to deliver high-speed, reliable testing across both the frontend and the underlying REST API.

---

## 🎯 Purpose
The objective of this project is to demonstrate a modern approach to Quality Assurance by:
1.  **UI Testing:** Validating complex user journeys like registration and checkout using the Page Object Model.
2.  **API Testing:** Ensuring integrity of backend endpoints and performing data setup/teardown via REST requests.
3.  **Hybrid Strategy:** Using API calls to bypass UI setup (like authentication) to reduce execution time.

---

## 🛠️ Tech Stack
* **Language:** TypeScript
* **Test Runner:** Playwright Test
* **CI/CD:** GitHub Actions
* **Reporting:** Playwright HTML Reporter

---

## 🚀 Continuous Integration
This project uses **GitHub Actions** to ensure code quality on every push and pull request.

* **Automated Runs:** Tests are triggered automatically on `push` to `main` and all `pull_requests`.
* **Artifacts:** After every run, the Playwright HTML Report is uploaded as a GitHub artifact for 30 days for easy debugging.
* **Environment:** Tests run in a headless Linux environment within the GitHub runner.

---

## ✨ Features
* **Type Safety:** Full TypeScript implementation for better developer experience.
* **Page Object Model (POM):** Scalable and maintainable UI abstractions.
* **Trace Viewer:** Integrated debugging with snapshots, console logs, and network intercepts.
* **Multi-Browser Support:** Pre-configured for Chromium, Firefox, and WebKit.

---

## 📁 Project Structure
```text
├── .github/workflows/   # GitHub Actions CI configuration
├── tests/
│   ├── api/             # Pure REST API validation tests
│   └── ui/              # End-to-end UI automation flows
├── page-objects/        # Reusable UI component abstractions
├── utils/               # API clients and auth helpers
├── playwright.config.ts # Global configuration
└── package.json

---

## ✨ Quick installation
To run this suite locally, ensure you have [Node.js](https://nodejs.org/) installed:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/klabal/juice-shop-playwright-tests.git](https://github.com/klabal/juice-shop-playwright-tests.git)
   cd juice-shop-playwright-tests
2. **Install dependencies**:
  ```bash
    npm install
3. **Run all tests**:
    ```bash
    npx playwright test
4. **View the report**:
  ```bash
  npx playwright show-report

---
