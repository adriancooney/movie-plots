(function main() {
	var canvas = document.createElement("canvas"),
		ctx = canvas.getContext("2d");

	var films = ["127-hours", "american-psycho", "avatar", "dallas-buyers-club", "fight-club",
		"inception", "scott-pilgrim-vs-the-world", "the-dark-knight", "tron-legacy", "wolf-of-wall-street"];

	var graphers = ["Bars", "Circles", "Waveform"];

	// Add the canvas
	document.body.appendChild(canvas);

	// Current settings. Sorry this is so stupid.
	window.currentGrapher = graphers[0];
	window.currentFilm = films[0];

	// Create the options
	[films, graphers].forEach(function(list, i) {
		var select = document.createElement("select");

		list.forEach(function(item) {
			var option = document.createElement("option");
			option.value = item;
			option.textContent = item;
			select.appendChild(option);
		});

		document.body.appendChild(select);

		select.addEventListener("change", function() {
			console.log(this);
			window["current" + ["Film", "Grapher"][i]] = this.value;
			draw();
		});
	});

	// Create the save button
	var save = document.createElement("a");
	save.textContent = "Save";
	document.body.appendChild(save);

	// Actualy canvas drawing
	function draw() {
		Grapher.getData("../data/" + window.currentFilm + ".json").then(function(data) {
			window[window.currentGrapher].graph(data, ctx);

			save.download = window.currentFilm + ".png";
			save.href = canvas.toDataURL();
		});
	}

	draw();
})();