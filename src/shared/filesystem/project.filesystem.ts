import path from 'node:path';

import fs from 'fs-extra';

export const ensureDirectoryDoesNotExist = async (directoryPath: string): Promise<void> => {
  const exists = await fs.pathExists(directoryPath);

  if (exists) {
    throw new Error(`Directory already exists: ${directoryPath}`);
  }
};

export const createProjectDirectories = async (
  projectPath: string,
  directories: readonly string[],
): Promise<void> => {
  for (const directory of directories) {
    await fs.ensureDir(path.join(projectPath, directory));
  }
};
