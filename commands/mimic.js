'use strict';
const base64 = require('node-base64-image');
const request = require('superagent');

const config = require('../lib/managers/config_manager.js');

const cmdName = 'mimic';
const parameter = {
  '@username': true
};
const description = 'ditto!';

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined') {
    request
      .patch('https://discordapp.com/api/users/@me')
      .set('User-Agent',
        'superagent/1.6.0 DiscordBot (https://github.com/Pyraxo/harubot, v1.1.0)'
      )
      .set('authorization', cmd.bot.internal.token)
      .send({
        avatar: null,
        email: cmd.bot.internal.email,
        password: cmd.bot.internal.password,
        username: config.get('name')
      }).end((err, response) => {
        if (err) console.log(err.stack);
        cmd.reply('reverting to old look.');
      });
    return;
  }

  if (cmd.users.list.length === 0) {
    cmd.reply('i don\'t see any users, did you incorrectly mention any?');
    return;
  }

  if (cmd.users.list.length > 1) {
    cmd.reply('i can\'t mimic more than one user!');
    return;
  }

  let user = cmd.users.list[0];
  if (user.avatarURL === null) {
    cmd.bot.setUsername(user.username);
  } else if (user.avatarURL !== null) {
    base64.base64encoder(user.avatarURL, {
      string: true
    }, (err, image) => {
      if (err) console.log(err.stack);
      let buf = new Buffer(image, 'base64');
      cmd.bot.updateDetails({
        'avatar': buf,
        'username': user.username
      });
    });
  }

  return cmd.reply(`mimicking ${user.username}!`);
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
