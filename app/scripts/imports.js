// Imports generalized to be used by multiple objects within the applications.

// Configuration data.
const config = require('./config.js');
// Node.js modules.
const fs = require('fs'),
	os = require('os');
// Electron module.
const remote = require('electron').remote;
const dialog = remote.dialog;