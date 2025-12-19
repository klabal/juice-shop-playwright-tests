# 🧃 OWASP Juice Shop Automation Suite

A robust automation framework designed to test the [OWASP Juice Shop](https://owasp-juice.shop/), the world's most sophisticated insecure web application. This suite leverages **Playwright** and **TypeScript** to deliver high-speed, reliable testing across both the frontend and the underlying REST API.

---

## 🎯 Purpose
The objective of this project is to demonstrate a modern approach to Quality Assurance by:
1.  **UI Testing:** Validating complex user journeys like registration, shopping, and checkout using the Page Object Model.
2.  **API Testing:** Ensuring the integrity of backend endpoints and performing data setup/teardown via REST requests.
3.  **Hybrid Strategy:** Using API calls to bypass UI setup (like authentication) to drastically reduce test execution time.

---

## 🛠️ Tech Stack
* **Language:** TypeScript
* **Test Runner:** Playwright Test
* **Reporting:** Playwright HTML Reporter
* **Environment:** Node.js

---

## ✨ Features
* **Type Safety:** Full TypeScript implementation for better developer experience and catchable errors during compile-time.
* **Page Object Model (POM):** Scalable and maintainable UI abstractions.
* **Parallel Execution:** Configured to run tests in parallel to maximize efficiency.
* **Trace Viewer:** Integrated debugging with Playwright traces for failed tests (snapshots, console logs, and network intercepts).
* **Multi-Browser Support:** Pre-configured for Chromium, Firefox, and WebKit.

---

## 📁 Project Structure
```text
├── tests/
│   ├── api/             # Pure REST API validation tests
│   └── ui/              # End-to-end UI automation flows
├── page-objects/        # Reusable UI component abstractions
├── utils/               # API clients, auth helpers, and mock data
├── playwright.config.ts # Global configuration and browser settings
└── package.json         # Scripts and dependencies
   
