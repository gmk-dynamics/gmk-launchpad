import { Command } from 'commander';
import { generateApiProject } from '../generators/api.generator.js';
import { generateFullStackProject } from '../generators/full-stack.generator.js';
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

    if (config.projectType === 'react-vite') {
      printInfo('Web', config.webDirectoryName);

      if (config.projectType === 'react-vite') {
        await generateWebProject(config);

        printSuccess(`${config.projectName} created successfully.`);

        printNextSteps([
          {
            commands: [`cd ${config.webDirectoryName}`, 'npm install', 'npm run dev'],
          },
        ]);

        return;
      }

      printSuccess('Project configuration ready.');
    }

    if (config.projectType === 'express-api') {
      printInfo('API', config.apiDirectoryName);

      await generateApiProject(config);

      printSuccess(`${config.projectName} API created successfully.`);

      printNextSteps([
        {
          commands: [
            `cd ${config.apiDirectoryName}`,
            'npm install',
            'Create .env from .env.example',
            'npm run dev',
          ],
        },
      ]);

      return;
    }

    if (config.projectType === 'full-stack') {
      await generateFullStackProject(config);

      printSuccess(`${config.projectName} full-stack project created successfully.`);

      printNextSteps([
        {
          title: 'Web',
          commands: [`cd ${config.webDirectoryName}`, 'npm install', 'npm run dev'],
        },
        {
          title: 'API',
          commands: [
            `cd ${config.apiDirectoryName}`,
            'npm install',
            'Create .env from .env.example',
            'npm run dev',
          ],
        },
      ]);

      return;
    }

    printSuccess('Project configuration ready.');
  });
