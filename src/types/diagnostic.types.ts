import type { LaunchpadProjectContext } from './launchpad-metadata.types.js';

export type DiagnosticStatus = 'pass' | 'warning' | 'error' | 'skipped';

export interface DiagnosticResult {
  name: string;
  status: DiagnosticStatus;
  message?: string;
  suggestion?: string;
}

export interface DiagnosticSection {
  name: string;
  results: DiagnosticResult[];
}

export interface DiagnosticSummary {
  passed: number;
  warnings: number;
  errors: number;
  skipped: number;
}

export interface DoctorReport {
  sections: DiagnosticSection[];
  summary: DiagnosticSummary;
}

export interface DoctorContext {
  currentDirectory: string;
  projectContext?: LaunchpadProjectContext;
  projectContextError?: string;
}
