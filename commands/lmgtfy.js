'use strict';
const cmdName = 'lmgtfy';
const description = 'lets me google that for you.';

function execute (cmd) {
  cmd.parameter
  ? cmd.reply(`http://lmgtfy.com/?q=${cmd.args.join('+')}`)
  : cmd.reply('http://lmgtfy.com/?q=how+to+use+lmgtfy');
}

module.exports = {
  cmdName,
  description,
  execute,
}
