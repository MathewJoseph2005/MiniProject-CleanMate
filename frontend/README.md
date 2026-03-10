# CleanMate – Deep Cleaning Service Management Frontend

This is the frontend codebase for **CleanMate**, a deep cleaning service management platform with role-based dashboards for **customers**, **agents**, and **admins**.

## Tech Stack

- Vite + React + TypeScript
- React Router
- Tailwind CSS + shadcn-ui
- Context-based authentication (simulated, no backend)

## Running the project

```sh
npm install
npm run dev
```

Then open the printed URL in your browser.

## Project structure

- `src/App.tsx` – routing and role-based layouts
- `src/contexts/AuthContext.tsx` – simple auth simulation and role handling
- `src/pages` – all role-specific pages (customer, agent, admin, auth)
- `src/components` – shared UI components and dashboard layout

## Demo logins

On the login screen you can use the built-in demo credentials:

- `customer / password`
- `agent / password`
- `admin / password`
