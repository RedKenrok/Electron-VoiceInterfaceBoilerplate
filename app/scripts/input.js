const input = {};

(function() {
	
	'use strict';
	
	// Get associated html element.
	input.element = $('#input');
	
	// Kitt.ai Snowboy client wrapper for hot word detection.
	// Only available for MacOS(darwin) and Linux.
	if (['darwin', 'linux'].indexOf(os.platform()) > -1) {
		const hotwordConfigurationPath = './app/data/snowboy/configuration.json';
		const HotwordDetector = require('node-hotworddetector');
		let hotwordDetector;
		
		// Check if file exists.
		if (fs.existsSync(hotwordConfigurationPath)) {
			// Parse file to JSON.
			let hotwordConfiguration = JSON.parse(fs.readFileSync(hotwordConfigurationPath, 'utf8'));
			// Initialize hotword detector.
			hotwordDetector = new HotwordDetector(hotwordConfiguration.detector, hotwordConfiguration.models, hotwordConfiguration.recorder);
			
			// On hotword event pause detection, invoke the trigger, and start recording.
			hotwordDetector.on('hotword', function(index, hotword, buffer) {
				input.element.trigger('hotword', [ hotword, buffer ]);
			});
		}
		else {
			console.warn('Unable to locate configuration.json for snowboy hotword detection.');
		}
		
		// Control hot word detection.
		input.detect = function(enabled) {
			// If the detection needs to be disabled.
			if (enabled != null && enabled === false) {
				hotwordDetector.pause();
				return;
			}
			
			// Enables detection otherwise.
			if (!hotwordDetector) {
				console.error('hotword detector no initialized yet.');
			}
			hotwordDetector.resume();
		}
	}
	
	// Audio recorder.
	const audioRecorderProgram = (['darwin', 'linux'].indexOf(os.platform()) > -1) ? 'rec' : 'sox';
	const AudioRecorder = require('node-audiorecorder');
	const audioRecorder = new AudioRecorder({
		program: audioRecorderProgram,
		silence: 2
	}, console);
	// Google Cloud Speech.
	const Speech = require('@google-cloud/speech');
	let speech = new Speech.SpeechClient({
		keyFilename: './app/data/key-google-cloud.json'
	});
	let request = {
		config: {
			encoding: 'LINEAR16',
			sampleRateHertz: 16000,
			languageCode: config.language.code + '-' + config.language.region
		},
		interimResults: false
	}
	// Google Cloud Language.
	const Language = require('@google-cloud/language');
	let language = new Language.LanguageServiceClient({
		keyFilename: './app/data/key-google-cloud.json'
	});
	
	input.record = function(buffer) {
		console.log('start recording');
		// Start streaming audio to web stream.
		audioRecorder.resume().stream();
		audioRecorder.stream().on('data', function(data) {
			console.log('receiving data');
		});
		/*
		// Start web stream.
		let stream = speech.streamingRecognize(request)
			.on('error', console.error)
			.on('data', function(data) {
				console.log(`Transcription: ${data.results[0].alternatives[0].transcript}`);
				
				// Start analyzing the entities of the transcript.
				language.analyzeEntities({
					document: {
						content: data.results[0].alternatives[0].transcript,
						type: 'PLAIN_TEXT'
					}
				})
					.then(function(results) {
						let entities = results[0].entities;
						
						// log results.
						entities.forEach(entity => {
							console.log(entity.name);
							console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
							if (entity.metadata && entity.metadata.wikipedia_url) {
								console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}$`);
							}
						  });
					})
					.catch(function(error) {
						console.error('ERROR', error);
					});
			});
		// Start streaming audio to web stream.
		audioRecorder.resume().stream()
			.pipe(stream);
		*/
	};
}());