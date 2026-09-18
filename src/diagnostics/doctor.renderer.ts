import type { DiagnosticResult, DoctorReport } from '../types/diagnostic.types.js';

const getStatusIcon = (status: DiagnosticResult['status']): string => {
  switch (status) {
    case 'pass':
      return '✔';

    case 'warning':
      return '⚠';

    case 'error':
      return '✖';

    case 'skipped':
      return '○';
  }
};

export const renderDoctorReport = (report: DoctorReport): void => {
  console.log('');
  console.log('◆ GMK Launchpad Doctor');

  for (const section of report.sections) {
    console.log('');
    console.log(section.name);

    for (const result of section.results) {
      const icon = getStatusIcon(result.status);

      console.log(`${icon}  ${result.name}`);

      if (result.message) {
        console.log(`  ${result.message}`);
      }

      if (result.suggestion) {
        console.log(`  Suggestion: ${result.suggestion}`);
      }
    }
  }

  console.log('');
  console.log('Result');

  console.log(`✔  ${report.summary.passed} passed`);

  if (report.summary.warnings > 0) {
    console.log(`⚠  ${report.summary.warnings} warnings`);
  }

  if (report.summary.errors > 0) {
    console.log(`✖  ${report.summary.errors} errors`);
  }

  if (report.summary.skipped > 0) {
    console.log(`○  ${report.summary.skipped} skipped`);
  }

  console.log('');
};
