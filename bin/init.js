#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const [, , type, name] = process.argv;
if (type == null) {
  console.error(chalk.red('App type is required!'));
  process.exit();
}

if (name == null) {
  console.error(chalk.red('App name is required!'));
  process.exit();
}

const source = `${__dirname}/../templates/${type}`;

if (!fs.existsSync(source)) {
  console.error(chalk.red(`App type "${type}" is not supported!`));
  process.exit();
}

const replace = [{ search: '<NAME>', replace: name }];
const target = `${process.cwd()}/${name}`;

try {
  fs.mkdirSync(target);
} catch (e) {}

fs.readdirSync(source)
  .map(file => `${source}/${file}`)
  .forEach(file => copy(file, target, replace));

console.info(chalk.green(`Success! Use "cd ${name}" to open an app directory.`));

function copy(sourceFile, destDir, replace = []) {
  const content = fs.readFileSync(sourceFile).toString('ascii');

  const updated = replace.reduce(
    (result, { search, replace }) => result.replace(search, replace),
    content
  );

  fs.writeFileSync(`${destDir}/${path.basename(sourceFile)}`, updated);
}
