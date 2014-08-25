# karma-tdm-launcher
[![Dependency Status](https://david-dm.org/bazilio91/karma-tdm-launcher.svg)](https://david-dm.org/bazilio91/karma-tdm-launcher)
[![devDependency Status](https://david-dm.org/bazilio91/karma-tdm-launcher/dev-status.svg)](https://david-dm.org/bazilio91/karma-tdm-launcher#info=devDependencies)

> Run your unit tests on anywhere

## Installation

Install `karma-tdm-launcher` as a `devDependency` in your package.json:

```bash
npm install bazilio91/karma-tdm-launcher --save-dev
```

## Usage

This launcher allows to run tests in any browser connected to [test-device-manager](https://github.com/karma-runner/test-device-manager) 

### Adding karma-tdm-launcher to an existing Karma config

To configure this launcher, you need to add two properties to your top-level Karma config, `managerConnect` and `customLaunchers`, set the `browsers` array to use Connected browsers.

The `managerConnect` object defines global properties for each browser/platform while the `customLaunchers` object configures individual browsers.

```js
module.exports = function(config) {
  var customLaunchers = {
    dtm_chrome: {
      base: 'ManagerLauncher',
        filter: {
          browserFamily: 'Safari',
          platformFamily: 'Mac OS X'
        }
    }
  };

  config.set({

    // The rest of your karma config is here
    // ...
    managerConnect: {
        url: 'http://url.to.tdm:8080'
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['dots']
    singleRun: true
  });
};
```
