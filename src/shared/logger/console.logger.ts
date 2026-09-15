import chalk from 'chalk';

import {
  CLI_VERSION,
  GMK_DYNAMICS_TEXT,
  GMK_LAUNCHPAD_TEXT,
  GMK_LOGO,
  GMK_PRIMARY_COLOR,
  GMK_WEBSITE,
} from '../constants/branding.constants.js';

const brand = chalk.hex(GMK_PRIMARY_COLOR);

const centerText = (text: string): string => {
  const terminalWidth = process.stdout.columns || 80;

  if (text.length >= terminalWidth) {
    return text;
  }

  const padding = Math.floor((terminalWidth - text.length) / 2);

  return `${' '.repeat(padding)}${text}`;
};

export const printBanner = (): void => {
  console.log();

  GMK_LOGO.forEach((line) => {
    console.log(brand.bold(centerText(line)));
  });

  console.log(brand(centerText(GMK_DYNAMICS_TEXT)));

  console.log();

  console.log(chalk.bold(centerText(GMK_LAUNCHPAD_TEXT)));
  console.log(chalk.dim(centerText(`v${CLI_VERSION}`)));

  console.log();

  const websiteMessage = 'Build faster with GMK Dynamics · https://gmkdynamics.com';

  const centeredWebsiteMessage = centerText(websiteMessage);

  const paddingLength = centeredWebsiteMessage.length - websiteMessage.length;

  console.log(
    ' '.repeat(paddingLength) +
      chalk.dim('Build faster with GMK Dynamics · ') +
      chalk.underline(GMK_WEBSITE),
  );

  console.log();
};

export const printSection = (title: string): void => {
  console.log();
  console.log(brand.bold(`◆ ${title}`));
};

export const printInfo = (label: string, value: string): void => {
  console.log(`${chalk.dim('│')}  ${chalk.dim(label.padEnd(12))} ${chalk.white(value)}`);
};

export const printSuccess = (message: string): void => {
  console.log();
  console.log(`${chalk.green('✔')} ${chalk.bold(message)}`);
  console.log();
};

export const printWarning = (message: string): void => {
  console.log(`${chalk.yellow('!')} ${message}`);
};

export const printError = (message: string): void => {
  console.log(`${chalk.red('✖')} ${message}`);
};

export const printCancelled = (): void => {
  console.log();
  console.log(chalk.dim('Operation cancelled.'));
  console.log();
};

export const printNextSteps = (commands: string[]): void => {
  console.log(brand.bold('◆ Next Steps'));
  console.log();

  commands.forEach((command) => {
    console.log(`  ${chalk.cyan(command)}`);
  });

  console.log();
};
