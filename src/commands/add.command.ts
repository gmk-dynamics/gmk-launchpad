import { Command } from 'commander';
import { installFeature } from '../features/feature.installer.js';
import { promptAddFeature } from '../prompts/add.prompt.js';
import { FEATURE_DEFINITIONS, isLaunchpadFeature } from '../shared/constants/feature.constants.js';
import { printInfo, printSection, printSuccess } from '../shared/logger/console.logger.js';
import projectContextService from '../shared/project/project-context.service.js';
import type { LaunchpadFeature } from '../types/launchpad-metadata.types.js';

const resolveFeature = (requestedFeature: string): LaunchpadFeature => {
  const normalizedFeature = requestedFeature.trim().toLowerCase();

  if (!isLaunchpadFeature(normalizedFeature)) {
    throw new Error(`Unknown Launchpad feature: ${requestedFeature}`);
  }

  return normalizedFeature;
};

export const addCommand = new Command('add')
  .description('Add a feature to a GMK Launchpad project')
  .argument('[feature]', 'Feature to add')
  .action(async (requestedFeature?: string) => {
    const context = await projectContextService.getProjectContext();

    const feature = requestedFeature
      ? resolveFeature(requestedFeature)
      : await promptAddFeature(context);

    const definition = FEATURE_DEFINITIONS[feature];

    if (!definition.projectTypes.includes(context.metadata.projectType)) {
      throw new Error(
        `${definition.name} is not supported for ${context.metadata.projectType} projects.`,
      );
    }

    if (projectContextService.hasFeature(context, feature)) {
      throw new Error(`${definition.name} is already installed.`);
    }

    printSection('Feature Configuration');

    printInfo('Project', context.metadata.projectType === 'web' ? 'Web' : 'API');
    printInfo('Feature', definition.name);
    printInfo('Root', context.rootPath);

    await installFeature(feature, context);

    printSuccess(`${definition.name} added successfully.`);
  });
