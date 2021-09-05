const fs = require('fs')
const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const { roundedRect } = require('./helpers')
const canvasTxt = require('canvas-txt').default
const chalk = require('chalk')

const processBatch = async () => {
  const inputPath = path.join(__dirname, 'icons/input')
  const outputPath = path.join(__dirname, 'icons/output')
  const inputIcons = fs.readdirSync(inputPath)

  !fs.existsSync(outputPath) && fs.mkdirSync(outputPath, { recursive: true })

  for (const inputIcon of inputIcons) {
    if(inputIcon.endsWith('.png')) {
      const inputIconPath = path.join(inputPath, inputIcon)
      const outputIconPath = path.join(outputPath, inputIcon)
      const iconText = inputIcon.split('.')[0].replace(/[-_]/g, ' ');
      await generate(iconText, inputIconPath, outputIconPath)
      console.log(chalk.green(`${inputIcon} generated`))
      console.log(chalk.gray('------------'))
    }
  }
}

const generate = async (title, inputIconPath, outputIconPath) => {
  const width = 600
  const height = 800
  const margin = 40
  const radius = 40
  let settings = {
    width: 600,
    margin: 40,
    radius: 50,
    text: {
      size: 100,
      color: 'black',
      align: 'center'
    }
  }

  // Get icon & its size from input file
  const inputIconImage = await loadImage(inputIconPath)
  settings.icon = {
    rawWidth: inputIconImage.width,
    rawHeight: inputIconImage.height,
    margin: 50,
  }

  settings.icon.width = settings.width - (settings.margin * 2) - (settings.icon.margin * 2);
  settings.icon.proportion = settings.icon.width / settings.icon.rawWidth;
  settings.icon.height = settings.icon.rawHeight * settings.icon.proportion;

  // Define inside (transparent) container
  settings.inside = {
    width: settings.width - 2 * settings.margin,
    height: settings.icon.height + 2 * settings.icon.margin
  }

  // Text height
  settings.text.fromTop = settings.inside.height + settings.margin * 1.5

  // Total height
  settings.height = settings.text.fromTop + settings.text.size + settings.margin

  // Init
  const canvas = createCanvas(settings.width, settings.height)
  const context = canvas.getContext('2d')

  // Background
  context.fillStyle = 'transparent'
  context.fillRect(0, 0, settings.width, settings.height)

  // Main (outside) rect
  roundedRect(context, {
    x: 0,
    y: 0,
    width: settings.width,
    height: settings.height,
    radius: settings.radius*2,
    color: "black"
  });

  // Cut rect for icon in main rect
  context.save();
  context.globalCompositeOperation = "destination-out";
  roundedRect(context, {
    x: settings.margin,
    y: settings.margin,
    width: settings.inside.width,
    height: settings.inside.height,
    radius: radius,
    color: "white"
  });
  context.fillRect(settings.margin, settings.margin*5, settings.inside.width, settings.inside.height-(settings.margin*4));
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
  const imageTitle = title.toString().toUpperCase()
  // canvasTxt.font = 'MesloLGS NF'
  // canvasTxt.font = 'Apple SD Gothic Neo'
  // canvasTxt.font = 'Avenir'
  canvasTxt.font = 'Avenir Next'
  canvasTxt.fontSize = settings.text.size
  canvasTxt.fontWeight = 900
  canvasTxt.vAlign = 'top'
  // canvasTxt.fontStyle = 'heavy'
  canvasTxt.drawText(context, imageTitle, margin, settings.text.fromTop, settings.inside.width, 200)
  context.restore();
  console.log(`Added title "${imageTitle}" to the icon`)

  // add icon
  const args = [
    inputIconImage,
    settings.margin + settings.icon.margin,
    settings.margin + settings.icon.margin,
    settings.icon.width,
    settings.icon.height
  ]
  context.drawImage(...args)

  // make it black for sure
  context.globalCompositeOperation = 'source-in';
  context.fillStyle = 'black'
  context.fillRect(0, 0, settings.width, settings.height);

  // save
  const buffer = canvas.toBuffer('image/png')
  await fs.writeFileSync(outputIconPath, buffer)
  console.log(`Icon saved as ${outputIconPath}`)
}

module.exports = { generate, processBatch }
