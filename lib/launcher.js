var _ = require('lodash');

var TDManagerLauncher = function (args, managerConnect, /* config.managerConnect */ config, logger, helper, baseLauncherDecorator, captureTimeoutLauncherDecorator, retryLauncherDecorator) {

    baseLauncherDecorator(this);
    captureTimeoutLauncherDecorator(this);
    retryLauncherDecorator(this);

    config = config || {};

    var log = logger.create('launcher.test-device-manager'),
        self = this;

    self.name = helper._.values(args.filter).join(' ');

    this.on('start', function (url, done) {

        var options = helper.merge(config.options, args, {
            filter: args.filter,
            tags: args.tags || config.tags || [],
            name: args.testName || config.testName || 'Karma test'
        });


        // Adding any other option that was specified in args, but not consumed from above
        // Useful for supplying chromeOptions, firefoxProfile, etc.
        for (var key in args) {
            if (typeof options[key] === 'undefined') {
                options[key] = args[key];
            }
        }

        managerConnect.start(config, helper).then(function () {
            var browsers = [];

            if (options.filter === null) {
                browsers = clientList;
            } else {
                browsers = helper._.where(managerConnect.clientList, options.filter);
            }

            if (!browsers.length) {
                log.error('Browser %s not found! Retry in 10 seconds...', self.name);
                setTimeout(function () {
                    self._done('failure');
                }, 10000);

            } else {
                managerConnect.go(url, helper._.pluck(browsers, 'id'));
            }
            done();
        });
    });
};

module.exports = TDManagerLauncher;