const normalizeRoute = (value: string, allowRoot: boolean): string => {
  let routePath = value.trim();

  if (!routePath) {
    throw new Error('Route path is required.');
  }

  if (!routePath.startsWith('/')) {
    routePath = `/${routePath}`;
  }

  if (routePath !== '/') {
    routePath = routePath.replace(/\/+$/, '');
  }

  if (!allowRoot && routePath === '/') {
    throw new Error('Generated modules cannot be registered at the API root.');
  }

  if (/\s/.test(routePath)) {
    throw new Error('Route path cannot contain whitespace.');
  }

  return routePath;
};

export const normalizeRoutePath = (value: string): string => {
  return normalizeRoute(value, false);
};

export const normalizePageRoutePath = (value: string): string => {
  return normalizeRoute(value, true);
};
