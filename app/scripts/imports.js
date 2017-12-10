// Imports generalized to be used by multiple objects within the applications.

// Configuration data.
const config = require('./config.js');
// Jquery library.
global.$ = require('jquery');
// Node.js modules.
const os = require('os');
// Electron module.
const { remote } = require('electron');
const { dialog } = remote;
// Other modules.
const settings = require('electron-settings');