#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')

const { generate, processBatch } = require('./generator')

const pjson = require(path.join(__dirname, './package.json'))

program
    .version(pjson.version)
    .description(`generate icon`)
    .option('-t, --title <title>', 'Icon title / main label content')
    .option('-i, --icon <icon>', 'Source image path', 'icons/input/example.png')
    .option('-o, --output <output>', 'Output image path', 'icons/output/example.png')
    .option('-b, --batch <batch>', 'Gets icons from "icons/input/", convert & throw them to "icons/output/".')
    .option('-w, --watch', 'Watch batch file changes', false)

program.parse(process.argv)
const options = program.opts()

if(options.batch) {
  if(options.watch) {
    processBatch(options.batch)
    fs.watchFile(options.batch, (curr, prev) => {
      console.log(`${options.batch} file Changed`);
      processBatch(options.batch)
    });
  } else {
    processBatch(options.batch)
  }
} else {
  generate(options.title, options.icon, options.output)
    .then(console.log(chalk.green(`${options.output} generated`)))
    .catch(console.error)
}



