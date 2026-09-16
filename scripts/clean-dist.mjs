import { rm } from 'node:fs/promises';
import path from 'node:path';

const destination = path.resolve('dist');

await rm(destination, {
  recursive: true,
  force: true,
});

console.log('Build output cleaned.');
