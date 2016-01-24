'use strict';
const cmdName = 'info';
const description = 'returns my information';

function execute (cmd) {
  const main = require('../harubot.js');
  let msg = [];
  const bot = cmd.bot;
  msg.push(`**${bot.user.username}**`);
  msg.push(`Running on harubot v${main.version} designed by ` +
    '<@84679007789936640>');
  msg.push(
    `Current uptime: ${(Math.round(bot.uptime/(1000*60*60)))} hours, ` +
    `${(Math.round(bot.uptime/(1000*60))%60)} minutes, and ` +
    `${(Math.round(bot.uptime/1000)%60)} seconds`
  );
  msg.push(
    `Connected to **${bot.servers.length}** servers, ` +
    `**${bot.channels.length}** channels and ` +
    `**${bot.users.length}** different users`
  );
  cmd.send(msg);
  console.log(`${cmd.sender.username} requested the bot's status.`);
}

module.exports = {
  cmdName,
  description,
  execute,
}
