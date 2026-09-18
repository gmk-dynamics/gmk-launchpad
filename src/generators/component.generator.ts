import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import type { WebComponentCategory } from '../shared/constants/generator.constants.js';
import type { GeneratorName } from '../types/generator.types.js';
import type { LaunchpadProjectContext } from '../types/launchpad-metadata.types.js';
import { generateTemplateFiles } from './template-files.generator.js';

const getComponentTemplatePath = (): string => {
  return fileURLToPath(new URL('../templates/generators/web/component', import.meta.url));
};

export const generateComponent = async (
  context: LaunchpadProjectContext,
  componentName: GeneratorName,
  category: WebComponentCategory,
): Promise<string[]> => {
  if (context.metadata.projectType !== 'web') {
    throw new Error('Components can only be generated in web projects.');
  }

  const componentPath = path.join(
    context.rootPath,
    'src',
    'shared',
    'components',
    category,
    componentName.slug,
  );

  return generateTemplateFiles({
    templatePath: getComponentTemplatePath(),
    projectRoot: context.rootPath,
    files: [
      {
        templateFile: 'component.template',
        destinationPath: path.join(componentPath, `${componentName.slug}.component.tsx`),
      },
      {
        templateFile: 'index.template',
        destinationPath: path.join(componentPath, 'index.ts'),
      },
    ],
    variables: {
      projectName: path.basename(context.rootPath),
      projectSlug: path.basename(context.rootPath),
      packageName: path.basename(context.rootPath),
      launchpadVersion: CLI_VERSION,

      artifactName: componentName.slug,
      artifactCamelName: componentName.camelCase,
      artifactPascalName: componentName.pascalCase,
      artifactConstantName: componentName.constantCase,
    },
  });
};
