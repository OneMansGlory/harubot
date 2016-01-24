'use strict';
const cmdName = 'join';
const parameter = {
  'invite link': true
};
const description = 'joins a server with an invite link supplied.';

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined')
    return cmd.reply('please specify an invite link.');
  var invite = cmd.parameter;
  cmd.bot.joinServer(invite, (err, server) => {
    if (err) {
      console.log(err);
      return cmd.reply(`error ${err}. check that invite link?`);
    }
    console.log(
      `${cmd.bot.user.username} has joined '${server.name}' under ${cmd.sender.username}'s command.`
    );
    cmd.reply(
      `i have joined '**${server.name}**'.`
    );
  });
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
