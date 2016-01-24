'use strict';
const cmdName = 'ping';
const description =
  'i reply with pong! my dimwit creators use it to check if i\'m alive.';

function execute (cmd) {
  cmd.reply('**pong!**');
}

module.exports = {
  cmdName,
  description,
  execute,
}
