export type ProjectType = 'react-vite' | 'express-api' | 'full-stack';

export interface CreateProjectConfig {
  projectName: string;
  projectSlug: string;
  projectType: ProjectType;
  webDirectoryName: string;
  apiDirectoryName: string;
}
