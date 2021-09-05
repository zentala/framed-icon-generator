#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require('commander')
const chalk = require('chalk')

const { generate } = require('./generator')
const pjson = require(path.join(__dirname, './package.json'))

program
    .version(pjson.version)
    .description(`generate icon`)
    .option('-t, --title <title>', 'Icon title / main label content')
    .option('-i, --icon <icon>', 'Source image path', 'icons/input/example.png')
    .option('-o, --output <output>', 'Output image path', 'icons/output/example.png')
    .option('-b, --batch', 'Gets icons from "icons/input/", convert & throw them to "icons/output/".')

program.parse(process.argv)
const options = program.opts()

if(options.batch) {
    const inputPath = path.join(__dirname, 'icons/input')
    const outputPath = path.join(__dirname, 'icons/output')
    const inputIcons = fs.readdirSync(inputPath)

    !fs.existsSync(outputPath) && fs.mkdirSync(outputPath, { recursive: true })

    inputIcons.forEach(inputIcon => {
        const inputIconPath = path.join(inputPath, inputIcon)
        const outputIconPath = path.join(outputPath, inputIcon)
        const text = inputIcon.split('.')[0].replace(/[-_]/g, ' ');
        generate(text, inputIconPath, outputIconPath)
        console.log(chalk.green(`${inputIcon} generated`))
    })
} else {
  generate(options.title, options.icon, options.output)
}



