'use strict';
const cmdName = 'uptime';
const description = 'i reply with my current uptime.';

function execute (cmd) {
  let uptime = cmd.bot.uptime;
  cmd.reply(
    `**Current uptime**: ${(Math.round(uptime/(1000*60*60)))} hours, ` +
    `${(Math.round(uptime/(1000*60))%60)} minutes, and ` +
    `${(Math.round(uptime/1000)%60)} seconds`
  );
}

module.exports = {
  cmdName,
  description,
  execute,
}
