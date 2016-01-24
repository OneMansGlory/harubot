'use strict';
const cmdName = 'whois';
const parameter = {
  '@username': true
};
const description = 'sources for a user\'s avatar so you can steal it.';

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined')
    return cmd.reply('who are you trying to \'whois\'...?');

  if (cmd.users.list.length === 0)
    return cmd.reply('i don\'t see any users, did you incorrectly mention any?');

  for (let user in cmd.users.list) {
    user = cmd.users.list[user];
    let info = [];
    info.push('```');
    info.push(`Name: ${user.username}`);
    info.push(`ID: ${user.id}`);
    info.push(`Discriminator: ${user.discriminator}`);
    info.push(`Avatar URL: ${user.avatarURL}`);
    info.push('```')
    cmd.send(info);
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
