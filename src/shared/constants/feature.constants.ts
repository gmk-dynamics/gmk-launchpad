import type {
  LaunchpadFeature,
  LaunchpadProjectType,
} from '../../types/launchpad-metadata.types.js';

interface FeatureDefinition {
  name: string;
  description: string;
  projectTypes: LaunchpadProjectType[];
}

export const FEATURE_DEFINITIONS: Record<LaunchpadFeature, FeatureDefinition> = {
  docker: {
    name: 'Docker',
    description: 'Add Docker configuration',
    projectTypes: ['web', 'api'],
  },
  cognito: {
    name: 'AWS Cognito',
    description: 'Add AWS Cognito authentication',
    projectTypes: ['web', 'api'],
  },
  lambda: {
    name: 'AWS Lambda',
    description: 'Add AWS Lambda deployment support',
    projectTypes: ['api'],
  },
};

export const LAUNCHPAD_FEATURES = Object.keys(FEATURE_DEFINITIONS) as LaunchpadFeature[];

export const isLaunchpadFeature = (value: unknown): value is LaunchpadFeature => {
  return typeof value === 'string' && LAUNCHPAD_FEATURES.includes(value as LaunchpadFeature);
};
