# Enviro365 Investor Portal

Enviro365 is a full-stack investor portal for viewing investment products and submitting withdrawal notices. The frontend is a React/TanStack Start application and the backend is a Spring Boot REST API backed by an in-memory H2 database.

## Features

- JWT-based investor login
- Dashboard with portfolio value and withdrawal activity
- Portfolio view for savings and retirement products
- Withdrawal validation and notice history
- CSV export of withdrawal notices
- Responsive UI built with React, Tailwind CSS, shadcn/ui, and Lucide icons

## Tech Stack

- **Frontend:** React 19, TypeScript, TanStack Router/Start, Vite, Tailwind CSS
- **Backend:** Java 17, Spring Boot 3.2.4, Spring Security, Spring Data JPA, Hibernate
- **Database:** H2 in-memory database for local development
- **Authentication:** JSON Web Tokens using JJWT

## Prerequisites

- Java 17 or later
- Maven 3.9 or later, or use the included Maven wrapper
- Node.js 20 or later
- npm

## Setup and Run

Clone the repository and open two terminal windows.

### 1. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The API starts at `http://localhost:8080`. H2 is available at `http://localhost:8080/h2-console` when the application is running.

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The frontend currently uses `http://localhost:8080/api` as its API base URL. Start the backend before signing in.

## API Documentation

All protected endpoints require the JWT returned by `/api/auth/login`:

```http
Authorization: Bearer <access-token>
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
	"username": "your-username",
	"password": "your-password"
}
```

### Get the authenticated investor portfolio

```http
GET /api/investor/portfolio
```

Returns the investor profile and associated savings/retirement products.

### Get dashboard summary

```http
GET /api/investor/dashboard
```

Returns dashboard totals and recent withdrawal activity for the authenticated investor.

### Create a withdrawal notice

```http
POST /api/investor/withdrawals
Content-Type: application/json

{
	"productId": "product-id",
	"amount": 1000
}
```

Withdrawal rules:

- The amount must be greater than zero.
- The amount cannot exceed the current product balance.
- The amount cannot exceed 90% of the current product balance.
- Retirement withdrawals are restricted to investors over 65 years old.

### Get withdrawal history for a product

```http
GET /api/investor/withdrawals/product/{productId}
```

### Export withdrawals as CSV

```http
GET /api/investor/withdrawals/export-csv
```

The response downloads `withdrawals.csv`.

## AI Usage

AI assistance was used during development for:

- Structuring the frontend dashboard and reusable UI components
- Drafting TypeScript types and API client integration
- Reviewing validation flows for retirement and 90% withdrawal rules
- Improving responsive layout, accessibility, and README documentation

All generated code was reviewed, integrated, and tested against the application requirements. Business rules remain implemented in the application code and should be verified with backend tests before production use.

## Screenshots

The main UI screens to capture for the project submission are:

1. Login screen
2. Investor dashboard
3. Portfolio and product balances
4. Withdrawal form showing validation feedback
5. Reports/history view with CSV export

Place captured images in `docs/screenshots/` and reference them here, for example:

```markdown
![Investor dashboard](docs/screenshots/dashboard.png)
```

## Testing and Builds

Backend tests:

```bash
cd backend
./mvnw test
```

Frontend lint and production build:

```bash
cd frontend
npm run lint
npm run build
```

## Project Structure

```text
backend/    Spring Boot API, security, services, JPA entities, and tests
frontend/   React/TanStack investor portal
```

## Current Development Notes

- The backend uses an H2 in-memory database, so data is reset when the application restarts.
- The frontend API URL is currently defined in `frontend/src/lib/api.ts`.
- This project is intended for local assessment/demo use and should receive externalized configuration, persistent storage, and production secrets management before deployment.
