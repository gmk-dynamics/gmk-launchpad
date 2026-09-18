import { Command } from 'commander';

import { generateComponent } from '../generators/component.generator.js';
import { generateContextBundle } from '../generators/context.generator.js';
import { generateMiddleware } from '../generators/middleware.generator.js';
import { generateModule } from '../generators/module.generator.js';
import { generatePage } from '../generators/page.generator.js';
import { generateService } from '../generators/service.generator.js';
import {
  promptComponentCategory,
  promptGeneratorName,
  promptGeneratorType,
} from '../prompts/generate.prompt.js';
import type { WebComponentCategory } from '../shared/constants/generator.constants.js';
import { isWebComponentCategory } from '../shared/constants/generator.constants.js';
import { printInfo, printSection, printSuccess } from '../shared/logger/console.logger.js';
import projectContextService from '../shared/project/project-context.service.js';
import {
  normalizeContextBundleName,
  normalizeGeneratorName,
} from '../shared/utils/generator-name.utils.js';
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

const middlewareCommand = new Command('middleware')
  .description('Generate an API middleware')
  .argument('<name>', 'Middleware name')
  .action(async (requestedName: string) => {
    const context = await projectContextService.getProjectContext();

    if (context.metadata.projectType !== 'api') {
      throw new Error('Middleware can only be generated in API projects.');
    }

    const middlewareName = normalizeGeneratorName(requestedName, ['middleware']);

    printSection('Middleware Generation');

    printInfo('Project', 'API');
    printInfo('Middleware', middlewareName.slug);
    printInfo('Root', context.rootPath);

    const generatedPath = await generateMiddleware(context, middlewareName);

    printSuccess(`${middlewareName.pascalCase} middleware generated successfully.`);

    printInfo('Created', generatedPath);
  });

const serviceCommand = new Command('service')
  .description('Generate a project service')
  .argument('<name>', 'Service name')
  .action(async (requestedName: string) => {
    const context = await projectContextService.getProjectContext();

    const serviceName = normalizeGeneratorName(requestedName, ['service']);

    printSection('Service Generation');

    printInfo('Project', context.metadata.projectType === 'api' ? 'API' : 'Web');

    printInfo('Service', serviceName.slug);
    printInfo('Root', context.rootPath);

    const generatedPath = await generateService(context, serviceName);

    printSuccess(`${serviceName.pascalCase} service generated successfully.`);

    printInfo('Created', generatedPath);
  });

const componentCommand = new Command('component')
  .description('Generate a React component')
  .argument('<name>', 'Component name')
  .requiredOption('-t, --type <type>', 'Component type: ui, layout, navigation, modals, or forms')
  .action(
    async (
      requestedName: string,
      options: {
        type: string;
      },
    ) => {
      const context = await projectContextService.getProjectContext();

      if (context.metadata.projectType !== 'web') {
        throw new Error('Components can only be generated in web projects.');
      }

      if (!isWebComponentCategory(options.type)) {
        throw new Error(`Invalid component type: ${options.type}`);
      }

      const componentName = normalizeGeneratorName(requestedName, ['component']);

      printSection('Component Generation');

      printInfo('Project', 'Web');
      printInfo('Component', componentName.slug);
      printInfo('Type', options.type);
      printInfo('Root', context.rootPath);

      await generateComponent(context, componentName, options.type as WebComponentCategory);

      printSuccess(`${componentName.pascalCase} component generated successfully.`);
    },
  );

const pageCommand = new Command('page')
  .description('Generate a React page')
  .argument('<name>', 'Page name')
  .action(async (requestedName: string) => {
    const context = await projectContextService.getProjectContext();

    if (context.metadata.projectType !== 'web') {
      throw new Error('Pages can only be generated in web projects.');
    }

    const pageName = normalizeGeneratorName(requestedName, ['page']);

    printSection('Page Generation');

    printInfo('Project', 'Web');
    printInfo('Page', pageName.slug);
    printInfo('Root', context.rootPath);

    await generatePage(context, pageName);

    printSuccess(`${pageName.pascalCase} page generated successfully.`);
  });

