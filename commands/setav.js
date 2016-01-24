'use strict';
const base64 = require('node-base64-image');

const cmdName = 'setav';
const parameter = {
  'link': true
};
const description = 'changes my avatar and changes my identity \\:D';

function execute (cmd) {
  let args = cmd.args;
  if (typeof cmd.parameter === 'undefined') {
    cmd.reply('please specify an image link.');
    return;
  }
  base64.base64encoder(args[0], {
    string: true
  }, (err, image) => {
    if (err) {
      console.log(err);
      return;
    }
    else {
      var buf = new Buffer(image, 'base64');
      cmd.bot.updateDetails({
        'avatar': buf
      });
    }
  });
  cmd.reply('changed my avatar. do i look better now?');
  console.log(`${cmd.sender} changed the bot's avatar.`);
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
