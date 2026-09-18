<div align="center">

<a href="https://gmkdynamics.com">
  <img
    src="https://static.gmkdynamics.com/general/gmk-logo-red.webp"
    alt="GMK Dynamics"
    width="300"
  />
</a>

<br />

# GMK Launchpad

Opinionated project scaffolding for modern web applications and APIs.

Built by **GMK Dynamics**.

<br />

[GMK Dynamics](https://gmkdynamics.com)

</div>

---

## Overview

**GMK Launchpad** is a command-line project generation toolkit developed by GMK Dynamics.

It provides production-oriented application scaffolding based on the conventions and architecture used across GMK software projects.

Launchpad is intentionally opinionated.

Instead of generating generic starter projects that immediately require restructuring, it creates applications with predefined tooling, folder structures, scripts, configuration, and development conventions.

## Project Status

GMK Launchpad is currently under active development.

Version `0.2.0` completes the **Generator Improvements** milestone, adding project-aware code generation for both web and API projects, interactive generation workflows, context bundles, component categories, and optional route registration.

The next milestone, `0.3.0`, will focus on project tooling, environment validation, and configuration helpers.

Launchpad will not be published to npm until the `1.0.0` milestone is complete.

## CLI

Launchpad exposes the:

```bash
gmk
```

command.

View available commands:

```bash
gmk --help
```

Check the installed version:

```bash
gmk --version
```

## Create a Project

Run:

```bash
gmk create
```

Launchpad will ask for a project name and project type.

```text
? Project name: Customer Portal

? Project type:
  React + Vite
  Express API
❯ Full Stack
```

### React + Vite

Generates:

```text
customer-portal-web/
```

with:

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- ESLint
- Prettier
- Path aliases
- GMK project structure
- Development and validation scripts
- GMK Launchpad starter landing page
- Branded project documentation

### Express API

Generates:

```text
customer-portal-api/
```

with:

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- Zod
- Helmet
- CORS
- ESLint
- Prettier
- Health endpoint
- Centralized error handling
- Validation middleware
- Node server entry point
- AWS Lambda-compatible entry point
- GMK backend architecture
- Branded project documentation

### Full Stack

Generates two independent applications:

```text
customer-portal-web/
customer-portal-api/
```

Launchpad does not create a monorepo or wrapper directory.

The frontend and API remain independent projects with their own dependencies, configuration, Git history, and deployment lifecycle.

## Generated Frontend Structure

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
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── modals/
│   │   └── forms/
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
└── types/
```

New web projects include a starter landing page registered at `/`, with React Router wired through the application template.

## Generated API Structure

```text
prisma/
└── schema.prisma

src/
├── config/
├── middlewares/
├── modules/
├── routes/
├── shared/
│   ├── constants/
│   ├── errors/
│   ├── services/
│   ├── types/
│   └── utils/
├── types/
├── app.ts
├── lambda.ts
└── server.ts
```

The runtime architecture intentionally separates the Express application from its execution environment:

```text
server.ts ──┐
            ├──> app.ts
lambda.ts ──┘
```

This allows the same application to run through a standard Node.js process or an AWS Lambda handler without restructuring application code.

## Code Generation

Launchpad can generate application code inside existing GMK Launchpad projects.

Run the project-aware interactive generator:

```bash
gmk generate
```

Launchpad detects whether the current project is a web or API project and presents only the relevant generators.

Direct commands remain available for scripting and automation.

### Web Generators

```bash
gmk generate component <name> --type <type>
gmk generate page <name>
gmk generate service <name>
gmk generate context <name>
gmk generate provider <name>
gmk generate hook <name>
```

#### Components

Supported component types:

```text
ui
layout
navigation
modals
forms
```

For example:

```bash
gmk generate component navbar --type navigation
```

generates:

```text
src/shared/components/navigation/navbar/
├── navbar.component.tsx
└── index.ts
```

Generated React `.tsx` artifacts follow the GMK Launchpad React component convention using `React.FC`.

#### Pages

Generate a page with:

```bash
gmk generate page dashboard
```

which creates:

```text
src/pages/dashboard/
├── dashboard.page.tsx
└── index.ts
```

Pages can optionally be registered with React Router:

```bash
gmk generate page dashboard --route /dashboard
```

The interactive generator can also ask whether the page should be registered automatically.

#### Services

Generate a frontend service with:

```bash
gmk generate service invoices
```

which creates:

```text
src/services/invoices.service.ts
```

#### Context Bundles

Context, provider, and hook generation operate as a single bundle.

Any of these commands:

```bash
gmk generate context auth
gmk generate provider auth
gmk generate hook auth
```

generate:

```text
src/shared/contexts/auth.context.ts
src/shared/providers/auth.provider.tsx
src/shared/hooks/use-auth.hook.ts
```

Inputs such as `auth`, `AuthContext`, `auth-provider`, `use-auth`, and `useAuth` are normalized to the same bundle name.

### API Generators

```bash
gmk generate module <name>
gmk generate middleware <name>
gmk generate service <name>
```

#### Modules

Generated backend modules follow the GMK nine-file module convention:

```text
src/modules/example/
├── example.constants.ts
├── example.controller.ts
├── example.mapper.ts
├── example.repository.ts
├── example.routes.ts
├── example.service.ts
├── example.types.ts
├── example.validation.ts
└── index.ts
```

Generate a module with:

```bash
gmk generate module sales-order
```

Modules can optionally register their router automatically:

```bash
gmk generate module client --route /clients
```

The interactive generator can also ask whether the module router should be registered.

#### Middleware

Generate API middleware with:

```bash
gmk generate middleware request-id
```

which creates:

```text
src/middlewares/request-id.middleware.ts
```

#### Services

Generate a shared API service with:

```bash
gmk generate service email
```

which creates:

```text
src/shared/services/email.service.ts
```

## Feature Commands

Launchpad can add capabilities to existing generated projects without rebuilding them from scratch.

### Docker

Add Docker support with:

```bash
gmk add docker
```

For web projects, this adds a production Nginx container configuration and `docker:build` / `docker:run` scripts.

For API projects, this adds the API container plus a Docker Compose environment with PostgreSQL for local development. The generated scripts include `docker:build`, `docker:run`, `docker:up`, `docker:down`, `docker:logs`, and `docker:reset`.

Before starting the API Compose environment, create the local Docker environment file from `.env.docker.example`, then run:

```bash
npm run docker:up
```

The PostgreSQL service persists data in a named Docker volume and exposes port `5433` by default to avoid colliding with a typical host PostgreSQL installation on `5432`.

### AWS Cognito

AWS Cognito integration is available for both web and API projects:

```bash
gmk add cognito
```

For API projects, Launchpad adds Cognito JWT verification, authentication middleware, request typing, and the required environment variable placeholders.

For web projects, Launchpad adds a Cognito authentication service and client configuration.

Launchpad prepares the application integration only; it does not provision Cognito resources in AWS.

### AWS Lambda

AWS Lambda deployment support is available for API projects:

```bash
gmk add lambda
```

This adds a basic Serverless Framework configuration and package/deploy/remove scripts around the existing `src/lambda.ts` handler.

Project-specific infrastructure such as VPCs, RDS, S3, IAM policies, Route 53, and Secrets Manager remains intentionally outside Launchpad's automatic configuration.

## Project Metadata

Launchpad identifies generated projects through:

```text
.gmk-launchpad.json
```

The CLI can resolve the project root when commands are run from nested directories.

Project metadata tracks the Launchpad schema version, the version used to generate the project, the project type, and installed Launchpad features.

## Development

Clone the repository and install dependencies:

```bash
npm install
```

Start the CLI directly from source:

```bash
npm run dev -- create
```

Build Launchpad:

```bash
npm run build
```

Validate the project:

```bash
npm run check
```

Format the codebase:

```bash
npm run format
```

## Local CLI Testing

Build the package:

```bash
npm run build
```

Link it locally:

```bash
npm link
```

Launchpad can then be used like an installed CLI:

```bash
gmk create
```

Remove the global development link when necessary with:

```bash
npm unlink -g @gmkdynamics/launchpad
```

## Package Testing

Launchpad is not published to npm during the `0.x` development series.

Create a local package archive with:

```bash
npm pack
```

This produces a `.tgz` archive containing the distributable package and can be installed on another machine to test the exact package contents without publishing to npm.

Inspect the package contents without creating the final archive:

```bash
npm pack --dry-run
```

## Architecture

Launchpad separates CLI concerns into focused layers:

```text
src/
├── commands/
├── features/
├── generators/
├── prompts/
├── shared/
│   ├── constants/
│   ├── filesystem/
│   ├── logger/
│   ├── project/
│   └── utils/
├── templates/
│   ├── api/
│   ├── features/
│   ├── generators/
│   ├── module/
│   └── web/
├── types/
└── cli.ts
```

Templates are copied into the build output and distributed with the CLI.

Generated projects are created from GMK-owned templates rather than delegating project creation to external framework generators.

## Roadmap

Launchpad follows Semantic Versioning throughout development. The `0.x` series is used to complete the planned pre-release milestones.

Launchpad will move to `1.0.0` for its first public npm release after the planned pre-release milestones are complete and stable.

### 0.1.0 — Foundation

- [x] React + Vite project generation
- [x] Express + Prisma API generation
- [x] Full-stack project generation
- [x] Docker support
- [x] PostgreSQL Docker Compose
- [x] AWS Lambda support
- [x] AWS Cognito integration
- [x] API module generation
- [x] Project metadata and feature detection

### 0.2.0 — Generator Improvements

- [x] API middleware generation
- [x] API shared service generation
- [x] Web component generation
- [x] Web component categories
- [x] Web page generation
- [x] Web service generation
- [x] Context, provider, and hook bundle generation
- [x] Project-aware interactive generation
- [x] Optional API module route registration
- [x] React Router web foundation
- [x] Optional web page route registration
- [x] GMK Launchpad starter landing page

### 0.3.0 — Project Tooling

- [ ] Project diagnostics (`gmk doctor`)
- [ ] Configuration helpers
- [ ] Improved environment validation

### 1.0.0 — Public Release

- [ ] Final release QA
- [ ] Dedicated GMK Launchpad documentation website
- [ ] Final npm package metadata and documentation review
- [ ] Public npm release

### Future

- [ ] Automated project migrations and upgrades
- [ ] Plugin and extension architecture
- [ ] Additional templates based on GMK projects

## License

GMK Launchpad is licensed under the MIT License.

See [LICENSE](./LICENSE) for details.

---

<div align="center">

### Build faster with GMK Dynamics.

[Visit gmkdynamics.com](https://gmkdynamics.com)

<br />

<sub>GMK Launchpad · GMK Dynamics</sub>

</div>
