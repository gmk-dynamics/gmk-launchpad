import fs from 'fs-extra';
import path from 'node:path';
import type { DiagnosticResult } from '../types/diagnostic.types.js';
import type { DoctorDiagnostic } from './doctor.runner.js';

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

const WEB_DEPENDENCIES = [
  'react',
  'react-dom',
  'react-router-dom',
  'vite',
  'typescript',
  'tailwindcss',
] as const;

const API_DEPENDENCIES = [
  'express',
  '@prisma/client',
  '@prisma/adapter-pg',
  'pg',
  'zod',
  'typescript',
] as const;

const getDeclaredDependencies = (packageJson: PackageJson): Record<string, string> => {
  return {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
};

const dependencyDiagnostic: DoctorDiagnostic = {
  section: 'Dependencies',

  run: async (context) => {
    const results: DiagnosticResult[] = [];

    if (!context.projectContext) {
      return [
        {
          name: 'Dependency validation',
          status: 'skipped',
          message: 'Dependency validation requires a valid GMK Launchpad project.',
        },
      ];
    }

    const { rootPath, metadata } = context.projectContext;

    const packageJsonPath = path.join(rootPath, 'package.json');

    if (!(await fs.pathExists(packageJsonPath))) {
      return [
        {
          name: 'package.json',
          status: 'error',
          message: 'package.json was not found in the project root.',
          suggestion:
            'Restore the project package.json before installing or validating dependencies.',
        },
      ];
    }

    results.push({
      name: 'package.json',
      status: 'pass',
      message: 'package.json found.',
    });

    let packageJson: PackageJson;

    try {
      packageJson = await fs.readJson(packageJsonPath);
    } catch {
      return [
        ...results,
        {
          name: 'package.json syntax',
          status: 'error',
          message: 'package.json could not be parsed.',
          suggestion: 'Fix the JSON syntax in package.json.',
        },
      ];
    }

    results.push({
      name: 'package.json syntax',
      status: 'pass',
      message: 'package.json is valid JSON.',
    });

    const declaredDependencies = getDeclaredDependencies(packageJson);

    const requiredDependencies =
      metadata.projectType === 'web' ? WEB_DEPENDENCIES : API_DEPENDENCIES;

    for (const dependency of requiredDependencies) {
      if (declaredDependencies[dependency]) {
        results.push({
          name: dependency,
          status: 'pass',
          message: `${dependency} is declared.`,
        });
      } else {
        results.push({
          name: dependency,
          status: 'error',
          message: `${dependency} is not declared in package.json.`,
          suggestion: 'Restore the dependency expected by the GMK Launchpad project template.',
        });
      }
    }

    const nodeModulesPath = path.join(rootPath, 'node_modules');

    if (await fs.pathExists(nodeModulesPath)) {
      results.push({
        name: 'Installed dependencies',
        status: 'pass',
        message: 'node_modules is present.',
      });
    } else {
      results.push({
        name: 'Installed dependencies',
        status: 'warning',
        message: 'node_modules was not found.',
        suggestion: 'Run npm install before developing or building this project.',
      });
    }

    return results;
  },
};

export default dependencyDiagnostic;
