import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLI_VERSION } from '../../shared/constants/branding.constants.js';
import {
  copyTemplate,
  type TemplateVariables,
} from '../../shared/filesystem/template.filesystem.js';
import type { LaunchpadProjectContext } from '../../types/launchpad-metadata.types.js';

interface ProjectPackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface ValidProjectPackageJson extends ProjectPackageJson {
  name: string;
}

interface CognitoTemplateFile {
  source: string[];
  destination: string[];
}

const getCognitoTemplatePath = (
  projectType: LaunchpadProjectContext['metadata']['projectType'],
): string => {
  return fileURLToPath(new URL(`../../templates/features/cognito/${projectType}`, import.meta.url));
};

const getTemplateFiles = (context: LaunchpadProjectContext): CognitoTemplateFile[] => {
  if (context.metadata.projectType === 'api') {
    return [
      {
        source: ['src', 'config', 'cognito.config.ts.template'],
        destination: ['src', 'config', 'cognito.config.ts'],
      },
      {
        source: ['src', 'middlewares', 'authentication.middleware.ts.template'],
        destination: ['src', 'middlewares', 'authentication.middleware.ts'],
      },
      {
        source: ['src', 'types', 'cognito-express.d.ts.template'],
        destination: ['src', 'types', 'cognito-express.d.ts'],
      },
    ];
  }

  return [
    {
      source: ['src', 'shared', 'constants', 'cognito.constants.ts.template'],
      destination: ['src', 'shared', 'constants', 'cognito.constants.ts'],
    },
    {
      source: ['src', 'services', 'auth.service.ts.template'],
      destination: ['src', 'services', 'auth.service.ts'],
    },
  ];
};

const getTargetFiles = (context: LaunchpadProjectContext): string[] => {
  return getTemplateFiles(context).map(({ destination }) =>
    path.join(context.rootPath, ...destination),
  );
};

const readPackageJson = async (
  context: LaunchpadProjectContext,
): Promise<ValidProjectPackageJson> => {
  const packageJsonPath = path.join(context.rootPath, 'package.json');

  const packageJson = (await fs.readJson(packageJsonPath)) as ProjectPackageJson;

  if (!packageJson.name) {
    throw new Error(`Package name is missing: ${packageJsonPath}`);
  }

  return packageJson as ValidProjectPackageJson;
};

const ensureTargetFilesDoNotExist = async (context: LaunchpadProjectContext): Promise<void> => {
  for (const targetFile of getTargetFiles(context)) {
    if (await fs.pathExists(targetFile)) {
      throw new Error(`Cognito configuration already exists: ${targetFile}`);
    }
  }
};

const renameTemplateFiles = async (context: LaunchpadProjectContext): Promise<void> => {
  for (const { source, destination } of getTemplateFiles(context)) {
    const sourcePath = path.join(context.rootPath, ...source);

    const destinationPath = path.join(context.rootPath, ...destination);

    await fs.ensureDir(path.dirname(destinationPath));

    await fs.move(sourcePath, destinationPath);
  }
};

const updatePackageJson = async (
  context: LaunchpadProjectContext,
  packageJson: ValidProjectPackageJson,
): Promise<void> => {
  const packageJsonPath = path.join(context.rootPath, 'package.json');

  const dependencies = packageJson.dependencies ?? {};

  if (context.metadata.projectType === 'api') {
    dependencies['aws-jwt-verify'] ??= '^5.0.0';
  } else {
    dependencies['amazon-cognito-identity-js'] ??= '^6.0.0';
  }

  packageJson.dependencies = dependencies;

  await fs.writeJson(packageJsonPath, packageJson, {
    spaces: 2,
  });

  await fs.appendFile(packageJsonPath, '\n');
};

const updateEnvironmentExample = async (context: LaunchpadProjectContext): Promise<void> => {
  const environmentPath = path.join(context.rootPath, '.env.example');

  let content = await fs.readFile(environmentPath, 'utf8');

  const variables =
    context.metadata.projectType === 'api'
      ? ['COGNITO_USER_POOL_ID=', 'COGNITO_CLIENT_ID=']
      : ['VITE_COGNITO_USER_POOL_ID=', 'VITE_COGNITO_CLIENT_ID='];

  const lines = content.split(/\r?\n/);

  const additions = variables.filter((entry) => {
    const key = entry.split('=')[0];

    return !lines.some((line) => line.startsWith(`${key}=`));
  });

  if (additions.length === 0) {
    return;
  }

  if (!content.endsWith('\n')) {
    content += '\n';
  }

  content += '\n# AWS Cognito\n';
  content += `${additions.join('\n')}\n`;

  await fs.writeFile(environmentPath, content, 'utf8');
};

export const installCognitoFeature = async (context: LaunchpadProjectContext): Promise<void> => {
  await ensureTargetFilesDoNotExist(context);

  const packageJson = await readPackageJson(context);

  const variables: TemplateVariables = {
    projectName: packageJson.name,
    projectSlug: packageJson.name,
    packageName: packageJson.name,
    launchpadVersion: CLI_VERSION,
  };

  await copyTemplate(
    getCognitoTemplatePath(context.metadata.projectType),
    context.rootPath,
    variables,
  );

  await renameTemplateFiles(context);

  await updatePackageJson(context, packageJson);

  await updateEnvironmentExample(context);
};
