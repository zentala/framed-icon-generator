require('json5/lib/register')

const fs = require('fs')
const path = require('path')
const { createCanvas, loadImage } = require('canvas')
const canvasTxt = require('canvas-txt').default
// const chalk = require('chalk')
const { dirname } = require('path')
const fabric = require("fabric").fabric

const { roundedRect } = require('./helpers')

const processBatch = async (batch) => {
  const batchPath = path.resolve(__dirname, batch) // batch JSON5 file path
  const { config, icons, theme } = require(batchPath) // load data from batch JSON5 file

  // create optput path if don't exitst
  const outputIconsPath = path.join(dirname(batchPath), config.subdir.output) // output subdir path
  !fs.existsSync(outputIconsPath) && fs.mkdirSync(outputIconsPath, { recursive: true })

  // generate every icon listed in batch
  for(const icon of icons) {
    // add to config input & oputput paths created from dirnames
    config.path = {
      input: path.join(dirname(batchPath), config.subdir.input, icon.filename),
      output: path.join(dirname(batchPath), config.subdir.output, icon.filename),
    }

    await generate2({ ...icon, config, theme }) // do the magic
    console.log('')
  }
}

const generate2 = async ({ rotate, desc, config, theme }) => {
  const canvas = new fabric.StaticCanvas(null, {
    width: theme.wrapper.width,
    height: theme.wrapper.height
  })


  // main rectangle
  const rect = new fabric.Rect({
    left: 0,
    top: 0,
    fill: theme.general.color,
    width: theme.wrapper.width,
    height: theme.wrapper.height,
    rx: theme.wrapper.radius,
    ry: theme.wrapper.radius,
  })


  // clip inside transparent rectangle
  const rectInnerClipPath = new fabric.Rect({
    left: theme.wrapper.padding,
    top: theme.wrapper.padding,
    width: theme.wrapper.width - (theme.wrapper.padding * 2),
    height: theme.wrapper.height - (theme.wrapper.padding * 2),
    rx: theme.wrapper.radius / 2,
    ry: theme.wrapper.radius / 2,
    absolutePositioned: true
  })
  rectInnerClipPath.inverted = true

  rect.clipPath = rectInnerClipPath
  canvas.add(rect)


  // add icon
  const insideMaxWidth = theme.wrapper.width - (theme.wrapper.padding * 2)
  const imageMaxWidth = insideMaxWidth -  (theme.icon.margin * 2)

  const insideMaxHeight = insideMaxWidth * theme.inside.proportion
  const imageMaxHeight = insideMaxHeight - (theme.icon.margin * 2)

  const img = await getImage(config.path.input)

  const blackFilter = new fabric.Image.filters.BlendColor({ color: '#000', mode: 'multiply'});
  img.filters.push(blackFilter);

  // Don forget to apply the filters
  img.applyFilters();

  img.set({ originX: 'center', originY: 'center' })

  const { width: rawWidth, height: rawHeight } = img.getOriginalSize()

  // if(rawWidth * theme.inside.proportion < rawHeight) {
  //   img.rotate(90)
  // }
  if(rotate) {
    img.rotate(rotate)
  }

  rawWidth * theme.inside.proportion < rawHeight
  ? img.scaleToHeight(imageMaxHeight)
  : img.scaleToWidth(imageMaxWidth)

  const iconContainer = new fabric.Group([ img ], {
    left: theme.wrapper.padding + theme.icon.margin,
    top: theme.wrapper.padding + theme.icon.margin,
    width: imageMaxWidth,
    height: imageMaxHeight,
  })

  canvas.add(iconContainer)


  // create text background
  const textBg = new fabric.Rect({
    left: 0,
    top: theme.wrapper.padding + insideMaxHeight,
    width: theme.wrapper.width,
    height: theme.wrapper.height - insideMaxHeight - theme.wrapper.padding*2
  })

  // create text lines array
  const texts = []
  let top = 0
  desc.forEach((line, i, arr) => {
    const fontSize = (line.level || theme.desc.font.defLevel) * 8

    texts.push(new fabric.Text(line.text, {
      textAlign: 'center',
      fontSize,
      lineHeight: 1,
      fontFamily: theme.desc.font.name,
      fontWeight: theme.desc.font.weight,
      top,
      originX: 'center',
    }))

    top = top + fontSize
  })

  // create text lines group
  const textGroup = new fabric.Group(texts, {
    left: theme.wrapper.padding,
    top: theme.wrapper.padding*2 + insideMaxHeight,
    width: insideMaxWidth,
    height: theme.wrapper.height - (theme.wrapper.padding * 3) - insideMaxHeight,
    absolutePositioned: true,
  })

  // cut text in the bg and add it to the canvas
  textGroup.inverted = true
  textBg.clipPath = textGroup
  canvas.add(textBg)

  // render & save
  canvas.renderAll()
  console.log('Saving icon in ', config.path.output)
  const stream = canvas.createPNGStream()
  const out = fs.createWriteStream(config.path.output)
  stream.on('data', (chunk) => out.write(chunk))
}

const getImage = (path) => {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL('file://' + path, img => {
      return resolve(img)
    })
  })
}

module.exports = { generate: generate2, processBatch }
