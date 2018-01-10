const input = {};

(function() {
	
	'use strict';
	
	// Get associated html element.
	input.element = $('#input');
	
	// Kitt.ai Snowboy client wrapper for hot word detection.
	// Only available for MacOS(darwin) and Linux.
	if (['darwin', 'linux'].indexOf(os.platform()) > -1) {
		let hotwordConfigurationPath = './app/data/snowboy/configuration.json';
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
	const AudioRecorder = require('node-audiorecorder');
	const audioRecorder = new AudioRecorder({
		silence: 2
	}, console);
	
	// Key paths
	const KEYPATH_GOOGLECLOUD = './app/keys/google-cloud.json',
		  KEYPATH_WITAI = './app/keys/wit-ai.json';
	
	// Google Cloud Platform
	if (fs.existsSync(KEYPATH_GOOGLECLOUD)) {
		// Google Cloud Speech.
		const Speech = require('@google-cloud/speech');
		const speech = new Speech.SpeechClient({
			keyFilename: JSON.parse(fs.readFileSync(KEYPATH_GOOGLECLOUD, 'utf8'))
		});
		// Setup speech request.
		const speechRequest = {
			config: {
				encoding: 'LINEAR16',
				sampleRateHertz: 16000,
				languageCode: config.language.code + '-' + config.language.region
			},
			interimResults: false
		}
		// Google Cloud Language.
		const Language = require('@google-cloud/language');
		const language = new Language.LanguageServiceClient({
			keyFilename: JSON.parse(fs.readFileSync(KEYPATH_GOOGLECLOUD, 'utf8'))
		});
		
		// Record function.
		input.record = function(buffer) {
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
							
							// Trigger received event.
							input.element.trigger('received', [ results[0].entities ]);
						})
						.catch(function(error) {
							console.error('ERROR', error);
						});
				});
			// Start streaming audio to web stream.
			audioRecorder.resume().stream()
				.pipe(stream);
		};
	}
	// Wit.ai
	else if (fs.existsSync(KEYPATH_WITAI)) {
		// Get the keys.
		let keys = JSON.parse(fs.readFileSync(KEYPATH_WITAI, 'utf8'));
		
		// Wit.ai speech wrapper.
		const WitSpeech = require('witspeech');
		const witSpeech = new WitSpeech(
			// Prefer the client key over the server key.
			keys.client != null ? keys.client : keys.server,
			// Get API version from configuration.
			config.wit.version
		);
		
		// Record function.
		input.record = function(buffer) {
			// Create web request.
			let witSpeechRequest = witSpeech.request('audio/wav', {}, function(error, response) {
				if (error) {
					console.error('ERROR', error);
					return;
				}
				// Trigger received event.
				input.element.trigger('received', [ response ]);
			});
			// Start audio recorder, and pipe audio stream to the web request.
			audioRecorder.resume().stream()
				.pipe(witSpeechRequest);
		}
	}
	// If no service configured display a warning message.
	else if (service !== SERVICE_GOOGLE && service !== SERVICE_WIT) {
		console.warn('No speech processing service configured, see the keys section of the README.md file for how to set this up.');
		
		// Record function.
		input.record = function(buffer) {
			console.log('start recording');
			// Start streaming audio to web stream.
			audioRecorder.resume().stream();
			audioRecorder.stream().on('data', function(data) {
				console.log('receiving data');
			});
		};
	}
}());