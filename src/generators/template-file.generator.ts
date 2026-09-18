import fs from 'fs-extra';
import path from 'node:path';

import { copyTemplate, type TemplateVariables } from '../shared/filesystem/template.filesystem.js';

interface GenerateTemplateFileOptions {
  templatePath: string;
  templateFilename: string;
  destinationPath: string;
  variables: TemplateVariables;
}

export const generateTemplateFile = async ({
  templatePath,
  templateFilename,
  destinationPath,
  variables,
}: GenerateTemplateFileOptions): Promise<string> => {
  if (await fs.pathExists(destinationPath)) {
    throw new Error(`File already exists: ${destinationPath}`);
  }

  const destinationDirectory = path.dirname(destinationPath);

  await fs.ensureDir(destinationDirectory);

  const temporaryPath = path.join(destinationDirectory, `.gmk-${process.pid}-${Date.now()}`);

  try {
    await copyTemplate(templatePath, temporaryPath, variables);

    const generatedTemplatePath = path.join(temporaryPath, templateFilename);

    if (!(await fs.pathExists(generatedTemplatePath))) {
      throw new Error(`Generated template file was not found: ${generatedTemplatePath}`);
    }

    await fs.move(generatedTemplatePath, destinationPath);
  } finally {
    await fs.remove(temporaryPath);
  }

  return destinationPath;
};
