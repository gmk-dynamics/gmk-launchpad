<div align="center">

<a href="https://gmkdynamics.com">
  <img
    src="https://static.gmkdynamics.com/general/gmk-logo-red.webp"
    alt="GMK Dynamics"
    width="260"
  />
</a>

<br />

# {{PROJECT_NAME}} API

An Express API powered by **GMK Launchpad**.

Built with Express, TypeScript, PostgreSQL, Prisma, and Zod.

<br />

[GMK Dynamics](https://gmkdynamics.com)

</div>

---

## Overview

**{{PROJECT_NAME}} API** was scaffolded using **GMK Launchpad**, the project generation toolkit developed by GMK Dynamics.

The project includes an opinionated backend foundation with sensible defaults for:

- Express application structure
- TypeScript
- PostgreSQL
- Prisma
- Zod validation
- Error handling
- Security middleware
- Code formatting
- Linting
- Node.js runtime support
- AWS Lambda compatibility

## Tech Stack

- Node.js
- Express 5
- TypeScript
- PostgreSQL
- Prisma 7
- Prisma PostgreSQL Adapter
- Zod
- Helmet
- CORS
- serverless-http
- ESLint
- Prettier
- tsx

## Runtime Architecture

The application is separated from its runtime entry points:

```text
server.ts ──┐
            ├──> app.ts ──> routes / middleware / modules
lambda.ts ──┘
```

### `app.ts`

Creates and configures the Express application.

It contains application-level middleware, routes, and error handling without starting an HTTP server.

### `server.ts`

Starts the standard Node.js HTTP server.

This is the default entry point for local development, traditional Node hosting, and containerized environments.

### `lambda.ts`

Exports the Express application through `serverless-http` for AWS Lambda-compatible environments.

This separation allows the same application to support different deployment targets without coupling business logic to a particular runtime.

## Requirements

Before getting started, make sure you have:

- Node.js
- npm
- PostgreSQL, when database functionality is required

## Getting Started

### 1. Create your environment file

Copy the included `.env.example` file:

#### macOS / Linux

```bash
cp .env.example .env
```

#### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

The generated environment file contains starter values similar to:

```env
PORT=3000

DATABASE_URL="postgresql://gmk_user:change_me@localhost:5432/{{PROJECT_SLUG}}?schema=public"

DATABASE_SSL=false
DATABASE_POOL_MAX=2

API_BASE_ROUTE=api
API_VERSION=v1

NODE_ENV=development
```

The provided database credentials are placeholders.

Update `DATABASE_URL` with valid PostgreSQL credentials before using commands that connect to the database.

### 2. Install dependencies

```bash
npm install
```

The `postinstall` script automatically runs:

```bash
prisma generate
```

### 3. Start the API

```bash
npm run dev
```

By default, the API runs at:

```text
http://localhost:3000/api/v1
```

## Health Check

A health endpoint is available immediately:

```http
GET /api/v1/health
```

Example:

```text
http://localhost:3000/api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is healthy."
}
```

The health endpoint does not require a working database connection.

## Available Scripts

### Development

| Command              | Description                                            |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | Starts the API using `tsx` in watch mode               |
| `npm run build`      | Compiles the TypeScript project into `dist`            |
| `npm run build:test` | Type-checks the project without producing build output |
| `npm start`          | Starts the compiled API from `dist/server.js`          |

### Code Quality

| Command                | Description                                                             |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run lint`         | Runs ESLint                                                             |
| `npm run lint:fix`     | Runs ESLint and automatically fixes supported issues                    |
| `npm run format`       | Formats the project using Prettier                                      |
| `npm run format:check` | Checks whether files comply with Prettier formatting                    |
| `npm run check`        | Formats, validates formatting, runs ESLint, and type-checks the project |

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

Because `npm run check` includes `npm run format`, it may modify files that do not currently match the configured formatting rules.

## Prisma Commands

The project includes a complete set of common Prisma scripts.

| Command                   | Description                                                       |
| ------------------------- | ----------------------------------------------------------------- |
| `npm run prisma:generate` | Generates Prisma Client                                           |
| `npm run prisma:pull`     | Introspects the configured database and updates the Prisma schema |
| `npm run prisma:push`     | Pushes the Prisma schema directly to the database                 |
| `npm run prisma:migrate`  | Creates and applies development migrations                        |
| `npm run prisma:deploy`   | Applies existing migrations in deployment environments            |
| `npm run prisma:studio`   | Opens Prisma Studio                                               |
| `npm run prisma:reset`    | Resets the development database and reapplies migrations          |
| `npm run prisma:format`   | Formats the Prisma schema                                         |
| `npm run prisma:validate` | Validates the Prisma configuration and schema                     |

### Database Configuration

Commands that interact with PostgreSQL require a valid:

```env
DATABASE_URL=
```

The generated `.env.example` contains placeholder credentials and is not expected to connect to a real database until you configure it.

For example:

```env
DATABASE_URL="postgresql://application_user:password@localhost:5432/application_db?schema=public"
```

Do not commit real credentials to source control.

## Prisma Architecture

Prisma uses the PostgreSQL driver adapter and an explicit `pg` connection pool.

The Prisma CLI configuration is located at:

```text
prisma.config.ts
```

The Prisma schema is located at:

```text
prisma/
└── schema.prisma
```

The runtime Prisma configuration is located at:

```text
src/
└── config/
    └── prisma.config.ts
```

The project uses `@prisma/client` directly and does not create a custom source-level generated Prisma directory.

## Project Structure

```text
prisma/
└── schema.prisma

src/
├── config/
│   └── prisma.config.ts
│
├── middlewares/
│   ├── error.middleware.ts
│   └── validation.middleware.ts
│
├── modules/
│
├── routes/
│   ├── health.routes.ts
│   └── index.ts
│
├── shared/
│   ├── constants/
│   ├── errors/
│   │   └── app.error.ts
│   ├── types/
│   └── utils/
│
├── types/
│   └── express.d.ts
│
├── app.ts
├── lambda.ts
└── server.ts
```

## Module Convention

Domain modules can follow the GMK backend convention:

```text
src/modules/example/
├── example.constants.ts
├── example.controller.ts
├── example.repository.ts
├── example.routes.ts
├── example.service.ts
├── example.types.ts
├── example.validation.ts
└── index.ts
```

This separates:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Repositories
  ↓
Prisma / PostgreSQL
```

while keeping validation, types, and domain constants close to the module they belong to.

## Environment Variables

| Variable            | Description                             | Default       |
| ------------------- | --------------------------------------- | ------------- |
| `PORT`              | HTTP server port                        | `3000`        |
| `DATABASE_URL`      | PostgreSQL connection string            | Placeholder   |
| `DATABASE_SSL`      | Enables PostgreSQL SSL                  | `false`       |
| `DATABASE_POOL_MAX` | Maximum PostgreSQL connection pool size | `2`           |
| `API_BASE_ROUTE`    | Root API path                           | `api`         |
| `API_VERSION`       | API version prefix                      | `v1`          |
| `NODE_ENV`          | Node environment                        | `development` |

Environment files containing real credentials should never be committed.

## Production Build

Create the compiled application:

```bash
npm run build
```

The resulting output is written to:

```text
dist/
```

Start the compiled Node application with:

```bash
npm start
```

which executes:

```text
node dist/server.js
```

## Lambda Support

The project includes:

```text
src/lambda.ts
```

as a Lambda-compatible application entry point.

The base scaffold intentionally does not include AWS infrastructure, deployment configuration, IAM configuration, or Lambda packaging.

Those concerns remain separate from the application itself so they can be added without restructuring the API.

## GMK Launchpad

This project was generated with **GMK Launchpad**.

GMK Launchpad provides opinionated project scaffolding based on the engineering standards used by GMK Dynamics.

<div align="center">

### Build faster with GMK Dynamics.

[Visit gmkdynamics.com](https://gmkdynamics.com)

<br />

<sub>Generated by GMK Launchpad</sub>

</div>
