import type {
  DiagnosticResult,
  DiagnosticSection,
  DiagnosticSummary,
  DoctorContext,
  DoctorReport,
} from '../types/diagnostic.types.js';

export interface DoctorDiagnostic {
  section: string;
  run: (context: DoctorContext) => Promise<DiagnosticResult[]>;
}

const createSummary = (sections: DiagnosticSection[]): DiagnosticSummary => {
  const summary: DiagnosticSummary = {
    passed: 0,
    warnings: 0,
    errors: 0,
    skipped: 0,
  };

  for (const section of sections) {
    for (const result of section.results) {
      switch (result.status) {
        case 'pass':
          summary.passed += 1;
          break;

        case 'warning':
          summary.warnings += 1;
          break;

        case 'error':
          summary.errors += 1;
          break;

        case 'skipped':
          summary.skipped += 1;
          break;
      }
    }
  }

  return summary;
};

export const runDoctorDiagnostics = async (
  context: DoctorContext,
  diagnostics: DoctorDiagnostic[],
): Promise<DoctorReport> => {
  const sections: DiagnosticSection[] = [];

  for (const diagnostic of diagnostics) {
    try {
      const results = await diagnostic.run(context);

      sections.push({
        name: diagnostic.section,
        results,
      });
    } catch (error) {
      sections.push({
        name: diagnostic.section,
        results: [
          {
            name: 'Diagnostic execution',
            status: 'error',
            message:
              error instanceof Error ? error.message : 'An unexpected diagnostic error occurred.',
          },
        ],
      });
    }
  }

  return {
    sections,
    summary: createSummary(sections),
  };
};

export const hasDiagnosticErrors = (report: DoctorReport): boolean => {
  return report.summary.errors > 0;
};
