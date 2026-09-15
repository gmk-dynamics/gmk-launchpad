<div align="center">

<a href="https://gmkdynamics.com">
  <img
    src="https://static.gmkdynamics.com/general/gmk-logo-red.webp"
    alt="GMK Dynamics"
    width="260"
  />
</a>

<br />

# {{PROJECT_NAME}}

A React application powered by **GMK Launchpad**.

Built with React, Vite, TypeScript, and Tailwind CSS.

<br />

[GMK Dynamics](https://gmkdynamics.com)

</div>

---

## Overview

**{{PROJECT_NAME}}** was scaffolded using **GMK Launchpad**, the project generation toolkit developed by GMK Dynamics.

The project includes an opinionated frontend foundation designed for modern React applications with sensible defaults for development, formatting, linting, type checking, project structure, and path aliases.

## Tech Stack

- React 19
- Vite 7
- TypeScript
- Tailwind CSS 4
- ESLint
- Prettier

## Requirements

Before getting started, make sure you have:

- Node.js
- npm

## Getting Started

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

### Development

| Command              | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `npm run dev`        | Starts the Vite development server                           |
| `npm run build`      | Type-checks the project and creates the production build     |
| `npm run build:test` | Type-checks the project without producing a production build |
| `npm run preview`    | Serves the production build locally                          |

### Code Quality

| Command                | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `npm run lint`         | Runs ESLint                                                                   |
| `npm run lint:fix`     | Runs ESLint and automatically fixes supported issues                          |
| `npm run format`       | Formats the project using Prettier                                            |
| `npm run format:check` | Checks whether files comply with Prettier formatting                          |
| `npm run check`        | Runs linting, formatting, formatting validation, and TypeScript type checking |

> `npm run check` includes `npm run format`, so it may modify files that do not currently match the configured Prettier rules.

## Project Structure

```text
src/
├── assets/
├── enums/
├── interfaces/
├── models/
├── navigation/
├── pages/
├── services/
├── shared/
│   ├── components/
│   ├── constants/
│   ├── containers/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── mocks/
│   ├── props/
│   ├── providers/
│   ├── styles/
│   └── utils/
├── types/
├── App.css
├── App.tsx
├── index.css
├── main.tsx
└── vite-env.d.ts
```

## Path Aliases

The project includes the following path aliases:

| Alias           | Directory          |
| --------------- | ------------------ |
| `@/*`           | `src/*`            |
| `@assets/*`     | `src/assets/*`     |
| `@enums/*`      | `src/enums/*`      |
| `@interfaces/*` | `src/interfaces/*` |
| `@models/*`     | `src/models/*`     |
| `@navigation/*` | `src/navigation/*` |
| `@pages/*`      | `src/pages/*`      |
| `@services/*`   | `src/services/*`   |
| `@shared/*`     | `src/shared/*`     |
| `@types/*`      | `src/types/*`      |

For example:

```ts
import ExampleComponent from '@shared/components/example.component';
import { ExampleService } from '@services/example.service';
```

## Environment Variables

Environment-specific configuration should be stored in local `.env` files.

Use the included `.env.example` as the starting point:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Create your local environment file:

### macOS / Linux

```bash
cp .env.example .env
```

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Do not commit environment files containing secrets or environment-specific credentials.

## Code Quality

Before committing changes, run:

```bash
npm run check
```

The complete project check runs:

```text
ESLint
  ↓
Prettier formatting
  ↓
Prettier validation
  ↓
TypeScript type checking
```

Because the check command uses:

```bash
npm run build:test
```

it validates TypeScript without creating the production `dist/` output.

For a complete production build, run:

```bash
npm run build
```

This performs:

```text
TypeScript
  ↓
Vite production build
  ↓
dist/
```

## Styling

Tailwind CSS is configured through the Vite integration and is available throughout the application.

The main stylesheet is:

```text
src/index.css
```

Application-specific styles can also be organized under:

```text
src/shared/styles/
```

The starter also includes:

```text
src/App.css
```

for application-level styles when needed.

## TypeScript

The project uses separate TypeScript configurations for application and tooling concerns:

```text
tsconfig.json
tsconfig.app.json
tsconfig.node.json
```

The production build runs:

```bash
tsc -b && vite build
```

while the type-check-only command runs:

```bash
tsc -b --noEmit
```

## GMK Launchpad

This project was generated with **GMK Launchpad**.

GMK Launchpad provides opinionated project scaffolding based on the engineering standards used by GMK Dynamics.

<div align="center">

### Build faster with GMK Dynamics.

[Visit gmkdynamics.com](https://gmkdynamics.com)

<br />

<sub>Generated by GMK Launchpad</sub>

</div>
