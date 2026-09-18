import fs from 'fs-extra';
import path from 'node:path';
import type { DiagnosticResult } from '../types/diagnostic.types.js';
import type { DoctorDiagnostic } from './doctor.runner.js';

interface StructureRequirement {
  name: string;
  relativePath: string;
  type: 'file' | 'directory';
}

const WEB_REQUIREMENTS: StructureRequirement[] = [
  {
    name: 'Source directory',
    relativePath: 'src',
    type: 'directory',
  },
  {
    name: 'Pages directory',
    relativePath: 'src/pages',
    type: 'directory',
  },
  {
    name: 'Services directory',
    relativePath: 'src/services',
    type: 'directory',
  },
  {
    name: 'Navigation directory',
    relativePath: 'src/navigation',
    type: 'directory',
  },
  {
    name: 'Shared components',
    relativePath: 'src/shared/components',
    type: 'directory',
  },
  {
    name: 'Shared contexts',
    relativePath: 'src/shared/contexts',
    type: 'directory',
  },
  {
    name: 'Shared hooks',
    relativePath: 'src/shared/hooks',
    type: 'directory',
  },
  {
    name: 'Shared providers',
    relativePath: 'src/shared/providers',
    type: 'directory',
  },
  {
    name: 'Application entry point',
    relativePath: 'src/main.tsx',
    type: 'file',
  },
  {
    name: 'Application component',
    relativePath: 'src/App.tsx',
    type: 'file',
  },
  {
    name: 'Route configuration',
    relativePath: 'src/navigation/routes.tsx',
    type: 'file',
  },
  {
    name: 'Vite configuration',
    relativePath: 'vite.config.ts',
    type: 'file',
  },
  {
    name: 'TypeScript configuration',
    relativePath: 'tsconfig.json',
    type: 'file',
  },
  {
    name: 'ESLint configuration',
    relativePath: 'eslint.config.js',
    type: 'file',
  },
];

const API_REQUIREMENTS: StructureRequirement[] = [
  {
    name: 'Source directory',
    relativePath: 'src',
    type: 'directory',
  },
  {
    name: 'Modules directory',
    relativePath: 'src/modules',
    type: 'directory',
  },
  {
    name: 'Middleware directory',
    relativePath: 'src/middlewares',
    type: 'directory',
  },
  {
    name: 'Routes directory',
    relativePath: 'src/routes',
    type: 'directory',
  },
  {
    name: 'Shared services',
    relativePath: 'src/shared/services',
    type: 'directory',
  },
  {
    name: 'Application',
    relativePath: 'src/app.ts',
    type: 'file',
  },
  {
    name: 'Server entry point',
    relativePath: 'src/server.ts',
    type: 'file',
  },
  {
    name: 'Lambda entry point',
    relativePath: 'src/lambda.ts',
    type: 'file',
  },
  {
    name: 'Route configuration',
    relativePath: 'src/routes/index.ts',
    type: 'file',
  },
  {
    name: 'Health route',
    relativePath: 'src/routes/health.routes.ts',
    type: 'file',
  },
  {
    name: 'Prisma schema',
    relativePath: 'prisma/schema.prisma',
    type: 'file',
  },
  {
    name: 'Prisma configuration',
    relativePath: 'prisma.config.ts',
    type: 'file',
  },
  {
    name: 'TypeScript configuration',
    relativePath: 'tsconfig.json',
    type: 'file',
  },
  {
    name: 'ESLint configuration',
    relativePath: 'eslint.config.js',
    type: 'file',
  },
];

const validateRequirement = async (
  projectRoot: string,
  requirement: StructureRequirement,
): Promise<DiagnosticResult> => {
  const targetPath = path.join(projectRoot, requirement.relativePath);

  if (!(await fs.pathExists(targetPath))) {
    return {
      name: requirement.name,
      status: 'error',
      message: `${requirement.relativePath} was not found.`,
      suggestion:
        'Restore the missing file or directory expected by the GMK Launchpad project structure.',
    };
  }

  const stats = await fs.stat(targetPath);

  const matchesType = requirement.type === 'file' ? stats.isFile() : stats.isDirectory();

  if (!matchesType) {
    return {
      name: requirement.name,
      status: 'error',
      message: `${requirement.relativePath} exists but is not a ${requirement.type}.`,
      suggestion: `Restore ${requirement.relativePath} as the expected ${requirement.type}.`,
    };
  }

  return {
    name: requirement.name,
    status: 'pass',
    message: `${requirement.relativePath} found.`,
  };
};

const structureDiagnostic: DoctorDiagnostic = {
  section: 'Structure',

  run: async (context) => {
    if (!context.projectContext) {
      return [
        {
          name: 'Project structure',
          status: 'skipped',
          message: 'Project structure validation requires a valid GMK Launchpad project.',
        },
      ];
    }

    const { rootPath, metadata } = context.projectContext;

    const requirements = metadata.projectType === 'web' ? WEB_REQUIREMENTS : API_REQUIREMENTS;

    const results: DiagnosticResult[] = [];

    for (const requirement of requirements) {
      results.push(await validateRequirement(rootPath, requirement));
    }

    return results;
  },
};

export default structureDiagnostic;
