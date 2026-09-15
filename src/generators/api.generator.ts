import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import { API_DIRECTORIES } from '../shared/constants/api-template.constants.js';
import {
  createProjectDirectories,
  ensureDirectoryDoesNotExist,
} from '../shared/filesystem/project.filesystem.js';
import { copyTemplate, type TemplateVariables } from '../shared/filesystem/template.filesystem.js';
import type { CreateProjectConfig } from '../types/project.types.js';

const getApiTemplatePath = (): string => {
  return fileURLToPath(new URL('../templates/api', import.meta.url));
};

export const generateApiProject = async (config: CreateProjectConfig): Promise<void> => {
  const destinationPath = path.resolve(process.cwd(), config.apiDirectoryName);

  await ensureDirectoryDoesNotExist(destinationPath);

  const spinner = ora(`Creating ${config.apiDirectoryName}`).start();

  try {
    const variables: TemplateVariables = {
      projectName: config.projectName,
      projectSlug: config.projectSlug,
      packageName: config.apiDirectoryName,
    };

    await copyTemplate(getApiTemplatePath(), destinationPath, variables);

    await createProjectDirectories(destinationPath, API_DIRECTORIES);

    spinner.succeed(`Created ${config.apiDirectoryName}`);
  } catch (error) {
    spinner.fail(`Failed to create ${config.apiDirectoryName}`);

    throw error;
  }
};
