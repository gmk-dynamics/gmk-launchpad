import { Command } from 'commander';

import { generateModule } from '../generators/module.generator.js';
import { printInfo, printSection, printSuccess } from '../shared/logger/console.logger.js';
import projectContextService from '../shared/project/project-context.service.js';
import { normalizeModuleName } from '../shared/utils/module-name.utils.js';

const moduleCommand = new Command('module')
  .description('Generate an API module')
  .argument('<name>', 'Module name')
  .action(async (requestedName: string) => {
    const context = await projectContextService.getProjectContext();

    if (context.metadata.projectType !== 'api') {
      throw new Error('Modules can only be generated in API projects.');
    }

    const moduleName = normalizeModuleName(requestedName);

    printSection('Module Generation');

    printInfo('Project', 'API');
    printInfo('Module', moduleName.slug);
    printInfo('Root', context.rootPath);

    const modulePath = await generateModule(context, moduleName);

    printSuccess(`${moduleName.pascalCase} module generated successfully.`);

    printInfo('Created', modulePath);
  });

export const generateCommand = new Command('generate').description(
  'Generate resources for a GMK Launchpad project',
);

generateCommand.addCommand(moduleCommand);
