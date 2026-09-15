import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const source = path.resolve('src/templates');
const destination = path.resolve('dist/templates');

await rm(destination, {
  recursive: true,
  force: true,
});

await mkdir(destination, {
  recursive: true,
});

await cp(source, destination, {
  recursive: true,
});

console.log('Templates copied to dist/templates.');
