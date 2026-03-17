# Real Estate CRM

A full-stack real estate CRM built as a monorepo with a Hono API backend and a React frontend.

## Tech Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Package Manager | pnpm                                          |
| Monorepo        | Turborepo                                     |
| API             | Hono + Node.js (port 3000)                    |
| Web             | React 19 + TanStack Router + Vite (port 3001) |
| Styling         | Tailwind CSS v4                               |
| State           | TanStack Query                                |

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10+ — install with `npm install -g pnpm`

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create a `.env` file inside `apps/web/`:

```bash
# apps/web/.env
VITE_API_URL=http://localhost:3000
```

### 3. Run the development servers

From the root of the repo, run both apps concurrently:

```bash
pnpm dev
```

This starts:

- **API** → `http://localhost:3000`
- **Web** → `http://localhost:3001`

To run a single app individually:

```bash
# API only
pnpm --filter @crm/api dev

# Web only
pnpm --filter @crm/web dev
```

## Building for Production

```bash
pnpm build
```

Output:

- API → `apps/api/dist/`
- Web → `apps/web/dist/`

To start the compiled API server:

```bash
pnpm --filter @crm/api start
```

## Available Scripts

| Command                        | Description                   |
| ------------------------------ | ----------------------------- |
| `pnpm dev`                     | Start all apps in dev mode    |
| `pnpm build`                   | Build all apps for production |
| `pnpm --filter @crm/web lint`  | Lint the web app              |
| `pnpm --filter @crm/web test`  | Run web app tests             |
| `pnpm --filter @crm/web check` | Format + lint fix the web app |
