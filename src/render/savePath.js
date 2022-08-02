const path = require('path');

function findSavePath () {
	switch(process.platform) {
		case 'darwin': {
		  return path.join(process.env.HOME, 'Library', 'Application Support', 'frs', 'save.json');
		}
		case 'win32': {
		  return path.join(process.env.APPDATA, 'frs', 'save.json');
		}
		case 'linux': {
		  return path.join(process.env.HOME, 'frs', 'save.json');
		}
	}
};

module.exports = {findSavePath}