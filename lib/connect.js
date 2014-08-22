var io = require('socket.io-client'),
    q = require('q'),
    useragent = require('useragent');

var ManagerConnect = function (emitter, logger) {
    var log = logger.create('launcher.manager'),
        socket, self = this,
        alreadyRunningDefered;

    this.clientList = null;
    this.name = null;


    this.start = function (config, helper, done) {
        if (alreadyRunningDefered) {
            log.debug('Sauce Connect is already running or starting');
            return alreadyRunningDefered.promise;
        }
        alreadyRunningDefered = q.defer();
        socket = io.connect(config.url);

        var et = setTimeout(function () {
            socket.disconnect();
            throw new Error('Failed to connect to TDM on ' + config.url);
        }, 10000);

        socket.on('connect', function () {
            log.info('Connected to TDM on %s', config.url);
            socket.emit('control_client_hello', {'user_agent': 'karma-device-manager'});
            clearTimeout(et);
        });

        socket.on('connecting', function () {
            log.info('Connecting to TDM on %s', config.url);
        });

        socket.on('reconnecting', function () {
            log.info('Reconnecting to TDM on %s', config.url);
        });


        socket.on('connect_failed', function () {
            log.error('Failed to connect to TDM on %s', config.url);
        });
        socket.on('server_hello', function (data) {
            self.name = data['server_name'];
        });

        socket.on('message', function () {
            log.debug('message', arguments);
        });

        socket.on('client_list', function (clientList) {
            self.clientList = helper._.map(clientList, function (data, id) {
                var ua = useragent.parse(data.user_agent);
                data = {
                    browserFamily: ua.family,
                    browserVersion: ua.major,
                    platformFamily: ua.os.family,
                    id: id
                };
                return data;
            });

            if (!self.clientList.length) {
                log.warn('No browsers connected to %s.', self.name);
            } else {
                log.info('Browsers on %s:', self.name);
                helper._.each(self.clientList, function (data) {
                    log.info('%s on %s', helper._.values(data).join(' '));
                });
            }

            alreadyRunningDefered.resolve();
        });

        return alreadyRunningDefered.promise;
    };

    this.go = function (url, ids) {
        socket.emit('go', {url: url, client_list: ids});
    };

    emitter.on('exit', function (done) {
        if (socket) {
            socket.disconnect();
        }
        done();
    });
};

module.exports = ManagerConnect;