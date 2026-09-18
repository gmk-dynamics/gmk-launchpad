import { input, select } from '@inquirer/prompts';
import {
  WEB_COMPONENT_CATEGORIES,
  type WebComponentCategory,
} from '../shared/constants/generator.constants.js';
import type {
  ApiGeneratorType,
  GeneratorType,
  WebGeneratorType,
} from '../types/generator.types.js';
import type { LaunchpadProjectType } from '../types/launchpad-metadata.types.js';

const API_GENERATOR_CHOICES: {
  name: string;
  value: ApiGeneratorType;
}[] = [
  {
    name: 'Module',
    value: 'module',
  },
  {
    name: 'Middleware',
    value: 'middleware',
  },
  {
    name: 'Service',
    value: 'service',
  },
];

const WEB_GENERATOR_CHOICES: {
  name: string;
  value: WebGeneratorType;
}[] = [
  {
    name: 'Component',
    value: 'component',
  },
  {
    name: 'Page',
    value: 'page',
  },
  {
    name: 'Service',
    value: 'service',
  },
  {
    name: 'Context / Provider / Hook',
    value: 'context',
  },
];

const COMPONENT_CATEGORY_LABELS: Record<WebComponentCategory, string> = {
  ui: 'UI',
  layout: 'Layout',
  navigation: 'Navigation',
  modals: 'Modals',
  forms: 'Forms',
};

export const promptGeneratorType = async (
  projectType: LaunchpadProjectType,
): Promise<GeneratorType> => {
  const choices = projectType === 'api' ? API_GENERATOR_CHOICES : WEB_GENERATOR_CHOICES;

  return select({
    message: 'What would you like to generate?',
    choices,
    theme: {
      prefix: {
        idle: '◆ ',
        done: '✔ ',
      },
    },
  });
};

export const promptGeneratorName = async (type: GeneratorType): Promise<string> => {
  return input({
    message: `${getGeneratorLabel(type)} name:`,
    validate: (value) => {
      if (!value.trim()) {
        return 'Name is required.';
      }

      return true;
    },
    theme: {
      prefix: {
        idle: '◆ ',
        done: '✔ ',
      },
    },
  });
};

export const promptComponentCategory = async (): Promise<WebComponentCategory> => {
  return select({
    message: 'Component type:',
    choices: WEB_COMPONENT_CATEGORIES.map((category) => ({
      name: COMPONENT_CATEGORY_LABELS[category],
      value: category,
    })),
    theme: {
      prefix: {
        idle: '◆ ',
        done: '✔ ',
      },
    },
  });
};

const getGeneratorLabel = (type: GeneratorType): string => {
  switch (type) {
    case 'module':
      return 'Module';

    case 'middleware':
      return 'Middleware';

    case 'service':
      return 'Service';

    case 'component':
      return 'Component';

    case 'page':
      return 'Page';

    case 'context':
      return 'Context';

    default:
      return 'Artifact';
  }
};
