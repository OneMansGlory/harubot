'use strict';

const cmdName = 'perms';
const parameter = {
  'fetch': true,
  'permit': true,
  'forbid': true,
  'clone': true
};
const description = 'some permissions jargon and internal settings.';

function execute (cmd) {
  const perms = require('../lib/managers/perms_manager.js');
  const args = cmd.args;
  if (typeof cmd.parameter === 'undefined' || args.length == 1) {
    return cmd.reply(
      `insufficient arguments! issue *${cmd.prefix}help ${this.cmdName}* for more info`
    );
  }

  if (cmd.users.list.length === 0) {
    return cmd.reply('i don\'t see any users, did you incorrectly mention any?');
  }

  switch (cmd.parameter) {
    case 'fetch':
      for (let user in cmd.users.list) {
        user = cmd.users.list[user];
        cmd.code(perms.getPerms(user.id));
      }
      break;

    case 'permit':

      if (cmd.users.list.length === 0) {
        cmd.reply('i don\'t see any users, did you incorrectly mention any?');
        break;
      }

      if (args.length === 2) {
        cmd.reply('i haven\'t received enough arguments. try again.');
        break;
      }

      if (/<@\d{17,18}>/g.test(args[1]) || /\d{17,18}/g.test(args[1])) {
        cmd.reply('check your arguments, i think you messed up a little.');
        break;
      }

      for (let user in cmd.users.list) {
        user = cmd.users.list[user];
        perms.addPerm(user.id, args[1], (id, perm) => {
          console.log(
            `${cmd.sender.username} added '${perm}' to ${user.username}`);
          cmd.reply(`permission '${perm}' added to ${user.username}`)
        });
      }

      break;

    case 'forbid':

      if (/<@\d{17,18}>/g.test(args[1]) || /\d{17,18}/g.test(args[1])) {
        cmd.reply('check your arguments, i think you messed up a little.');
        break;
      }

      if (args.length === 2) {
        cmd.reply('i haven\'t received enough arguments. try again.');
        break;
      }

      if (cmd.users.list.length === 0) {
        cmd.reply('i don\'t see any users, did you incorrectly mention any?');
        break;
      }

      for (let user in cmd.users.list) {
        user = cmd.users.list[user];
        perms.delPerm(user.id, args[1], (id, perm) => {
          console.log(
            `${cmd.sender.username} removed '${perm}' from ${user.username}`
          );
          cmd.reply(`permission '${perm}' removed from ${user.username}`)
        });
      }
      break;

    case 'clone':
      if (args.length === 2) {
        cmd.reply('i haven\'t received enough arguments. try again.');
        break;
      }

      if (cmd.users.list.length === 0) {
        cmd.reply('i don\'t see any users, did you incorrectly mention any?');
        break;
      } else if (cmd.users.list.length === 1) {
        cmd.reply(
          'i can\'t clone the permissions if there\'s no other user.'
        );
        break;
      }

      for (let user in cmd.users.list) {
        user = cmd.users.list[user];
        if (user.id === cmd.users.list[0].id) {
          continue;
        }
        perms.copyPerms(cmd.users.list[0].id, user.id, (copy, paste) => {
          console.log(
            `${cmd.sender.username} copied ${cmd.users.list[0].username}'s permissions to ${user.username}`
          );
          cmd.reply(
            `permissions copied from ${cmd.users.list[0].username} to ${user.username}`
          );
        });
      }
      break;

    case 'purge':

      if (cmd.users.list.length === 0) {
        cmd.reply('i don\'t see any users, did you incorrectly mention any?');
        break;
      }

      for (let user in cmd.users.list) {
        user = cmd.users.list[user];
        perms.delAll(user.id, (id) => {
          console.log(
            `${cmd.sender.username} cleansed ${user.username}'s permissions'`
          );
          cmd.reply(`permissions cleansed from ${user.username}`)
        });
      }
      break;

    default:
      cmd.reply('wrong arguments, old boy.');
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
