'use strict';
const DiscordClient = require('./lib/DiscordClient');
const version = '0.1.0';

// Reloads the bot by creating a child process, then terminating itself
function restart () {
  const child = require('child_process').fork(__filename);
  child.on('message', (msg) => {
    if (msg === 'online') {
      console.log('Terminating parent instance of bot.');
      process.exit(0);
    }
  });
}

// Catches all errors that aren't caught and relaying them to console.
// Used for reloads where the child process can't be started due to errors.
process.on('uncaughtException', (err) => {
  console.log('Caught exception: ' + err);
  console.log(err.stack);
  process.exit(1);
});

const configs = (function reloadConfigs () {
  const config = require('./lib/managers/config_manager.js').reload().parse();
  const perms = require('./lib/managers/perms_manager.js').reload().parse();

  return {
    get: (val) => {
      return config.get(val) || perms.get(val);
    }
  }
})()

const discord = new DiscordClient(configs.get('email'), configs.get('password')).init();

module.exports = {
  version, restart, configs,
}
