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
}

interface ValidProjectPackageJson extends ProjectPackageJson {
  name: string;
}

const getDockerTemplatePath = (
  projectType: LaunchpadProjectContext['metadata']['projectType'],
): string => {
  return fileURLToPath(new URL(`../../templates/features/docker/${projectType}`, import.meta.url));
};

const getTargetFiles = (context: LaunchpadProjectContext): string[] => {
  const files = [
    path.join(context.rootPath, 'Dockerfile'),
    path.join(context.rootPath, '.dockerignore'),
  ];

  if (context.metadata.projectType === 'web') {
    files.push(path.join(context.rootPath, 'nginx.conf'));
  }

  if (context.metadata.projectType === 'api') {
    files.push(
      path.join(context.rootPath, 'docker-compose.yml'),
      path.join(context.rootPath, '.env.docker.example'),
    );
  }

  return files;
};

const getDockerScriptNames = (context: LaunchpadProjectContext): string[] => {
  const scripts = ['docker:build', 'docker:run'];

  if (context.metadata.projectType === 'api') {
    scripts.push('docker:up', 'docker:down', 'docker:logs', 'docker:reset');
  }

  return scripts;
};

const getProjectSlug = (
  packageName: string,
  projectType: LaunchpadProjectContext['metadata']['projectType'],
): string => {
  const suffix = projectType === 'web' ? '-web' : '-api';

  return packageName.endsWith(suffix) ? packageName.slice(0, -suffix.length) : packageName;
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

const ensureDockerFilesDoNotExist = async (context: LaunchpadProjectContext): Promise<void> => {
  const targetFiles = getTargetFiles(context);

  for (const targetFile of targetFiles) {
    if (await fs.pathExists(targetFile)) {
      throw new Error(`Docker configuration already exists: ${targetFile}`);
    }
  }
};

const ensureDockerScriptsDoNotExist = (
  context: LaunchpadProjectContext,
  packageJson: ValidProjectPackageJson,
): void => {
  const scripts = packageJson.scripts ?? {};

  for (const scriptName of getDockerScriptNames(context)) {
    if (scripts[scriptName]) {
      throw new Error(`Docker script already exists in package.json: ${scriptName}`);
    }
  }
};

const updatePackageScripts = async (
  context: LaunchpadProjectContext,
  packageJson: ValidProjectPackageJson,
): Promise<void> => {
  const packageJsonPath = path.join(context.rootPath, 'package.json');
  const packageName = packageJson.name;

  const scripts = packageJson.scripts ?? {};

  scripts['docker:build'] = `docker build -t ${packageName} .`;

  if (context.metadata.projectType === 'web') {
    scripts['docker:run'] = `docker run --rm -p 8080:80 ${packageName}`;
  } else {
    scripts['docker:run'] = `docker run --rm -p 3000:3000 --env-file .env ${packageName}`;
    scripts['docker:up'] = 'docker compose --env-file .env.docker up -d --build';
    scripts['docker:down'] = 'docker compose --env-file .env.docker down';
    scripts['docker:logs'] = 'docker compose --env-file .env.docker logs -f';
    scripts['docker:reset'] = 'docker compose --env-file .env.docker down -v';
  }

  packageJson.scripts = scripts;

  await fs.writeJson(packageJsonPath, packageJson, {
    spaces: 2,
  });

  await fs.appendFile(packageJsonPath, '\n');
};

export const installDockerFeature = async (context: LaunchpadProjectContext): Promise<void> => {
  await ensureDockerFilesDoNotExist(context);

  const packageJson = await readPackageJson(context);

  ensureDockerScriptsDoNotExist(context, packageJson);

  const packageName = packageJson.name;

  const variables: TemplateVariables = {
    projectName: packageName,
    projectSlug: getProjectSlug(packageName, context.metadata.projectType),
    packageName,
    launchpadVersion: CLI_VERSION,
  };

  await copyTemplate(
    getDockerTemplatePath(context.metadata.projectType),
    context.rootPath,
    variables,
  );

  await updatePackageScripts(context, packageJson);
};
