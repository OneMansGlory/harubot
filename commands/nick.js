'use strict';
const config = require('../lib/managers/config_manager.js');

const cmdName = 'nick';
const parameter = {
  '@username': false
};
const description = 'name change, whee.';

function execute (cmd) {
  const args = cmd.args.join(' ');
  if (typeof cmd.parameter === 'undefined') {
    let name = config.get('name');
    cmd.bot.setUsername(name);
    console.log(
      `${cmd.sender.username} reverted the bot's name to ${name}`
    );
  } else {
    let name = args;
    cmd.bot.setUsername(name);
    console.log(`${cmd.sender.username} changed the bot's name to ${name}`);
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
