import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ora from 'ora';

import {
  createProjectDirectories,
  ensureDirectoryDoesNotExist,
} from '../shared/filesystem/project.filesystem.js';
import { copyTemplate, type TemplateVariables } from '../shared/filesystem/template.filesystem.js';

import chalk from 'chalk';
import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import { WEB_DIRECTORIES } from '../shared/constants/web-template.constants.js';
import type { CreateProjectConfig } from '../types/project.types.js';

const getWebTemplatePath = (): string => {
  return fileURLToPath(new URL('../templates/web', import.meta.url));
};

export const generateWebProject = async (config: CreateProjectConfig): Promise<void> => {
  const destinationPath = path.resolve(process.cwd(), config.webDirectoryName);

  await ensureDirectoryDoesNotExist(destinationPath);

  const spinner = ora(`Creating ${config.webDirectoryName}`).start();

  try {
    const variables: TemplateVariables = {
      projectName: config.projectName,
      projectSlug: config.projectSlug,
      packageName: config.webDirectoryName,
      launchpadVersion: CLI_VERSION,
    };

    await copyTemplate(getWebTemplatePath(), destinationPath, variables);

    await createProjectDirectories(destinationPath, WEB_DIRECTORIES);

    spinner.stopAndPersist({
      symbol: chalk.green('✔'),
      text: `  Created ${config.webDirectoryName}`,
    });
  } catch (error) {
    spinner.stopAndPersist({
      symbol: chalk.red('✖'),
      text: `  Failed to create ${config.webDirectoryName}`,
    });

    throw error;
  }
};
