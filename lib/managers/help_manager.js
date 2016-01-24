'use strict';
const config = require('./config_manager.js');

function getName (cmd) {
  return `**${config.get('prefix')}${cmd.cmdName}**`;
}

function getPara (cmd) {
  if (typeof cmd.parameter === 'undefined') {
    return false;
  }
  let param = Object.keys(cmd['parameter']);
  let list = '';
  for (let i in param) {
    if (cmd.parameter[param[i]] === true)
      list += `<${param[i]}> / `;
    else list += `[${param[i]}] / `;
  }
  return list.substring(0, list.length - 3);
}

function getAliases (cmd) {
  if (typeof cmd.aliases === 'undefined') {
    return false;
  }
  let list = 'Aliases: ';
  for (let i in cmd.aliases) {
    list += `*${cmd.aliases[i]}* | `;
  }
  return list.substring(0, list.length - 3);
}

function getDesc (cmd) {
  if (typeof cmd.description !== 'undefined')
    return cmd.description;
  return false;
}

module.exports = {
  getName, getPara, getAliases, getDesc
}
