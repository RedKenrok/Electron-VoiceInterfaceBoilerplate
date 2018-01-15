const output = {};

(function() {
	
	'use strict';
	
	// Get associated html element.
	output.element = document.getElementById('output');
	
	// Google Synthesis module.
	const GoogleSynthesis = require('googlesynthesis');
	const googleSynthesis = new GoogleSynthesis(true);
	
	// Audio player.
	const audio = new Audio();
	
	output.speak = function(transcript, language, speed) {
		let urls = googleSynthesis.request(transcript, language, speed);
		
		// Setup listener so it cycles through playing each url.
		let index = 0;
		audio.addEventListener('ended', function() {
			index++;
			
			if (index >= urls.length) {
				audio.removeEventListener('event', this);
				return;
			}
			
			audio.src = urls[index];
			audio.play();
		});
		
		// Set first source.
		audio.src = urls[index];
		audio.play();
	}
}());