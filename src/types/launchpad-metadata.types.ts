export type LaunchpadProjectType = 'web' | 'api';

export type LaunchpadFeature = 'docker' | 'cognito' | 'lambda';

export interface LaunchpadMetadata {
  schemaVersion: number;
  launchpadVersion: string;
  projectType: LaunchpadProjectType;
  features: LaunchpadFeature[];
}
