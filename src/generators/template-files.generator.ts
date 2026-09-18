import fs from 'fs-extra';
import path from 'node:path';
import { copyTemplate, type TemplateVariables } from '../shared/filesystem/template.filesystem.js';

interface TemplateFileMapping {
  templateFile: string;
  destinationPath: string;
}

interface GenerateTemplateFilesOptions {
  templatePath: string;
  projectRoot: string;
  files: TemplateFileMapping[];
  variables: TemplateVariables;
}

export const generateTemplateFiles = async ({
  templatePath,
  projectRoot,
  files,
  variables,
}: GenerateTemplateFilesOptions): Promise<string[]> => {
  for (const { destinationPath } of files) {
    if (await fs.pathExists(destinationPath)) {
      throw new Error(`File already exists: ${destinationPath}`);
    }
  }

  const temporaryPath = path.join(projectRoot, `.gmk-${process.pid}-${Date.now()}`);

  const createdFiles: string[] = [];

  try {
    await copyTemplate(templatePath, temporaryPath, variables);

    for (const { templateFile } of files) {
      const sourcePath = path.join(temporaryPath, templateFile);

      if (!(await fs.pathExists(sourcePath))) {
        throw new Error(`Generated template file was not found: ${sourcePath}`);
      }
    }

    for (const { templateFile, destinationPath } of files) {
      const sourcePath = path.join(temporaryPath, templateFile);

      await fs.ensureDir(path.dirname(destinationPath));

      await fs.move(sourcePath, destinationPath);

      createdFiles.push(destinationPath);
    }

    return createdFiles;
  } catch (error) {
    for (const createdFile of createdFiles) {
      await fs.remove(createdFile);
    }

    throw error;
  } finally {
    await fs.remove(temporaryPath);
  }
};
