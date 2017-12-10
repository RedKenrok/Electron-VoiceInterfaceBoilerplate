'use strict';

const request = require('request');

// Speech API URL.
const URL_API = 'https://api.wit.ai/speech';

let ACCESS_TOKEN,
	VERSION;

class WitSpeech {
	/**
	 * Constructor of WitSpeech class.
	 * @param {string} accessToken Wit.ai server access token
	 * @param {string} version Wit.ai speech API version
	 * @returns this
	 */
	constructor(accessToken, version) {
		ACCESS_TOKEN = accessToken;
		VERSION = version;
		
		return this;
	}
	/**
	 * Creates web request for delivering an audio stream.
	 * @param {string} contentType Type of content
	 * @param {object} queryParameters Additional query arguments
	 * @param {function(error:string, response:object)} callback Callback for web response
	 * @returns Web request
	 */
	process(contentType, queryParameters, callback) {
		return request({
			url: URL_API,
			qs: queryParameters,
			method: 'POST',
			json: true,
			headers: {
				'Authorization': 'Bearer ' + ACCESS_TOKEN,
				'Accept': 'application/vnd.wit.' + VERSION + '+json',
				'Content-Type': contentType
			}
		}, function(error, response, body) {
			if (response && response.statusCode != 200) {
				error = 'Invalid response received from server: ' + response.statusCode;
			}
			callback(error, body);
		});
	}
}

module.exports = WitSpeech;