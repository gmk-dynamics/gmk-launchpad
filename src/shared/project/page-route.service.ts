import fs from 'fs-extra';
import path from 'node:path';

interface PageRouteRegistration {
  projectRoot: string;
  pageSlug: string;
  pagePascalName: string;
  routePath: string;
}

const PAGE_IMPORT_MARKER = '// GMK:PAGE_IMPORTS';

const PAGE_ROUTE_MARKER = '      {/* GMK:PAGE_ROUTES */}';

const getRoutesFilePath = (projectRoot: string): string => {
  return path.join(projectRoot, 'src', 'navigation', 'routes.tsx');
};

const getPageComponentName = (pagePascalName: string): string => {
  return `${pagePascalName}Page`;
};

const getImportStatement = (pageSlug: string, pagePascalName: string): string => {
  return `import ${getPageComponentName(pagePascalName)} from '@pages/${pageSlug}';`;
};

const getRouteStatement = (routePath: string, pagePascalName: string): string => {
  return `      <Route path="${routePath}" element={<${getPageComponentName(
    pagePascalName,
  )} />} />`;
};

export const validatePageRouteRegistration = async ({
  projectRoot,
  pageSlug,
  pagePascalName,
  routePath,
}: PageRouteRegistration): Promise<void> => {
  const routesFilePath = getRoutesFilePath(projectRoot);

  if (!(await fs.pathExists(routesFilePath))) {
    throw new Error(
      'Web routing configuration was not found. Page route registration requires src/navigation/routes.tsx.',
    );
  }

  const content = await fs.readFile(routesFilePath, 'utf8');

  if (!content.includes(PAGE_IMPORT_MARKER) || !content.includes(PAGE_ROUTE_MARKER)) {
    throw new Error('Web routing markers were not found in src/navigation/routes.tsx.');
  }

  const importStatement = getImportStatement(pageSlug, pagePascalName);

  if (content.includes(importStatement)) {
    throw new Error(`Page is already registered: ${pageSlug}`);
  }

  const escapedRoute = routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const routePattern = new RegExp(`path\\s*=\\s*["']${escapedRoute}["']`);

  if (routePattern.test(content)) {
    throw new Error(`Route is already registered: ${routePath}`);
  }
};

export const registerPageRoute = async ({
  projectRoot,
  pageSlug,
  pagePascalName,
  routePath,
}: PageRouteRegistration): Promise<void> => {
  const routesFilePath = getRoutesFilePath(projectRoot);

  let content = await fs.readFile(routesFilePath, 'utf8');

  const importStatement = getImportStatement(pageSlug, pagePascalName);

  const routeStatement = getRouteStatement(routePath, pagePascalName);

  content = content.replace(PAGE_IMPORT_MARKER, `${importStatement}\n\n${PAGE_IMPORT_MARKER}`);

  content = content.replace(PAGE_ROUTE_MARKER, `${routeStatement}\n\n${PAGE_ROUTE_MARKER}`);

  await fs.writeFile(routesFilePath, content, 'utf8');
};
