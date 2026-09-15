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

The initial public release is planned after the core project creation, feature installation, and code generation commands are complete.

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
- ESLint
- Prettier
- Path aliases
- GMK project structure
- Development and validation scripts
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

## Backend Module Convention

Generated backend modules follow the GMK module structure:

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

Automated module generation is planned through:

```bash
gmk generate module <name>
```

## Planned Feature Commands

Launchpad is being designed so capabilities can be added to existing generated projects without rebuilding them from scratch.

Planned commands include:

```bash
gmk add docker
gmk add cognito
gmk add lambda
```

Additional generators will use the same architecture:

```bash
gmk generate module client
```

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

Before public release, Launchpad can be packaged locally using:

```bash
npm pack
```

This produces a `.tgz` archive that can be installed elsewhere to test the exact package contents without publishing to npm.

## Architecture

Launchpad separates CLI concerns into focused layers:

```text
src/
├── commands/
├── generators/
├── prompts/
├── shared/
│   ├── constants/
│   ├── filesystem/
│   ├── logger/
│   └── utils/
├── templates/
│   ├── api/
│   └── web/
├── types/
└── cli.ts
```

Templates are copied into the build output and distributed with the CLI.

Generated projects are created from GMK-owned templates rather than delegating project creation to external framework generators.

## Roadmap

Before the initial public release:

- [x] React + Vite project generation
- [x] Express API project generation
- [x] Full-stack project generation
- [x] GMK-branded CLI experience
- [x] Project collision protection
- [x] Generated project documentation
- [ ] Docker integration
- [ ] AWS Cognito integration
- [ ] AWS Lambda integration
- [ ] Backend module generation
- [ ] Package installation testing
- [ ] Public npm release

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
