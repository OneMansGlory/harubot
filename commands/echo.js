'use strict';
const cmdName = 'echo';
const description = 'echoes whatever is sent.';

function execute (cmd) {
  cmd.send(cmd.args.join(' '));
}

module.exports = {
  cmdName,
  description,
  execute,
}
