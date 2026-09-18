export interface GeneratorName {
  slug: string;
  camelCase: string;
  pascalCase: string;
  constantCase: string;
}

export type ApiGeneratorType = 'module' | 'middleware' | 'service';

export type WebGeneratorType = 'component' | 'page' | 'service' | 'context';

export type GeneratorType = ApiGeneratorType | WebGeneratorType;
