'use strict';
const cmdName = 'av';
const parameter = {
  '@username': false
};
const description = 'sources for a user\'s avatar';

function execute (cmd) {
  if (cmd.users.list.length == 0)
    return cmd.reply('i don\'t see any users, did you incorrectly mention any?');

  if (typeof cmd.parameter === 'undefined')
    return cmd.reply(`your avatar URL is ${cmd.sender.avatarURL}`);

  for (var user in cmd.users.list) {
    user = cmd.users.list[user];
    if (user.avatarURL === null)
      cmd.reply(
        `**${user.username}** doesn't have an avatar, you won't find anything.`
      );
    else cmd.reply(`**${user.username}**'s avatar URL is ${user.avatarURL}`);
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute
}
