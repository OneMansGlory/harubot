'use strict';
const cmdName = 'serverlist';
const description = 'i list down all the servers i\'m connected to.';

function execute (cmd) {
  var info = [];
  var msg = cmd.msg;
  var bot = cmd.bot;
  info.push(
    `**Server List**\nConnected to ${bot.servers.length} servers, ${
      bot.channels.length} channels and ${bot.users.length} users.\n`
  );
  for (var server of bot.servers) {
    var str = '';
    var online = 0;
    str += `**${server}** has ${server.members.length} members (`;
    online = server.members.reduce(
      (count, member) => count + (member.status === 'online' ? 1 : 0), 0);
    str += `${online} online)`;
    info.push(str);
  }
  cmd.send(info);
}

module.exports = {
  cmdName,
  description,
  execute
}
