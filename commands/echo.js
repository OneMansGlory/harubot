'use strict';
const cmdName = 'echo';
const description = 'i serve as your echo.';

function execute (cmd) {
  cmd.send(cmd.args.join(' '));
}

module.exports = {
  cmdName,
  description,
  execute,
}
