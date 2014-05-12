var spawn = require("child_process").spawn,
	stream = require("stream"),
	EventEmitter = require("events").EventEmitter,
	fs = require("fs"),

	imageStat = require("./stat"),
	png = require("pngjs").PNG;

/**
 * Container for Wavie.
 * @type {Object}
 */
var Wavie = {};

Wavie.spawn = function(command, arguments, callback) {
	// console.log(command + " " + arguments.join(" "));
	return spawn(command, arguments, callback);
};

/**
 * Get metadata of a video file.
 * @param  {String}   file
 * @return {Promise}
 */
Wavie.getMetadata = function(filename) {
	return new Promise(function(resolve, reject) {
		var ffprobe = Wavie.spawn("ffprobe", 
			["-v", "quiet", 
			"-print_format", "json", 
			"-show_format", 
			"-show_streams",
			// "-count_frames",
			"-select_streams", "v",
			filename]);

		var metadata = "";
		ffprobe.stdout.on("data", function(chunk) {
			metadata += chunk;
		});

		ffprobe.on("error", reject);

		ffprobe.on("close", function() {
			try {
				metadata = JSON.parse(metadata);

				if(!metadata.format || !metadata.streams) reject(new Error("File not found."));
				else resolve(metadata);
			} catch(e) { reject(e); }
		})
	});
};

/**
 * Create a screenshot at specific point in an input file. Resolves with image stream.
 * @param  {String} input 		The filename.
 * @param  {Number} timestamp 	Time in seconds to screenshot at.
 * @param  {String} size 		"[width]x[height]"
 * @param  {String} format 		ffmpeg format. Defalts to "mjpeg"
 * @return {Promise}
 */
Wavie.screenshot = function(input, timestamp, size, format) {
	return new Promise(function(resolve, reject) {
		var screenshot = Wavie.spawn("ffmpeg", 
			["-ss", timestamp,
			"-r", 1,
			"-i", input,
			"-s", size,
			"-f", format || "image2",
			"-vcodec", "png",
			"-"]);

		resolve(screenshot.stdout);
	});
};

/**
 * Get frames of a movie file.
 * @param  {String} input The input file path.
 * @param  {Number} frames The amount of frames.
 * @param  {String} size The frame scale string e.g. "400x300"
 * @return {Promise}
 */
Wavie.getFrames = function(input, frames, size) {
	// First check if the file exists
	return Wavie.getMetadata(input).then(function(metadata) {
		return new Promise(function(resolve, reject) {

			// I can't seem to find if ffprobe orders the streams from
			// best to worst so I'm going to assume the top stream is the
			// best stream. I hate using the word assume. Screams bugs.
			if(!metadata.streams) throw new Error("No video stream.");

			var stream = metadata.streams[0],
				duration = Math.floor(parseFloat(metadata.format.duration));

			if(frames > duration) throw new Error("I'm afraid I can't extract more frames than there is seconds for reasons."); 

			// Create an emitter for frames
			var emitter = new EventEmitter();

			resolve(emitter);

			// For reasons I don't understand, unless the process waits until the next tick
			// The first two frames are lost because the event listeners aren't binded yet.
			setTimeout(function getFrame(frame) {
				var timestamp = Math.floor((duration/frames) * frame);
				if(frame < frames) Wavie.screenshot(input, timestamp, size).then(function(shot) {
						emitter.emit("frame", shot, frame, timestamp, getFrame.bind(null, frame + 1));
					}).catch(emitter.emit.bind(emitter, "error"));
				else emitter.emit("end");
			}, 1, 0);
		});
	});
};

/**
 * Collect frame data from an input file.
 * @param  {String} input
 * @param  {Number} frames
 * @param  {String} size
 * @return {Promise}
 */
Wavie.collectData = function(input, frames, size) {
	return new Promise(function(resolve, reject) {
		var data = { frames: [] },
			emitter = new EventEmitter();

		Wavie.getFrames(input, frames, size).then(function(frames) {
			frames.on("frame", function(frame, i, timestamp, next) {
				// Pipe to folder
				// frame.pipe(fs.createWriteStream(__dirname + "/data/the-dark-knight/frame-" + i + ".png"));

				// Parse the png file
				frame.pipe(new png())
					.on("parsed", function() {
						// Gather image statistics
						var stat = imageStat(this.data, this.width, this.height);

						// Add some other data
						stat.frame = i;
						stat.timestamp = timestamp;
						data.frames.push(stat);

						emitter.emit("frame", frame, stat);

						// Onto the next
						next();
					})
					.on("error", emitter.emit.bind(emitter, "error"));
			});

			frames.on("end", function() {
				emitter.emit("end", data);
			});

			frames.on("error", emitter.emit.bind(emitter, "error"));
		}).catch(emitter.emit.bind(emitter, "error"));

		resolve(emitter);
	});
};

module.exports = Wavie;