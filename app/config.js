const package = require('../package.json');

module.exports = {
	app: {
		id: 'nl.rondekker.'.concat(package.name),
		name: package.productName,
		about: 'https://'.concat([ package.name, '.RonDekker.nl' ]),
		repository: 'https://GitHub.com/RedKenrok/'.concat(package.name),		
	},
	language: {
		code: 'en',
		region: 'GB'
	}
};