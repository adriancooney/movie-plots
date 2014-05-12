var Waveform = new Grapher(function(ctx, data, title) {
	var width = ctx.canvas.width = 600;
	var height = ctx.canvas.height = 340;

	ctx.fillStyle = "#000000";

	data.frames.forEach(function(frame, i) {

		var color = frame.palette[0],
			baseline = height/2,
			h = 100,
			w = width/data.frames.length;

		// Calculate luminance
		// http://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
		var R = color[0], G = color[1], B = color[2];

		var brightness = (0.2126*R + 0.7152*G + 0.0722*B);
		// var brightness = (0.299*R + 0.587*G + 0.114*B);
		// var brightness = Math.sqrt(0.241*Math.pow(R, 2) + 0.691*Math.pow(G, 2) + 0.068*Math.pow(B, 2));

		var bh = h * (brightness/255);

		ctx.fillRect(i * w, baseline - bh, w, bh*2);
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


if(typeof module !== "undefined") module.exports = Waveform;