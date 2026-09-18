import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import type { DiagnosticResult } from '../types/diagnostic.types.js';
import type { DoctorDiagnostic } from './doctor.runner.js';

const SUPPORTED_METADATA_SCHEMA_VERSION = 1;

const projectDiagnostic: DoctorDiagnostic = {
  section: 'Project',

  run: async (context) => {
    if (!context.projectContext) {
      return [
        {
          name: 'Launchpad metadata',
          status: 'error',
          message:
            context.projectContextError ??
            'Unable to identify this directory as a GMK Launchpad project.',
          suggestion: 'Run this command inside a project created by GMK Launchpad.',
        },
      ];
    }

    const { rootPath, metadata } = context.projectContext;

    const results: DiagnosticResult[] = [
      {
        name: 'Launchpad metadata',
        status: 'pass',
        message: '.gmk-launchpad.json found.',
      },
      {
        name: 'Project root',
        status: 'pass',
        message: rootPath,
      },
      {
        name: 'Project type',
        status: 'pass',
        message: metadata.projectType === 'api' ? 'API' : 'Web',
      },
    ];

    if (metadata.schemaVersion === SUPPORTED_METADATA_SCHEMA_VERSION) {
      results.push({
        name: 'Metadata schema',
        status: 'pass',
        message: `Schema version ${metadata.schemaVersion} is supported.`,
      });
    } else {
      results.push({
        name: 'Metadata schema',
        status: 'error',
        message: `Schema version ${metadata.schemaVersion} is not supported by this version of GMK Launchpad.`,
        suggestion:
          'Use a compatible Launchpad version. Automatic project migrations are not supported yet.',
      });
    }

    if (metadata.launchpadVersion === CLI_VERSION) {
      results.push({
        name: 'Launchpad version',
        status: 'pass',
        message: `Project and CLI are both version ${CLI_VERSION}.`,
      });
    } else {
      results.push({
        name: 'Launchpad version',
        status: 'warning',
        message: `Project was generated with Launchpad ${metadata.launchpadVersion}; current CLI is ${CLI_VERSION}.`,
        suggestion:
          'Older projects may remain compatible when their metadata schema is supported. Launchpad will not modify the project automatically.',
      });
    }

    return results;
  },
};

export default projectDiagnostic;
