import projectContextService from '../shared/project/project-context.service.js';
import type {
  LaunchpadFeature,
  LaunchpadProjectContext,
} from '../types/launchpad-metadata.types.js';
import { installCognitoFeature } from './cognito/cognito.installer.js';
import { installDockerFeature } from './docker/docker.installer.js';
import { installLambdaFeature } from './lambda/lambda.installer.js';

type FeatureInstaller = (context: LaunchpadProjectContext) => Promise<void>;

const FEATURE_INSTALLERS: Record<LaunchpadFeature, FeatureInstaller> = {
  docker: installDockerFeature,
  cognito: installCognitoFeature,
  lambda: installLambdaFeature,
};

export const installFeature = async (
  feature: LaunchpadFeature,
  context: LaunchpadProjectContext,
): Promise<void> => {
  const installer = FEATURE_INSTALLERS[feature];

  await installer(context);

  await projectContextService.addFeature(context, feature);
};
