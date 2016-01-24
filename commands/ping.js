'use strict';
const cmdName = 'ping';
const description = 'pong!';

function execute (cmd) {
  cmd.reply('**pong!**');
}

module.exports = {
  cmdName,
  description,
  execute,
}
