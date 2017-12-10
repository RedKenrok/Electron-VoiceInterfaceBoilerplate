// Get elctron module.
const electron = require('electron');
// Get application and browser module.
const { app, BrowserWindow, Menu, shell } = electron;

// When the app is ready.
app.on('ready', function() {
		// Get app config.
		const { name, about, repository } = require('./config.js');
		// Menu template
		const template = [
			{
				label: 'App',
				submenu: []
			}, {
				label: 'Window',
				submenu: []
			}, {
				label: 'Help',
				submenu: [
					{
						label: 'Documentation',
						click() { shell.openExternal(about) }
					}, {
						label: 'Repository',
						click() { shell.openExternal(repository) }
					}, {
						label: 'Issues',
						click() { shell.openExternal(repository.concat('/issues')) }
					}
				]
			}
		];
		// Modify template based on platform.
		switch(process.platform) {
			default:
				// App menu.
				template[0].submenu = [
					{
						label: 'Learn more',
						click() { shell.openExternal(about) }
					},
					{ type: 'separator' },
					{ role: 'minimize' },
					{ role: 'close' },
					{ role: 'quit' }
				];
				// Window menu.
				template[1].submenu = [
					{ role: 'reload' },
					{ role: 'forcereload' },
					{ type: 'separator' },
					{ role: 'resetzoom' },
					{ role: 'zoomin' },
					{ role: 'zoomout' },
					{ type: 'separator' },
					{ role: 'togglefullscreen' }
				];
				break;
			case 'darwin':
				// App menu.
				template[0].label = name;
				template[0].submenu = [
					{ role: 'about' },
					{
						label: 'Learn more',
						click() { shell.openExternal(about) }
					},
					{ type: 'separator' },
					{ role: 'services' },
					{ type: 'separator' },
					{ role: 'minimize' },
					{ role: 'close' },
					{ role: 'quit' }
				];
				// Window menu.
				template[1].submenu = [
					{ role: 'reload' },
					{ role: 'forcereload' },
					{ type: 'separator' },
					{ role: 'resetzoom' },
					{ role: 'zoomin' },
					{ role: 'zoomout' },
					{ role: 'zoom' },
					{ type: 'separator' },
					{ role: 'hide' },
					{ role: 'hideothers' },
					{ role: 'unhide' },
					{ role: 'front' },
					{ type: 'separator' },
					{ role: 'togglefullscreen' }
				];
				// Help menu.
				template[3].submenu.pop({ role: 'startspeaking' });
				template[3].submenu.pop({ role: 'stopspeaking' });
				break;
		}
		// Set app menu.
		Menu.setApplicationMenu(Menu.buildFromTemplate(template));
		
		// Create window.
		createWindow();
		
		// Re-create window when dock icon clicked.
		app.on('activate', function() {
				if (window === null) {
					createWindow();
				}
			});
		// Open window.
		app.on('activate-with-no-open-windows', function() {
				window.show();
			});
		// Explicitly quit outside of OSX.
		app.on('window-all-closed', function() {
				if (process.platform !== 'darwin') {
					app.quit();
				}
			});
	});
	
// Global reference of the window.
let window;
// Creates app window.
function createWindow() {
	// Get window state.
	let windowState = new require('electron-window-state')({
			defaultWidth: 720,
			defaultHeight: 540
		});
	// Create window.
	window = new BrowserWindow({
			backgroundColor: '#fff',
			/*devTools: false,*/
			show: false,
			title: 'Music',
			minWidth: 720,
			minHeight: 540,
			width: windowState.width,
			height: windowState.height,
			x: windowState.x,
			y: windowState.y
		});
	// Manage window state.
	windowState.manage(window);
	
	// Hide menu bar.
	window.setMenuBarVisibility(false);
	window.setAutoHideMenuBar(true);
	
	// Open developer tools.
	window.webContents.openDevTools();
	
	// Load main.html.
	window.loadURL(
		require('url').format({
				pathname: require('path').join(__dirname, 'main.html'),
				protocol: 'file:',
				slashes: true
			})
		);
	
	// On ready to show.
	window.once('ready-to-show', function(event) {
			// Show window.
			window.show();
			window.focus();
		});
	window.on('closed', function(event) {
			window = null;
		});
}