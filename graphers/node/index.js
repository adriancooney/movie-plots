var Canvas = require("canvas"),
	path = require("path"),
	fs = require("fs"),
	canvas = new Canvas(600, 600),
 	ctx = canvas.getContext("2d");

// To accomodate for the browser lack of require compatability
// and my laziness to download the entire internet with gulp
// and browserify, I'm creating a global. Yeah, you heard me.
// Please, I don't normally code like this. I DONT
// I SWEAR
// PLEASE BELIEVE ME
global.Grapher = function(fn) {
	this.renderer = fn;
};

Grapher.prototype.graph = function(ctx, data, title) {
	ctx.save();
	this.renderer.call(this, ctx, data, title);
	ctx.restore();
};

// Now require the graphers
var graphers = require("../");

// Get the films
var films = fs.readdirSync(path.resolve(__dirname, "../../data")).filter(function(v) { return v.match(/\.json$/) });

// Do each film
films.forEach(function(film) {
	// First of all get the data
	var data = require(path.resolve(__dirname, "../../data", film));

	// Remove the json
	film = film.replace(".json", "");
	var title = film.replace(/\-/g, " ").replace(/(?:\ |^)(\w)/g, function(a, b) { return ((a.length > 1) ? " " : "") + b.toUpperCase(); });

	console.log("Saving " + title + ".");

	for(var grapher in graphers) {
		// Graph the bastard
		graphers[grapher].graph(ctx, data, title);
		// Save the bastard. Why sync? WHY THE FUCK NOT
		fs.writeFileSync(path.resolve(__dirname, "../../graphs/" + film + "-" + grapher.toLowerCase() + ".png"), canvas.toBuffer());
	}
});