import { Command } from 'commander';
import { generateWebProject } from '../generators/web.generator.js';
import { promptCreateProject } from '../prompts/create.prompt.js';
import {
  printInfo,
  printNextSteps,
  printSection,
  printSuccess,
} from '../shared/logger/console.logger.js';
import { normalizeProjectName } from '../shared/utils/project-name.utils.js';
import type { CreateProjectConfig } from '../types/project.types.js';

const getProjectTypeLabel = (projectType: CreateProjectConfig['projectType']): string => {
  switch (projectType) {
    case 'react-vite':
      return 'React + Vite';

    case 'express-api':
      return 'Express API';

    case 'full-stack':
      return 'Full Stack';
  }
};

export const createCommand = new Command('create')
  .description('Create a new GMK project')
  .action(async () => {
    const answers = await promptCreateProject();

    const projectSlug = normalizeProjectName(answers.projectName);

    const config: CreateProjectConfig = {
      projectName: answers.projectName,
      projectSlug,
      projectType: answers.projectType,
      webDirectoryName: `${projectSlug}-web`,
      apiDirectoryName: `${projectSlug}-api`,
    };

    printSection('Project Configuration');

    printInfo('Name', config.projectName);
    printInfo('Type', getProjectTypeLabel(config.projectType));

    if (config.projectType === 'react-vite' || config.projectType === 'full-stack') {
      printInfo('Web', config.webDirectoryName);

      if (config.projectType === 'react-vite') {
        await generateWebProject(config);

        printSuccess(`${config.projectName} created successfully.`);

        printNextSteps([`cd ${config.webDirectoryName}`, 'npm install', 'npm run dev']);

        return;
      }

      printSuccess('Project configuration ready.');
    }

    if (config.projectType === 'express-api' || config.projectType === 'full-stack') {
      printInfo('API', config.apiDirectoryName);
    }

    printSuccess('Project configuration ready.');
  });
