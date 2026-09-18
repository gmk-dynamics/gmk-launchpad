import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLI_VERSION } from '../shared/constants/branding.constants.js';
import type { GeneratorName } from '../types/generator.types.js';
import type { LaunchpadProjectContext } from '../types/launchpad-metadata.types.js';
import { generateTemplateFiles } from './template-files.generator.js';

const getPageTemplatePath = (): string => {
  return fileURLToPath(new URL('../templates/generators/web/page', import.meta.url));
};

export const generatePage = async (
  context: LaunchpadProjectContext,
  pageName: GeneratorName,
): Promise<string[]> => {
  if (context.metadata.projectType !== 'web') {
    throw new Error('Pages can only be generated in web projects.');
  }

  const pagePath = path.join(context.rootPath, 'src', 'pages', pageName.slug);

  return generateTemplateFiles({
    templatePath: getPageTemplatePath(),
    projectRoot: context.rootPath,
    files: [
      {
        templateFile: 'page.template',
        destinationPath: path.join(pagePath, `${pageName.slug}.page.tsx`),
      },
      {
        templateFile: 'index.template',
        destinationPath: path.join(pagePath, 'index.ts'),
      },
    ],
    variables: {
      projectName: path.basename(context.rootPath),
      projectSlug: path.basename(context.rootPath),
      packageName: path.basename(context.rootPath),
      launchpadVersion: CLI_VERSION,

      artifactName: pageName.slug,
      artifactCamelName: pageName.camelCase,
      artifactPascalName: pageName.pascalCase,
      artifactConstantName: pageName.constantCase,
    },
  });
};
