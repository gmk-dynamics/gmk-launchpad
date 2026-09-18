import fs from 'fs-extra';
import path from 'node:path';

interface ModuleRouteRegistration {
  projectRoot: string;
  moduleSlug: string;
  moduleCamelName: string;
  routePath: string;
}

const MODULE_IMPORT_MARKER = '// GMK:MODULE_IMPORTS';

const MODULE_ROUTE_MARKER = '// GMK:MODULE_ROUTES';

const getRouterVariableName = (moduleCamelName: string): string => {
  return `${moduleCamelName}Router`;
};

const getImportStatement = (moduleSlug: string, moduleCamelName: string): string => {
  return `import ${getRouterVariableName(
    moduleCamelName,
  )} from '../modules/${moduleSlug}/${moduleSlug}.routes.js';`;
};

const getRouteStatement = (routePath: string, moduleCamelName: string): string => {
  return `router.use('${routePath}', ${getRouterVariableName(moduleCamelName)});`;
};

const getRoutesFilePath = (projectRoot: string): string => {
  return path.join(projectRoot, 'src', 'routes', 'index.ts');
};

export const validateModuleRouteRegistration = async ({
  projectRoot,
  moduleSlug,
  moduleCamelName,
  routePath,
}: ModuleRouteRegistration): Promise<void> => {
  const routesFilePath = getRoutesFilePath(projectRoot);

  if (!(await fs.pathExists(routesFilePath))) {
    throw new Error(`API routes file was not found: ${routesFilePath}`);
  }

  const content = await fs.readFile(routesFilePath, 'utf8');

  const importStatement = getImportStatement(moduleSlug, moduleCamelName);

  const routeStatement = getRouteStatement(routePath, moduleCamelName);

  if (content.includes(importStatement)) {
    throw new Error(`Module router is already registered: ${moduleSlug}`);
  }

  if (content.includes(routeStatement)) {
    throw new Error(`Route is already registered: ${routePath}`);
  }

  const escapedRoute = routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const routePattern = new RegExp(`router\\.use\\(['"]${escapedRoute}['"]`);

  if (routePattern.test(content)) {
    throw new Error(`Route is already registered: ${routePath}`);
  }
};

export const registerModuleRoute = async ({
  projectRoot,
  moduleSlug,
  moduleCamelName,
  routePath,
}: ModuleRouteRegistration): Promise<void> => {
  const routesFilePath = getRoutesFilePath(projectRoot);

  let content = await fs.readFile(routesFilePath, 'utf8');

  const importStatement = getImportStatement(moduleSlug, moduleCamelName);

  const routeStatement = getRouteStatement(routePath, moduleCamelName);

  if (content.includes(MODULE_IMPORT_MARKER) && content.includes(MODULE_ROUTE_MARKER)) {
    content = content.replace(
      MODULE_IMPORT_MARKER,
      `${importStatement}\n\n${MODULE_IMPORT_MARKER}`,
    );

    content = content.replace(MODULE_ROUTE_MARKER, `${routeStatement}\n\n${MODULE_ROUTE_MARKER}`);
  } else {
    const routerDeclaration = 'const router = Router();';

    const exportStatement = 'export default router;';

    if (!content.includes(routerDeclaration) || !content.includes(exportStatement)) {
      throw new Error('Unable to determine where module routes should be registered.');
    }

    content = content.replace(routerDeclaration, `${importStatement}\n\n${routerDeclaration}`);

    content = content.replace(exportStatement, `${routeStatement}\n\n${exportStatement}`);
  }

  await fs.writeFile(routesFilePath, content, 'utf8');
};
