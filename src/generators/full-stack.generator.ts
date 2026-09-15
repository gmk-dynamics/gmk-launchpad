import path from 'node:path';
import { ensureDirectoryDoesNotExist } from '../shared/filesystem/project.filesystem.js';
import type { CreateProjectConfig } from '../types/project.types.js';
import { generateApiProject } from './api.generator.js';
import { generateWebProject } from './web.generator.js';

export const generateFullStackProject = async (config: CreateProjectConfig): Promise<void> => {
  const webDestinationPath = path.resolve(process.cwd(), config.webDirectoryName);

  const apiDestinationPath = path.resolve(process.cwd(), config.apiDirectoryName);

  // Validate both destinations before creating either project.
  await ensureDirectoryDoesNotExist(webDestinationPath);
  await ensureDirectoryDoesNotExist(apiDestinationPath);

  await generateWebProject(config);
  await generateApiProject(config);
};
