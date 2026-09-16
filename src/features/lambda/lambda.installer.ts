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
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface ValidProjectPackageJson extends ProjectPackageJson {
  name: string;
}

const LAMBDA_SCRIPTS = {
  'lambda:package': 'npm run build && serverless package',
  'lambda:deploy': 'npm run build && serverless deploy',
  'lambda:remove': 'serverless remove',
} as const;

const getLambdaTemplatePath = (): string => {
  return fileURLToPath(new URL('../../templates/features/lambda/api', import.meta.url));
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

const validateInstallation = async (
  context: LaunchpadProjectContext,
  packageJson: ValidProjectPackageJson,
): Promise<void> => {
  const serverlessPath = path.join(context.rootPath, 'serverless.yml');

  if (await fs.pathExists(serverlessPath)) {
    throw new Error(`Serverless configuration already exists: ${serverlessPath}`);
  }

  const scripts = packageJson.scripts ?? {};

  for (const scriptName of Object.keys(LAMBDA_SCRIPTS)) {
    if (scripts[scriptName]) {
      throw new Error(`Lambda script already exists in package.json: ${scriptName}`);
    }
  }
};

const updatePackageJson = async (
  context: LaunchpadProjectContext,
  packageJson: ValidProjectPackageJson,
): Promise<void> => {
  const packageJsonPath = path.join(context.rootPath, 'package.json');

  packageJson.scripts = {
    ...packageJson.scripts,
    ...LAMBDA_SCRIPTS,
  };

  const alreadyHasServerless =
    packageJson.dependencies?.serverless || packageJson.devDependencies?.serverless;

  if (!alreadyHasServerless) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      serverless: '^4.0.0',
    };
  }

  await fs.writeJson(packageJsonPath, packageJson, {
    spaces: 2,
  });

  await fs.appendFile(packageJsonPath, '\n');
};

const updateGitignore = async (context: LaunchpadProjectContext): Promise<void> => {
  const gitignorePath = path.join(context.rootPath, '.gitignore');

  const content = await fs.readFile(gitignorePath, 'utf8');

  if (content.split(/\r?\n/).some((line) => line.trim() === '.serverless/')) {
    return;
  }

  const separator = content.endsWith('\n') ? '' : '\n';

  await fs.appendFile(gitignorePath, `${separator}\n# Serverless\n.serverless/\n`);
};

export const installLambdaFeature = async (context: LaunchpadProjectContext): Promise<void> => {
  if (context.metadata.projectType !== 'api') {
    throw new Error('AWS Lambda is only supported for API projects.');
  }

  const packageJson = await readPackageJson(context);

  await validateInstallation(context, packageJson);

  const variables: TemplateVariables = {
    projectName: packageJson.name,
    projectSlug: packageJson.name,
    packageName: packageJson.name,
    launchpadVersion: CLI_VERSION,
  };

  await copyTemplate(getLambdaTemplatePath(), context.rootPath, variables);

  await updatePackageJson(context, packageJson);

  await updateGitignore(context);
};
