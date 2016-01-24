'use strict';
const path = require('path');
const Discord = require('discord.js');

const help_manager = require('../lib/managers/help_manager.js');

const cmdName = 'help';
const parameter = {
  'command': false
};
const description = 'come on, it\'s a \'help\' command.';

function execute (cmd) {
  const cmds = (function() {
    return require('require-all')({
      dirname: path.join(__dirname, '../commands'),
      filter: /(.+)\.js$/,
      recursive: false
    });
  }());

  let indiv = typeof cmd.parameter !== 'undefined';
  let reply = [];

  for (let c in cmds) {
    c = cmds[c]
    if (indiv && (cmd.parameter !== c.cmdName))
      continue;

    if (help_manager.getPara(c))
      reply.push(`${help_manager.getName(c)} ${help_manager.getPara(c)}`);
    else
      reply.push(help_manager.getName(c));

    if (help_manager.getAliases(c))
      reply.push(help_manager.getAliases(c));

    if (help_manager.getDesc(c))
      reply.push(`\t- ${help_manager.getDesc(c)}\n`);

  }

  if (reply.length === 0)
    return cmd.reply('no command exists by that name.');
  else {
    if (!(cmd.msg.channel instanceof Discord.PMChannel))
      cmd.reply('check your DMs in a bit.');
    return cmd.pm(reply);
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
