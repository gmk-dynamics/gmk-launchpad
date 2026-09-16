import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import { copyTemplate, type TemplateVariables } from '../shared/filesystem/template.filesystem.js';

import type { LaunchpadProjectContext } from '../types/launchpad-metadata.types.js';
import type { ModuleName } from '../types/module.types.js';

const MODULE_FILE_SUFFIXES = [
  'constants',
  'controller',
  'mapper',
  'repository',
  'routes',
  'service',
  'types',
  'validation',
] as const;

const getModuleTemplatePath = (): string => {
  return fileURLToPath(new URL('../templates/module', import.meta.url));
};

const renameModuleFiles = async (modulePath: string, moduleName: ModuleName): Promise<void> => {
  for (const suffix of MODULE_FILE_SUFFIXES) {
    const sourcePath = path.join(modulePath, `module.${suffix}.template`);

    const destinationPath = path.join(modulePath, `${moduleName.slug}.${suffix}.ts`);

    await fs.move(sourcePath, destinationPath);
  }

  await fs.move(path.join(modulePath, 'index.template'), path.join(modulePath, 'index.ts'));
};

export const generateModule = async (
  context: LaunchpadProjectContext,
  moduleName: ModuleName,
): Promise<string> => {
  if (context.metadata.projectType !== 'api') {
    throw new Error('Modules can only be generated in API projects.');
  }

  const modulesPath = path.join(context.rootPath, 'src', 'modules');

  const targetPath = path.join(modulesPath, moduleName.slug);

  if (await fs.pathExists(targetPath)) {
    throw new Error(`Module already exists: ${targetPath}`);
  }

  await fs.ensureDir(modulesPath);

  const temporaryPath = path.join(
    modulesPath,
    `.gmk-${moduleName.slug}-${process.pid}-${Date.now()}`,
  );

  const variables: TemplateVariables = {
    projectName: path.basename(context.rootPath),
    projectSlug: path.basename(context.rootPath),
    packageName: path.basename(context.rootPath),
    launchpadVersion: CLI_VERSION,
    moduleName: moduleName.slug,
    moduleCamelName: moduleName.camelCase,
    modulePascalName: moduleName.pascalCase,
    moduleConstantName: moduleName.constantCase,
  };

  try {
    await copyTemplate(getModuleTemplatePath(), temporaryPath, variables);

    await renameModuleFiles(temporaryPath, moduleName);

    await fs.move(temporaryPath, targetPath);
  } catch (error) {
    await fs.remove(temporaryPath);
    throw error;
  }

  return targetPath;
};
