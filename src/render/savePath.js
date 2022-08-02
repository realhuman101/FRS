const path = require('path');

function findSavePath () {
	switch(process.platform) {
		case 'darwin': {
		  return path.join(process.env.HOME, 'Library', 'Application Support', 'frs');
		}
		case 'win32': {
		  return path.join(process.env.APPDATA, 'frs');
		}
		case 'linux': {
		  return path.join(process.env.HOME, 'frs');
		}
	}
};

module.exports = {findSavePath}