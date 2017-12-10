const input = {};

(function() {
	
	'use strict';
	
	// Get associated html element.
	input.element = $('#input');
	
	// Kitt.ai Snowboy client wrapper for hot word detection.
	// Only available for MacOS(darwin) and Linux.
	if (['darwin', 'linux'].indexOf(os.platform()) > -1) {
		const HotwordDetection = require('node-hotworddetector');
		const hotwordDetection = new HotwordDetection([
			{
				file: './app/data/snowboy/Ava.pmdl',
				sensitivity: '0.5',
				hotwords : 'Ava'
			}
		], {
			resource: './app/data/snowboy/common.res',
			audioGain: 2
		}, null);
		// On hotword event pause detection, invoke the trigger, and start recording.
		hotwordDetection.on('hotword', function(index, hotword, buffer) {
			hotwordDetection.pause();
			input.element.trigger('hotword', [ hotword ]);
			input.record();
		});
		
		// Start hot word detection.
		input.detect = function() {
			hotwordDetection.resume();
		}
	}
	
	// Wit.ai speech web API wrapper for natural language understanding.
	const WitSpeech = require('./scripts/libs/witSpeech.js');
	const witSpeechClient = new WitSpeech(require('./data/keys.json').wit, config.wit.version);
	// Audio recorder.
	const AudioRecorder = require('node-audiorecorder');
	const audioRecorder = new AudioRecorder({
		program: 'rec',
		sampleRate: 16000,
		silence: '4.0',
		threshold: 0.5
	}, console);
	
	input.record = function() {
		// Make web request.
		let witSpeechRequest = witSpeechClient.process('audio/wav', {}, function(error, response) {
			// Stop audio recorder.
			audioRecorder.stop().stream().unpipe(witSpeechRequest);
			if (error) {
				console.warn(error);
				return;
			}
			// Trigger received event.
			input.element.trigger('received', [ response ]);
		});
		console.log(witSpeechRequest);
		// Start audio recorder, and pipe audio stream to the web request.
		audioRecorder.resume().stream().pipe(witSpeechRequest);
	};
}());