var MMCQ = require("./lib/quantize.js");

module.exports = function stat(imageData, width, height) {
	// Make the pixel array
	var pixels = [], threshold = 10;

	var r, g, b;

	for(var i = 0, cache = width * height; i < cache; i += threshold) {
		var pixel = i * 4;

		r = imageData[i]; g = imageData[i + 1]; b = imageData[i + 2];

		if(r < 250 && g < 250 && b < 250)
			pixels.push([r, g, b]);
	}

	var cmap = MMCQ.quantize(pixels, 8),
		palette = cmap.palette();

	return {
		width: width,
		height: height,
		palette: palette
	}
};