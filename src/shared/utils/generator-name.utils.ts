import type { GeneratorName } from '../../types/generator.types.js';

const splitName = (value: string): string[] => {
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

export const normalizeGeneratorName = (
  value: string,
  removableSuffixes: string[] = [],
): GeneratorName => {
  const parts = splitName(value);

  if (parts.length === 0) {
    throw new Error('Generator name must contain at least one letter or number.');
  }

  const suffixes = new Set(removableSuffixes.map((suffix) => suffix.toLowerCase()));

  while (parts.length > 1 && suffixes.has(parts[parts.length - 1])) {
    parts.pop();
  }

  const slug = parts.join('-');

  if (!/^[a-z]/.test(slug)) {
    throw new Error('Generator name must start with a letter.');
  }

  return {
    slug,
    camelCase: parts[0] + parts.slice(1).map(capitalize).join(''),
    pascalCase: parts.map(capitalize).join(''),
    constantCase: parts.join('_').toUpperCase(),
  };
};

export const normalizeContextBundleName = (value: string): GeneratorName => {
  let name = normalizeGeneratorName(value, ['context', 'provider', 'hook']);

  if (name.slug.startsWith('use-')) {
    name = normalizeGeneratorName(name.slug.slice(4));
  }

  if (name.slug === 'use') {
    throw new Error('Context name must contain a name after "use".');
  }

  return name;
};
