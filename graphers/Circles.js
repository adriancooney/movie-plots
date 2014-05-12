var Circles = new Grapher(function(ctx, data, title) {
	var width = 600,
		height = 600,
		x = width/2,
		y = height/2,
		length = data.frames.length;

	ctx.canvas.width = width;
	ctx.canvas.height = height;

	ctx.webkitImageSmoothingEnabled = false;

	data.frames.forEach(function(frame, i) {
		var color = frame.palette[0];

		ctx.fillStyle = "rgb(" + color.join(",") + ")";
		ctx.beginPath();

		var r = ((length - i)/length) * x;
		ctx.arc(x, y, r, 0, Math.PI * 2, true);

		ctx.closePath();

		ctx.fill();
	});

	ctx.font = "32px NeusaDemiBold";
	ctx.textBaseline = "top";
	ctx.textAlign = "center";
	title = title.toUpperCase();
	var size = ctx.measureText(title);

	ctx.fillStyle = "#000000";
	ctx.fillRect((width/2) - ((size.width/2) + 4), height * 0.87, size.width + 8, 38);
	ctx.fillStyle = "#ffffff";
	ctx.fillText(title, width/2, Math.floor(height * 0.87));
});

if(typeof module !== "undefined") module.exports = Circles;