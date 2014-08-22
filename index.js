var ManagerConnect = require('./lib/connect');
var ManagerLauncher = require('./lib/launcher');

module.exports = {
    'managerConnect': ['type', ManagerConnect],
    'launcher:ManagerLauncher': ['type', ManagerLauncher]
};