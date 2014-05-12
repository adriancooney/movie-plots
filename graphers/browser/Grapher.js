function Grapher(fn) {
	this.renderer = fn;
}

Grapher.prototype.graph = function(ctx, data, width, height) {
	this.renderer.call(this, data, ctx, width, height);
};

Grapher.getData = function(url) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();

		request.onload = function() {
			resolve(JSON.parse(this.responseText));
		};
		
		request.onerror = reject;

		request.open("get", url, true);
		request.send();
	});
};

