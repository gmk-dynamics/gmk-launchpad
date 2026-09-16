import { input, select } from '@inquirer/prompts';
import { normalizeProjectName } from '../shared/utils/project-name.utils.js';

import type { ProjectType } from '../types/project.types.js';

const promptTheme = {
  prefix: {
    idle: '◆ ',
    done: '✔ ',
  },
};

export const promptCreateProject = async () => {
  const projectName = await input({
    message: 'Project name:',
    theme: promptTheme,
    validate: (value) => {
      if (!value.trim()) {
        return 'Project name is required.';
      }

      if (!normalizeProjectName(value)) {
        return 'Project name must contain at least one letter or number.';
      }

      return true;
    },
  });

  const projectType = await select<ProjectType>({
    message: 'Project type:',
    theme: promptTheme,
    choices: [
      {
        name: 'React + Vite',
        value: 'react-vite',
      },
      {
        name: 'Express API',
        value: 'express-api',
      },
      {
        name: 'Full Stack',
        value: 'full-stack',
      },
    ],
  });

  return {
    projectName: projectName.trim(),
    projectType,
  };
};