type ContextBundleCommandName = 'context' | 'provider' | 'hook';

const createContextBundleCommand = (commandName: ContextBundleCommandName): Command => {
  return new Command(commandName)
    .description('Generate a React context, provider, and hook')
    .argument('<name>', 'Context bundle name')
    .action(async (requestedName: string) => {
      const context = await projectContextService.getProjectContext();

      if (context.metadata.projectType !== 'web') {
        throw new Error('React context bundles can only be generated in web projects.');
      }

      const contextName = normalizeContextBundleName(requestedName);

      printSection('Context Bundle Generation');

      printInfo('Project', 'Web');
      printInfo('Context', contextName.slug);
      printInfo('Root', context.rootPath);

      await generateContextBundle(context, contextName);

      printSuccess(`${contextName.pascalCase} context, provider, and hook generated successfully.`);
    });
};

const contextCommand = createContextBundleCommand('context');

const providerCommand = createContextBundleCommand('provider');

const hookCommand = createContextBundleCommand('hook');

export const generateCommand = new Command('generate')
  .description('Generate resources for a GMK Launchpad project')
  .action(async () => {
    const context = await projectContextService.getProjectContext();

    const generatorType = await promptGeneratorType(context.metadata.projectType);

    const requestedName = await promptGeneratorName(generatorType);

    switch (generatorType) {
      case 'module': {
        const moduleName = normalizeModuleName(requestedName);

        printSection('Module Generation');

        printInfo('Project', 'API');
        printInfo('Module', moduleName.slug);
        printInfo('Root', context.rootPath);

        await generateModule(context, moduleName);

        printSuccess(`${moduleName.pascalCase} module generated successfully.`);

        return;
      }

      case 'middleware': {
        const middlewareName = normalizeGeneratorName(requestedName, ['middleware']);

        printSection('Middleware Generation');

        printInfo('Project', 'API');
        printInfo('Middleware', middlewareName.slug);
        printInfo('Root', context.rootPath);

        await generateMiddleware(context, middlewareName);

        printSuccess(`${middlewareName.pascalCase} middleware generated successfully.`);

        return;
      }

      case 'service': {
        const serviceName = normalizeGeneratorName(requestedName, ['service']);

        printSection('Service Generation');

        printInfo('Project', context.metadata.projectType === 'api' ? 'API' : 'Web');

        printInfo('Service', serviceName.slug);

        printInfo('Root', context.rootPath);

        await generateService(context, serviceName);

        printSuccess(`${serviceName.pascalCase} service generated successfully.`);

        return;
      }

      case 'component': {
        const componentName = normalizeGeneratorName(requestedName, ['component']);

        const category = await promptComponentCategory();

        printSection('Component Generation');

        printInfo('Project', 'Web');
        printInfo('Component', componentName.slug);
        printInfo('Type', category);
        printInfo('Root', context.rootPath);

        await generateComponent(context, componentName, category);

        printSuccess(`${componentName.pascalCase} component generated successfully.`);

        return;
      }

      case 'page': {
        const pageName = normalizeGeneratorName(requestedName, ['page']);

        printSection('Page Generation');

        printInfo('Project', 'Web');
        printInfo('Page', pageName.slug);
        printInfo('Root', context.rootPath);

        await generatePage(context, pageName);

        printSuccess(`${pageName.pascalCase} page generated successfully.`);

        return;
      }

      case 'context': {
        const contextName = normalizeContextBundleName(requestedName);

        printSection('Context Bundle Generation');

        printInfo('Project', 'Web');
        printInfo('Context', contextName.slug);
        printInfo('Root', context.rootPath);

        await generateContextBundle(context, contextName);

        printSuccess(
          `${contextName.pascalCase} context, provider, and hook generated successfully.`,
        );

        return;
      }
    }
  });

generateCommand.addCommand(moduleCommand);
generateCommand.addCommand(middlewareCommand);
generateCommand.addCommand(serviceCommand);
generateCommand.addCommand(componentCommand);
generateCommand.addCommand(pageCommand);
generateCommand.addCommand(contextCommand);
generateCommand.addCommand(providerCommand);
generateCommand.addCommand(hookCommand);
