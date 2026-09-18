import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import { generateTemplateFile } from './template-file.generator.js';

import type { GeneratorName } from '../types/generator.types.js';
import type { LaunchpadProjectContext } from '../types/launchpad-metadata.types.js';

const getServiceTemplatePath = (
  projectType: LaunchpadProjectContext['metadata']['projectType'],
): string => {
  return fileURLToPath(new URL(`../templates/generators/${projectType}/service`, import.meta.url));
};

export const generateService = async (
  context: LaunchpadProjectContext,
  serviceName: GeneratorName,
): Promise<string> => {
  const destinationPath =
    context.metadata.projectType === 'api'
      ? path.join(context.rootPath, 'src', 'shared', 'services', `${serviceName.slug}.service.ts`)
      : path.join(context.rootPath, 'src', 'services', `${serviceName.slug}.service.ts`);

  return generateTemplateFile({
    templatePath: getServiceTemplatePath(context.metadata.projectType),
    templateFilename: 'service.template',
    destinationPath,
    variables: {
      projectName: path.basename(context.rootPath),
      projectSlug: path.basename(context.rootPath),
      packageName: path.basename(context.rootPath),
      launchpadVersion: CLI_VERSION,

      artifactName: serviceName.slug,
      artifactCamelName: serviceName.camelCase,
      artifactPascalName: serviceName.pascalCase,
      artifactConstantName: serviceName.constantCase,
    },
  });
};
