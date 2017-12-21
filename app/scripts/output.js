const output = {};

(function() {
	
	'use strict';
	
	// Get associated html element.
	output.element = $('#output');
	
	// Speech synthesis.
	const speechSynthesis = window.speechSynthesis;
	// Message.
	const message = new SpeechSynthesisUtterance();
	message.lang = config.language.code;
	
	// When the message is finished.
	message.onend = function(event) {
		output.element.trigger('end', [ message.text ]);
	};
	
	// Start the speech synthesis.
	output.speak = function(transcript) {
		console.log('Output.speak: ' + transcript);
		message.text = transcript;
		speechSynthesis.speak(message);
	};
}());