#!/usr/bin/env node

import { Command } from 'commander';

import { createCommand } from './commands/create.command.js';
import { printBanner, printCancelled, printError } from './shared/logger/console.logger.js';

const program = new Command();

printBanner();

program.name('gmk').description('GMK Launchpad project scaffolding CLI').version('0.1.0');

program.addCommand(createCommand);

try {
  await program.parseAsync(process.argv);
} catch (error) {
  if (error instanceof Error && error.name === 'ExitPromptError') {
    printCancelled();
    process.exit(0);
  }

  if (error instanceof Error) {
    printError(error.message);
    process.exit(1);
  }

  printError('An unexpected error occurred.');
  process.exit(1);
}
