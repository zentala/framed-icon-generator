function roundedRect(ctx, options) {
  ctx.strokeStyle = options.color;
  ctx.fillStyle = options.color;
  ctx.lineJoin = "round";
  ctx.lineWidth = options.radius;

  ctx.strokeRect(
      options.x+(options.radius*.5),
      options.y+(options.radius*.5),
      options.width-options.radius,
      options.height-options.radius
  );

  ctx.fillRect(
      options.x+(options.radius*.5),
      options.y+(options.radius*.5),
      options.width-options.radius,
      options.height-options.radius
  );

  ctx.stroke();
  ctx.fill();
}

module.exports = { roundedRect };
