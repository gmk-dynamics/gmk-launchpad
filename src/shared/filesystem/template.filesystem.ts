import fs from 'fs-extra';
import path from 'node:path';

export interface TemplateVariables {
  projectName: string;
  projectSlug: string;
  packageName: string;
  launchpadVersion: string;
}

const TEMPLATE_FILE_RENAMES = new Map<string, string>([
  ['gitignore.template', '.gitignore'],
  ['gmk-launchpad.template.json', '.gmk-launchpad.json'],
]);

const TEMPLATE_DIRECTORY_RENAMES = new Map<string, string>([['vscode.template', '.vscode']]);

const TEMPLATE_VARIABLE_PATTERN = /\{\{([A-Z_]+)\}\}/g;

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mjs',
  '.cjs',
  '.prisma',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
]);

const TEXT_FILENAMES = new Set([
  '.env',
  '.env.example',
  '.gitignore',
  '.npmignore',
  '.prettierignore',
  '.prettierrc',
  'Dockerfile',
  'gitignore.template',
]);

const isTextFile = (filePath: string): boolean => {
  const fileName = path.basename(filePath);
  const extension = path.extname(filePath);

  return TEXT_FILENAMES.has(fileName) || TEXT_EXTENSIONS.has(extension);
};

const getTemplateVariableValue = (variable: string, variables: TemplateVariables): string => {
  switch (variable) {
    case 'PROJECT_NAME':
      return variables.projectName;

    case 'PROJECT_SLUG':
      return variables.projectSlug;

    case 'PACKAGE_NAME':
      return variables.packageName;

    case 'LAUNCHPAD_VERSION':
      return variables.launchpadVersion;

    default:
      return `{{${variable}}}`;
  }
};

const replaceTemplateVariables = (content: string, variables: TemplateVariables): string => {
  return content.replace(TEMPLATE_VARIABLE_PATTERN, (_, variable: string) =>
    getTemplateVariableValue(variable, variables),
  );
};

const processTemplateFile = async (
  filePath: string,
  variables: TemplateVariables,
): Promise<void> => {
  if (!isTextFile(filePath)) {
    return;
  }

  const content = await fs.readFile(filePath, 'utf8');

  const processedContent = replaceTemplateVariables(content, variables);

  await fs.writeFile(filePath, processedContent, 'utf8');
};

const processDirectory = async (
  directoryPath: string,
  variables: TemplateVariables,
): Promise<void> => {
  const entries = await fs.readdir(directoryPath, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      await processDirectory(entryPath, variables);
      continue;
    }

    if (entry.isFile()) {
      await processTemplateFile(entryPath, variables);
    }
  }
};

const renameTemplateArtifacts = async (directoryPath: string): Promise<void> => {
  for (const [sourceName, destinationName] of TEMPLATE_FILE_RENAMES) {
    const sourcePath = path.join(directoryPath, sourceName);

    if (await fs.pathExists(sourcePath)) {
      await fs.move(sourcePath, path.join(directoryPath, destinationName), {
        overwrite: true,
      });
    }
  }

  for (const [sourceName, destinationName] of TEMPLATE_DIRECTORY_RENAMES) {
    const sourcePath = path.join(directoryPath, sourceName);

    if (await fs.pathExists(sourcePath)) {
      await fs.move(sourcePath, path.join(directoryPath, destinationName), {
        overwrite: true,
      });
    }
  }
};

export const copyTemplate = async (
  templatePath: string,
  destinationPath: string,
  variables: TemplateVariables,
): Promise<void> => {
  await fs.copy(templatePath, destinationPath);

  await processDirectory(destinationPath, variables);

  await renameTemplateArtifacts(destinationPath);
};
