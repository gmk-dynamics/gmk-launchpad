import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import { generateTemplateFile } from './template-file.generator.js';

import type { GeneratorName } from '../types/generator.types.js';
import type { LaunchpadProjectContext } from '../types/launchpad-metadata.types.js';

const getMiddlewareTemplatePath = (): string => {
  return fileURLToPath(new URL('../templates/generators/api/middleware', import.meta.url));
};

export const generateMiddleware = async (
  context: LaunchpadProjectContext,
  middlewareName: GeneratorName,
): Promise<string> => {
  if (context.metadata.projectType !== 'api') {
    throw new Error('Middleware can only be generated in API projects.');
  }

  const destinationPath = path.join(
    context.rootPath,
    'src',
    'middlewares',
    `${middlewareName.slug}.middleware.ts`,
  );

  return generateTemplateFile({
    templatePath: getMiddlewareTemplatePath(),
    templateFilename: 'middleware.template',
    destinationPath,
    variables: {
      projectName: path.basename(context.rootPath),
      projectSlug: path.basename(context.rootPath),
      packageName: path.basename(context.rootPath),
      launchpadVersion: CLI_VERSION,

      artifactName: middlewareName.slug,
      artifactCamelName: middlewareName.camelCase,
      artifactPascalName: middlewareName.pascalCase,
      artifactConstantName: middlewareName.constantCase,
    },
  });
};
