var Wavie = require("../"),
	fs = require("fs"),
	path = require("path"),
	assert = require("assert");

const SAMPLE_FILE = path.resolve(__dirname, "sample/Cameron.mov");
const SAMPLE_MOVIE = "/Users/adrian/Downloads/Game.of.Thrones.S04E05.720p.HDTV.x264-KILLERS.mkv";

describe("Wavie", function() {
	describe("getMetadata", function() {
		it("should be a promise", function() {
			var promise = Wavie.getMetadata(SAMPLE_FILE);
			assert(promise instanceof Promise);
		});

		it("should retrieve the meta data", function(next) {
			Wavie.getMetadata(SAMPLE_FILE).then(function(metadata) {
				assert(metadata.streams);
				assert(metadata.format);
				next();
			}).catch(next);
		});
	});

	describe("screenshot", function() {
		it("Should screenshot the sample file at 00:00:01", function(done) {
			Wavie.screenshot(SAMPLE_MOVIE, 3600, "400x300").then(function(imageStream) {
				
				// Pipe it out
				// imageStream.;

				imageStream.on("end", function() {
					console.log("Reached the end.");
					done();
				}).pipe(fs.createWriteStream(path.resolve(__dirname, "sample/out.png")));
			});
		});
	});

	describe("getFrames", function() {
		it("should generate a waveform", function(done) {
			this.timeout(0);
			
			Wavie.getFrames(SAMPLE_MOVIE, 10, "400x300").then(function(frames) {
				frames.on("frame", function(frame, i) {
					frame.pipe(fs.createWriteStream(path.resolve(__dirname, "sample/" + i + ".png")));
				});

				frames.on("end", done);
			});
		});	
	});

	describe("collectData", function(next) {
		it("should collect frame data", function(done) {
			this.timeout(0);
			Wavie.collectData(SAMPLE_MOVIE, 10, "400x300").then(function(results) {
				results.on("frame", function(frame, stat) { console.log("Frame got.", stat); });
				results.on("end", function() { done(); });
			})
		});
	});
});