import projectContextService from '../shared/project/project-context.service.js';
import { installDockerFeature } from './docker/docker.installer.js';

import type {
  LaunchpadFeature,
  LaunchpadProjectContext,
} from '../types/launchpad-metadata.types.js';

type FeatureInstaller = (context: LaunchpadProjectContext) => Promise<void>;

const FEATURE_INSTALLERS: Partial<Record<LaunchpadFeature, FeatureInstaller>> = {
  docker: installDockerFeature,
};

export const installFeature = async (
  feature: LaunchpadFeature,
  context: LaunchpadProjectContext,
): Promise<void> => {
  const installer = FEATURE_INSTALLERS[feature];

  if (!installer) {
    throw new Error(`The ${feature} installer has not been implemented yet.`);
  }

  await installer(context);

  await projectContextService.addFeature(context, feature);
};
