import fs from 'fs-extra';

export type EnvironmentValues = Record<string, string>;

const stripQuotes = (value: string): string => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
};

export const parseEnvironmentContent = (content: string): EnvironmentValues => {
  const values: EnvironmentValues = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();

    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!key) {
      continue;
    }

    values[key] = stripQuotes(rawValue);
  }

  return values;
};

export const readEnvironmentFile = async (filePath: string): Promise<EnvironmentValues> => {
  const content = await fs.readFile(filePath, 'utf8');

  return parseEnvironmentContent(content);
};

export const hasEnvironmentValue = (values: EnvironmentValues, name: string): boolean => {
  return Boolean(values[name]?.trim());
};
