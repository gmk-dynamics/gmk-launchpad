import type { ModuleName } from '../../types/module.types.js';

const splitModuleName = (value: string): string[] => {
  return value
    .trim()
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.toLowerCase());
};

const capitalize = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const normalizeModuleName = (value: string): ModuleName => {
  const parts = splitModuleName(value);

  if (parts.length === 0) {
    throw new Error('Module name must contain at least one letter or number.');
  }

  const slug = parts.join('-');

  if (!/^[a-z]/.test(slug)) {
    throw new Error('Module name must start with a letter.');
  }

  const camelCase = parts[0] + parts.slice(1).map(capitalize).join('');

  const pascalCase = parts.map(capitalize).join('');

  const constantCase = parts.join('_').toUpperCase();

  return {
    slug,
    camelCase,
    pascalCase,
    constantCase,
  };
};
