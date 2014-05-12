var Bars = new Grapher(function(ctx, data, title) {
	var width = ctx.canvas.width = 600;
	var height = ctx.canvas.height = 340;

	data.frames.forEach(function(frame, i) {
		ctx.fillStyle = "rgb(" + frame.palette[0].join(",") + ")";

		var r = 1,
			t = data.frames.length,
			c = t/r,
			w = (width/c),
			h = (height/(t/c)),
			x = (i % c) * w,
			y = Math.floor(i/c) * h;

		ctx.fillRect(x, y, w, h);
	});


	ctx.font = "32px NeusaDemiBold";
	ctx.textBaseline = "top";
	title = title.toUpperCase();
	var size = ctx.measureText(title);

	ctx.fillStyle = "#000000";
	ctx.fillRect(10, height * 0.85, size.width + 4, 38);
	ctx.fillStyle = "#ffffff";
	ctx.fillText(title, 12, Math.floor(height * 0.85));
});

if(typeof module !== "undefined") module.exports = Bars;