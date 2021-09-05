#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

const pkg = require(path.join(__dirname, './package.json'))

program
    .version(pkg.version)
    .description(`generate icon`)
    .option('-t, --title <title>', 'Icon title / main label content')
    .option('-i, --image', 'Source image path')
    .option('-s, --output <output>', 'Optuput filename', 'output')

program.parse(process.argv)
const options = program.opts()

const width = 1200
const height = 630

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = 'transparent'
context.fillRect(0, 0, width, height)

context.font = 'bold 70pt Menlo'
context.textAlign = 'center'
context.textBaseline = 'top'
context.fillStyle = '#3574d4'

const text = 'Hello, World!'

const textWidth = context.measureText(text).width
context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
context.fillStyle = '#fff'
context.fillText(text, 600, 170)

context.fillStyle = '#fff'
context.font = 'bold 30pt Menlo'
context.fillText(options.title.toString().toUpperCase(), 600, 530)


const outputFilename = `${options.output}.png`
const buffer = canvas.toBuffer('image/png')
fs.writeFileSync(`./${outputFilename}`, buffer)
console.log(`Saved as ${outputFilename}`)
