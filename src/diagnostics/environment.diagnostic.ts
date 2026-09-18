import fs from 'fs-extra';
import path from 'node:path';
import { hasEnvironmentValue, readEnvironmentFile } from '../shared/utils/environment.utils.js';
import type { DiagnosticResult } from '../types/diagnostic.types.js';
import type { DoctorDiagnostic } from './doctor.runner.js';

const API_REQUIRED_ENVIRONMENT_VARIABLES = [
  'DATABASE_URL',
  'API_BASE_ROUTE',
  'API_VERSION',
] as const;

const environmentDiagnostic: DoctorDiagnostic = {
  section: 'Environment',

  run: async (context) => {
    if (!context.projectContext) {
      return [
        {
          name: 'Environment validation',
          status: 'skipped',
          message: 'Environment validation requires a valid GMK Launchpad project.',
        },
      ];
    }

    const { rootPath, metadata } = context.projectContext;

    if (metadata.projectType === 'web') {
      return [
        {
          name: 'Base environment',
          status: 'pass',
          message: 'No environment variables are required by the base web template.',
        },
      ];
    }

    const results: DiagnosticResult[] = [];

    const examplePath = path.join(rootPath, '.env.example');

    if (await fs.pathExists(examplePath)) {
      results.push({
        name: 'Environment template',
        status: 'pass',
        message: '.env.example found.',
      });
    } else {
      results.push({
        name: 'Environment template',
        status: 'warning',
        message: '.env.example was not found.',
        suggestion:
          'Restore the environment template so required configuration remains documented.',
      });
    }

    const environmentPath = path.join(rootPath, '.env');

    if (!(await fs.pathExists(environmentPath))) {
      results.push({
        name: 'Environment file',
        status: 'warning',
        message: '.env was not found.',
        suggestion: 'Create .env from .env.example before running the API locally.',
      });

      for (const variable of API_REQUIRED_ENVIRONMENT_VARIABLES) {
        results.push({
          name: variable,
          status: 'skipped',
          message: 'Variable validation was skipped because .env is missing.',
        });
      }

      return results;
    }

    results.push({
      name: 'Environment file',
      status: 'pass',
      message: '.env found.',
    });

    let environmentValues;

    try {
      environmentValues = await readEnvironmentFile(environmentPath);
    } catch {
      results.push({
        name: 'Environment parsing',
        status: 'error',
        message: '.env could not be read.',
        suggestion: 'Verify that .env is a readable text file.',
      });

      return results;
    }

    results.push({
      name: 'Environment parsing',
      status: 'pass',
      message: '.env was read successfully.',
    });

    for (const variable of API_REQUIRED_ENVIRONMENT_VARIABLES) {
      if (hasEnvironmentValue(environmentValues, variable)) {
        results.push({
          name: variable,
          status: 'pass',
          message: `${variable} is configured.`,
        });
      } else {
        results.push({
          name: variable,
          status: 'error',
          message: `${variable} is missing or empty.`,
          suggestion: `Configure ${variable} in .env.`,
        });
      }
    }

    return results;
  },
};

export default environmentDiagnostic;
