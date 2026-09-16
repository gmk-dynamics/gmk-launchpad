import { select } from '@inquirer/prompts';
import { FEATURE_DEFINITIONS } from '../shared/constants/feature.constants.js';
import type {
  LaunchpadFeature,
  LaunchpadProjectContext,
} from '../types/launchpad-metadata.types.js';

export const promptAddFeature = async (
  context: LaunchpadProjectContext,
): Promise<LaunchpadFeature> => {
  const availableFeatures = Object.entries(FEATURE_DEFINITIONS)
    .filter(([, definition]) => definition.projectTypes.includes(context.metadata.projectType))
    .filter(([feature]) => !context.metadata.features.includes(feature as LaunchpadFeature));

  if (availableFeatures.length === 0) {
    throw new Error('No additional features are available for this project.');
  }

  return select<LaunchpadFeature>({
    message: 'Feature to add:',
    choices: availableFeatures.map(([feature, definition]) => ({
      name: `${definition.name} — ${definition.description}`,
      value: feature as LaunchpadFeature,
    })),
    theme: {
      prefix: {
        idle: '◆ ',
        done: '✔ ',
      },
    },
  });
};
