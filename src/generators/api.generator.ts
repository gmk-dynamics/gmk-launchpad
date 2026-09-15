import chalk from 'chalk';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ora from 'ora';
import { API_DIRECTORIES } from '../shared/constants/api-template.constants.js';
import { CLI_VERSION } from '../shared/constants/branding.constants.js';
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
      launchpadVersion: CLI_VERSION,
    };

    await copyTemplate(getApiTemplatePath(), destinationPath, variables);

    await createProjectDirectories(destinationPath, API_DIRECTORIES);

    spinner.stopAndPersist({
      symbol: chalk.green('✔'),
      text: `  Created ${config.apiDirectoryName}`,
    });
  } catch (error) {
    spinner.stopAndPersist({
      symbol: chalk.red('✖'),
      text: `  Failed to create ${config.apiDirectoryName}`,
    });

    throw error;
  }
};
