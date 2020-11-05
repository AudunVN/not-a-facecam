const gif = new Freezeframe('#cam img', {
	trigger: false,
	responsive: true
});

let isPlaying = false;


function start() {
	navigator.getUserMedia = navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia;
	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			audio: true
		}, function(stream) {
			let context = new AudioContext();
			let analyser = context.createAnalyser();
			let microphone = context.createMediaStreamSource(stream);
			let processor = context.createScriptProcessor(2048, 1, 1);

			analyser.smoothingTimeConstant = 0.8;
			analyser.fftSize = 1024;

			microphone.connect(analyser);
			analyser.connect(processor);
			processor.connect(context.destination);

			processor.onaudioprocess = function() {
				var array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				var values = 0;

				var length = array.length;
				for (var i = 0; i < length; i++) {
					values += (array[i]);
				}

				var average = values / length;

				if (average > 0.5) {
					if (!isPlaying) {
						gif.start();
					}
					
					isPlaying = true;
				} else {
					gif.stop();
					isPlaying = false;
				}

				console.log(average);
			}
		}, function(e) {
			console.log("The following error occured: " + e.name)
		});
	} else {
		console.log("getUserMedia not supported");
	}
}