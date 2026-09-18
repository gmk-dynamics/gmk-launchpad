import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import type { DiagnosticResult } from '../types/diagnostic.types.js';
import type { DoctorDiagnostic } from './doctor.runner.js';

const execFileAsync = promisify(execFile);

const MINIMUM_NODE_MAJOR_VERSION = 20;

const getNpmVersion = async (): Promise<string> => {
  const executable = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  const { stdout } = await execFileAsync(executable, ['--version']);

  return stdout.trim();
};

const runtimeDiagnostic: DoctorDiagnostic = {
  section: 'Runtime',

  run: async () => {
    const results: DiagnosticResult[] = [];

    const nodeVersion = process.versions.node;

    const nodeMajorVersion = Number(nodeVersion.split('.')[0]);

    if (Number.isFinite(nodeMajorVersion) && nodeMajorVersion >= MINIMUM_NODE_MAJOR_VERSION) {
      results.push({
        name: 'Node.js',
        status: 'pass',
        message: `Node.js ${nodeVersion} is supported.`,
      });
    } else {
      results.push({
        name: 'Node.js',
        status: 'error',
        message: `Node.js ${nodeVersion} is not supported.`,
        suggestion: `Install Node.js ${MINIMUM_NODE_MAJOR_VERSION} or newer.`,
      });
    }

    try {
      const npmVersion = await getNpmVersion();

      results.push({
        name: 'npm',
        status: 'pass',
        message: `npm ${npmVersion} is available.`,
      });
    } catch {
      results.push({
        name: 'npm',
        status: 'error',
        message: 'npm could not be executed.',
        suggestion: 'Verify that npm is installed and available on your PATH.',
      });
    }

    return results;
  },
};

export default runtimeDiagnostic;
