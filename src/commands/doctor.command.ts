import { Command } from 'commander';
import dependencyDiagnostic from '../diagnostics/dependency.diagnostic.js';
import { renderDoctorReport } from '../diagnostics/doctor.renderer.js';
import { hasDiagnosticErrors, runDoctorDiagnostics } from '../diagnostics/doctor.runner.js';
import environmentDiagnostic from '../diagnostics/environment.diagnostic.js';
import featureDiagnostic from '../diagnostics/feature.diagnostic.js';
import projectDiagnostic from '../diagnostics/project.diagnostic.js';
import runtimeDiagnostic from '../diagnostics/runtime.diagnostic.js';
import structureDiagnostic from '../diagnostics/structure.diagnostic.js';
import projectContextService from '../shared/project/project-context.service.js';
import type { DoctorContext } from '../types/diagnostic.types.js';

const createDoctorContext = async (): Promise<DoctorContext> => {
  const currentDirectory = process.cwd();

  try {
    const projectContext = await projectContextService.getProjectContext();

    return {
      currentDirectory,
      projectContext,
    };
  } catch (error) {
    return {
      currentDirectory,
      projectContextError:
        error instanceof Error ? error.message : 'Unable to resolve the GMK Launchpad project.',
    };
  }
};

export const doctorCommand = new Command('doctor')
  .description('Diagnose a GMK Launchpad project')
  .action(async () => {
    const context = await createDoctorContext();

    const report = await runDoctorDiagnostics(context, [
      projectDiagnostic,
      runtimeDiagnostic,
      dependencyDiagnostic,
      structureDiagnostic,
      environmentDiagnostic,
      featureDiagnostic,
    ]);

    renderDoctorReport(report);

    if (hasDiagnosticErrors(report)) {
      process.exitCode = 1;
    }
  });
