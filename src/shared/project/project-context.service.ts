import fs from 'fs-extra';
import path from 'node:path';
import type {
  LaunchpadFeature,
  LaunchpadMetadata,
  LaunchpadProjectContext,
  LaunchpadProjectType,
} from '../../types/launchpad-metadata.types.js';
import { isLaunchpadFeature } from '../constants/feature.constants.js';
import {
  LAUNCHPAD_METADATA_FILENAME,
  LAUNCHPAD_METADATA_SCHEMA_VERSION,
} from '../constants/launchpad.constants.js';

const PROJECT_TYPES: LaunchpadProjectType[] = ['web', 'api'];

const isLaunchpadProjectType = (value: unknown): value is LaunchpadProjectType => {
  return typeof value === 'string' && PROJECT_TYPES.includes(value as LaunchpadProjectType);
};

const validateMetadata = (value: unknown): LaunchpadMetadata => {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Invalid GMK Launchpad metadata.');
  }

  const metadata = value as Record<string, unknown>;

  if (metadata.schemaVersion !== LAUNCHPAD_METADATA_SCHEMA_VERSION) {
    throw new Error(
      `Unsupported GMK Launchpad metadata schema version: ${String(metadata.schemaVersion)}`,
    );
  }

  if (typeof metadata.launchpadVersion !== 'string' || !metadata.launchpadVersion.trim()) {
    throw new Error('Invalid GMK Launchpad version in project metadata.');
  }

  if (!isLaunchpadProjectType(metadata.projectType)) {
    throw new Error('Invalid GMK Launchpad project type.');
  }

  if (!Array.isArray(metadata.features) || !metadata.features.every(isLaunchpadFeature)) {
    throw new Error('Invalid GMK Launchpad feature configuration.');
  }

  return {
    schemaVersion: metadata.schemaVersion,
    launchpadVersion: metadata.launchpadVersion,
    projectType: metadata.projectType,
    features: metadata.features,
  };
};

const findProjectRoot = async (startPath: string): Promise<string | null> => {
  let currentPath = path.resolve(startPath);

  while (true) {
    const metadataPath = path.join(currentPath, LAUNCHPAD_METADATA_FILENAME);

    if (await fs.pathExists(metadataPath)) {
      return currentPath;
    }

    const parentPath = path.dirname(currentPath);

    if (parentPath === currentPath) {
      return null;
    }

    currentPath = parentPath;
  }
};

const getProjectContext = async (startPath = process.cwd()): Promise<LaunchpadProjectContext> => {
  const rootPath = await findProjectRoot(startPath);

  if (!rootPath) {
    throw new Error('This directory is not part of a GMK Launchpad project.');
  }

  const metadataPath = path.join(rootPath, LAUNCHPAD_METADATA_FILENAME);

  let rawMetadata: string;

  try {
    rawMetadata = await fs.readFile(metadataPath, 'utf8');
  } catch {
    throw new Error(`Unable to read Launchpad metadata: ${metadataPath}`);
  }

  let parsedMetadata: unknown;

  try {
    parsedMetadata = JSON.parse(rawMetadata);
  } catch {
    throw new Error(`Invalid JSON in Launchpad metadata: ${metadataPath}`);
  }

  return {
    rootPath,
    metadataPath,
    metadata: validateMetadata(parsedMetadata),
  };
};

const hasFeature = (context: LaunchpadProjectContext, feature: LaunchpadFeature): boolean => {
  return context.metadata.features.includes(feature);
};

const addFeature = async (
  context: LaunchpadProjectContext,
  feature: LaunchpadFeature,
): Promise<void> => {
  if (hasFeature(context, feature)) {
    throw new Error(`Feature already installed: ${feature}`);
  }

  const metadata: LaunchpadMetadata = {
    ...context.metadata,
    features: [...context.metadata.features, feature],
  };

  await fs.writeJson(context.metadataPath, metadata, {
    spaces: 2,
  });

  await fs.appendFile(context.metadataPath, '\n');

  context.metadata = metadata;
};

const projectContextService = {
  findProjectRoot,
  getProjectContext,
  hasFeature,
  addFeature,
};

export default projectContextService;
