#!/usr/bin/env node

import { Command } from 'commander';
import { addCommand } from './commands/add.command.js';
import { createCommand } from './commands/create.command.js';
import { doctorCommand } from './commands/doctor.command.js';
import { generateCommand } from './commands/generate.command.js';
import { CLI_VERSION } from './shared/constants/branding.constants.js';
import { printBanner, printCancelled, printError } from './shared/logger/console.logger.js';

const program = new Command();

printBanner();

program.name('gmk').description('GMK Launchpad project scaffolding CLI').version(CLI_VERSION);

program.addCommand(createCommand);
program.addCommand(addCommand);
program.addCommand(generateCommand);
program.addCommand(doctorCommand);

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
