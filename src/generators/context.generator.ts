import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import type { GeneratorName } from '../types/generator.types.js';
import type { LaunchpadProjectContext } from '../types/launchpad-metadata.types.js';
import { generateTemplateFiles } from './template-files.generator.js';

const getContextTemplatePath = (): string => {
  return fileURLToPath(new URL('../templates/generators/web/context', import.meta.url));
};

export const generateContextBundle = async (
  context: LaunchpadProjectContext,
  contextName: GeneratorName,
): Promise<string[]> => {
  if (context.metadata.projectType !== 'web') {
    throw new Error('React context bundles can only be generated in web projects.');
  }

  return generateTemplateFiles({
    templatePath: getContextTemplatePath(),
    projectRoot: context.rootPath,
    files: [
      {
        templateFile: 'context.template',
        destinationPath: path.join(
          context.rootPath,
          'src',
          'shared',
          'contexts',
          `${contextName.slug}.context.ts`,
        ),
      },
      {
        templateFile: 'provider.template',
        destinationPath: path.join(
          context.rootPath,
          'src',
          'shared',
          'providers',
          `${contextName.slug}.provider.tsx`,
        ),
      },
      {
        templateFile: 'hook.template',
        destinationPath: path.join(
          context.rootPath,
          'src',
          'shared',
          'hooks',
          `use-${contextName.slug}.hook.ts`,
        ),
      },
    ],
    variables: {
      projectName: path.basename(context.rootPath),
      projectSlug: path.basename(context.rootPath),
      packageName: path.basename(context.rootPath),
      launchpadVersion: CLI_VERSION,

      artifactName: contextName.slug,
      artifactCamelName: contextName.camelCase,
      artifactPascalName: contextName.pascalCase,
      artifactConstantName: contextName.constantCase,
    },
  });
};
