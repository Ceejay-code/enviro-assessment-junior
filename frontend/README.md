# Enviro365 Investor Portal

dont point to api for now just use mock data i just wanna see how it will look like Create a modern, professional Investor Portal Dashboard for an Investment & Withdrawal System connecting to a Spring Boot backend running at http://localhost:8080.

Layout & Navigation:

Sidebar Navigation Layout:

Brand Logo & Title: Enviro365

Profile Switcher at the top: Dropdown allowing quick switching between 5 pre-loaded Demo Investors (e.g., 3 investors over age 65, 2 investors under age 65) to test rule validations easily.

Main Menu Items:

Dashboard (/)

My Portfolio (/portfolio)

Withdrawal Notices (/withdrawals)

Reports (/reports)

Page Specs & Features:

Dashboard Page (/):

Metrics Overview Cards:

Total Portfolio Value (Sum of balances across SAVINGS and RETIREMENT products).

Total Withdrawal Notices (Count of all submitted notices).

Approved Notices (Notices meeting all business rules).

Declined Notices (Notices flagged for exceeding 90% balance or Retirement age ≤ 65).

Recent Activity Table: Shows the latest 5 withdrawal notices with status badges (APPROVED, DECLINED, PENDING), opening balance, requested amount, and closing balance.

Portfolio Page (/portfolio):

Investor Details Card: Displays Name, Surname, Email, and Age badge (highlighting whether eligible for retirement withdrawal).

Products Grid/Table: Shows Product ID, Product Type (SAVINGS / RETIREMENT), and Current Balance formatted in ZAR (R).

Action Button: "Create Withdrawal Notice" button opening a modal.

Withdrawal Notices Page (/withdrawals):

Interactive form to submit new notice:

Select Product (SAVINGS or RETIREMENT).

Enter Withdrawal Amount.

Live calculation showing: Opening Balance, Requested Amount, and New Closing Balance.

Validation Feedback:

If product type is RETIREMENT and investor age ≤ 65, show an inline error: "Withdrawals from Retirement products are restricted to investors over 65 years old."

If amount > 90% of product balance, show an error: "Withdrawal amount cannot exceed 90% of current balance."

Full history table of all past withdrawal notices for the active investor.

Reports Page (/reports):

Filter notices by date range or product.

"Download Notice Statement" button (simulates or exports CSV/PDF notice statement).

Styling:

Use Tailwind CSS, Lucide React icons, and Shadcn UI components.

Professional financial dashboard aesthetic (Navy Blue primary theme, clean light-gray background).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e17385f3-7caa-4487-a180-c814b071cfee).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
