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

const generate2 = async ({ desc, config, theme }) => {
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
  img.set({ originX: 'center', originY: 'center' })

  const { width: rawWidth, height: rawHeight } = img.getOriginalSize()

  if(rawWidth * theme.inside.proportion < rawHeight) {
    img.rotate(90)
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

const generate = async ({desc, config, theme }) => {


  /* Init new image ------------------------------------------------------- */
  /* ---------------------------------------------------------------------- */
  const canvas = createCanvas(theme.wrapper.width, theme.wrapper.height)

  const context = canvas.getContext('2d')

  context.fillStyle = 'transparent'
  context.fillRect(0, 0, theme.width, theme.height)



  /* Draw  main (outside) rect -------------------------------------------- */
  /* ---------------------------------------------------------------------- */
  roundedRect(context, {
    x: 0,
    y: 0,
    width: theme.wrapper.width,
    height: theme.wrapper.height,
    radius: theme.wrapper.radius*2,
    color: "black"
  });



  /* Inner transparent container ------------------------------------------ */
  /* ---------------------------------------------------------------------- */
  theme.inside.width = theme.wrapper.width - 2 * theme.wrapper.padding
  theme.inside.height = theme.inside.width*theme.inside.proportion

  context.save();
  context.globalCompositeOperation = "destination-out";

  // draw rounded rect
  roundedRect(context, {
    x: theme.wrapper.padding,
    y: theme.wrapper.padding,
    width: theme.inside.width,
    height: theme.inside.height+theme.inside.radius,
    radius: theme.inside.radius,
    color: "white"
  });

  // cut the rounded stuff from bottom and crop inner container to expected height
  context.fillRect(theme.wrapper.padding, theme.wrapper.padding+theme.inside.height, theme.inside.width, theme.inside.radius);
  context.restore();



  /* Cut text inside the main rect ---------------------------------------- */
  /* ---------------------------------------------------------------------- */
  context.save();
  context.globalCompositeOperation = "destination-out";

  // Define font settings
  canvasTxt.font = theme.desc.font.name
  canvasTxt.fontSize = theme.desc.size
  canvasTxt.lineHeight = theme.desc.size
  canvasTxt.fontWeight = theme.desc.font.weight
  canvasTxt.vAlign = 'center'

  desc.forEach(line => {
    console.log(line.text)
  })
  const imageTitle = 'dsad34343'
  canvasTxt.drawText(context, imageTitle, theme.wrapper.padding, theme.inside.height, theme.inside.width, theme.desc.height)
  context.restore();
  console.log(`Added title "${imageTitle}" to the icon`)



  /* Add icon to the canvas ----------------------------------------------- */
  /* ---------------------------------------------------------------------- */
  const inputIconImage = await loadImage(config.path.input)

  theme.icon.rawWidth = inputIconImage.width
  theme.icon.rawHeight = inputIconImage.height

  theme.icon.proportion = theme.icon.width / theme.icon.rawWidth
  theme.icon.height = Math.round(theme.icon.rawHeight * theme.icon.proportion)

  theme.icon.rotate = theme.icon.rawWidth < theme.icon.rawHeight

  theme.icon.width = theme.icon.rotate
    ? theme.inside.height - (theme.icon.margin * 2)
    : theme.inside.width - (theme.icon.margin * 2)
  theme.icon.proportion = theme.icon.width / theme.icon.rawWidth
  theme.icon.height = Math.round(theme.icon.rawHeight * theme.icon.proportion)

  theme.icon.fromTop = theme.wrapper.padding + ( (theme.inside.height - theme.icon.height + theme.icon.margin) / 2)
  theme.icon.fromLeft = theme.wrapper.padding + ( (theme.inside.width - theme.icon.width) / 2)

  if(theme.icon.rotate) {
    console.log('Rotating icon...')
    context.save()
    context.translate(theme.icon.fromLeft + theme.icon.width/2, theme.icon.fromTop + theme.icon.height/2)
    context.rotate(Math.PI/2)
    context.drawImage(...[
      inputIconImage,
      -theme.icon.width/2,
      -theme.icon.height/2,
      theme.icon.width,
      theme.icon.height
    ])
    context.restore();
  } else {
    context.drawImage(...[
      inputIconImage,
      theme.icon.fromLeft,
      theme.icon.fromTop,
      theme.icon.width,
      theme.icon.height
    ])
  }



  /* Ensure all layers have the same color -------------------------------- */
  /* ---------------------------------------------------------------------- */
  context.globalCompositeOperation = 'source-in'
  context.fillStyle = theme.general.color
  context.fillRect(0, 0, theme.wrapper.width, theme.wrapper.height)



  /* Save the image ------------------------------------------------------- */
  /* ---------------------------------------------------------------------- */
  const buffer = canvas.toBuffer('image/png')
  await fs.promises.writeFile(config.path.output, buffer)
  console.log(`Icon saved as ${config.path.output}`)
}

module.exports = { generate: generate2, processBatch }
