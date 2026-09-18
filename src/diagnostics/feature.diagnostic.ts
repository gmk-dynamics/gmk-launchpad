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

const API_COGNITO_ENVIRONMENT_VARIABLES = [
  'AWS_REGION',
  'COGNITO_USER_POOL_ID',
  'COGNITO_CLIENT_ID',
] as const;

const WEB_COGNITO_ENVIRONMENT_VARIABLES = [
  'VITE_AWS_REGION',
  'VITE_COGNITO_USER_POOL_ID',
  'VITE_COGNITO_CLIENT_ID',
] as const;

const validateVariables = (
  values: Record<string, string>,
  variables: readonly string[],
): DiagnosticResult[] => {
  return variables.map((variable) => {
    if (hasEnvironmentValue(values, variable)) {
      return {
        name: variable,
        status: 'pass',
        message: `${variable} is configured.`,
      };
    }

    return {
      name: variable,
      status: 'error',
      message: `${variable} is missing or empty.`,
      suggestion: `Configure ${variable} in .env.`,
    };
  });
};

const createSkippedVariableResults = (variables: readonly string[]): DiagnosticResult[] => {
  return variables.map((variable) => ({
    name: variable,
    status: 'skipped',
    message: 'Variable validation was skipped because .env is missing.',
  }));
};

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

    const results: DiagnosticResult[] = [];

    const hasCognito = metadata.features.includes('cognito');

    const requiredVariables: string[] =
      metadata.projectType === 'api' ? [...API_REQUIRED_ENVIRONMENT_VARIABLES] : [];

    if (hasCognito) {
      requiredVariables.push(
        ...(metadata.projectType === 'api'
          ? API_COGNITO_ENVIRONMENT_VARIABLES
          : WEB_COGNITO_ENVIRONMENT_VARIABLES),
      );
    }

    /*
     * Web projects without Cognito have no
     * required environment configuration.
     */

    if (metadata.projectType === 'web' && requiredVariables.length === 0) {
      return [
        {
          name: 'Base environment',
          status: 'pass',
          message: 'No environment variables are required by the base web template.',
        },
      ];
    }

    /*
     * Environment template
     */

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

    /*
     * Runtime environment file
     */

    const environmentPath = path.join(rootPath, '.env');

    if (!(await fs.pathExists(environmentPath))) {
      results.push({
        name: 'Environment file',
        status: 'warning',
        message: '.env was not found.',
        suggestion:
          metadata.projectType === 'api'
            ? 'Create .env from .env.example before running the API locally.'
            : 'Create .env from .env.example before using environment-dependent web features.',
      });

      results.push(...createSkippedVariableResults(requiredVariables));

      return results;
    }

    results.push({
      name: 'Environment file',
      status: 'pass',
      message: '.env found.',
    });

    /*
     * Parse
     */

    let environmentValues: Record<string, string>;

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

    /*
     * Required variables
     */

    results.push(...validateVariables(environmentValues, requiredVariables));

    return results;
  },
};

export default environmentDiagnostic;
