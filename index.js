#!/usr/bin/env node

const path = require('path')
const program = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')
const { roundedRect } = require('./helpers')
const canvasTxt = require('canvas-txt').default

const pkg = require(path.join(__dirname, './package.json'))

program
    .version(pkg.version)
    .description(`generate icon`)
    .option('-t, --title <title>', 'Icon title / main label content')
    .option('-i, --icon <icon>', 'Source image path')
    .option('-o, --output <output>', 'Optuput filename', 'output')

program.parse(process.argv)
const options = program.opts()

const width = 600
const height = 800
const margin = 40
const radius = 40
let icon = {
  width: 600,
  height: 800,
  margin: 40,
  radius: 40,
  text: {
    size: 70,
    color: 'black',
    align: 'center'
  }
}

icon.inside = {
  width: icon.width - 2 * icon.margin,
  height: icon.width
}

const canvas = createCanvas(icon.width, icon.height)
const context = canvas.getContext('2d')

// Background
context.fillStyle = 'transparent'
context.fillRect(0, 0, icon.width, icon.height)

// Main (outside) rect
roundedRect(context, {
  x: 0,
  y: 0,
  width: icon.width,
  height: icon.height,
  radius: icon.radius*2,
  color: "black"
});

// Cut rect for icon in main rect
context.save();
context.globalCompositeOperation = "destination-out";
roundedRect(context, {
  x: margin,
  y: margin,
  width: width-(2*margin),
  height: width-(2*margin),
  radius: radius,
  color: "white"
});
context.restore();




// debug	false	Shows the border and align gravity for debugging purposes
// align	center	Text align. Other possible values: left, right
// vAlign	middle	Text vertical align. Other possible values: top, bottom
// fontSize	14	Font size of the text in px
// font	Arial	Font family of the text
// fontStyle	''	Font style, same as css font-style. Examples: italic, oblique 40deg
// fontVariant	''	Font variant, same as css font-variant. Examples: small-caps, slashed-zero
// fontWeight	''	Font weight, same as css font-weight. Examples: bold, 100
// lineHeight	null	Line height of the text, if set to null it tries to auto-detect the value
// justify	false	Justify text if true, it will insert spaces between words when necessary.

// cut text inside the main rect
context.save();
context.globalCompositeOperation = "destination-out";
const imageTitle = options.title.toString().toUpperCase()
canvasTxt.font = 'Menlo'
canvasTxt.fontSize = icon.text.size
canvasTxt.fontStyle = 'bold'
canvasTxt.vAlign = 'top'
canvasTxt.drawText(context, imageTitle, margin, width, icon.inside.width, 200)
context.restore();
console.log(`Added title "${imageTitle}" to the icon`)

// add icon
console.log(options.icon)
loadImage(options.icon)
  .then((image) => {
    console.log(image)
    context.drawImage(image, margin*2, margin*2, 400, 400)


    // save
    const outputFilename = `${options.output}.png`
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(`./${outputFilename}`, buffer)
    console.log(`Icon saved as ${outputFilename}`)

  })
  .catch((err) => {
    console.log(err)
  })

