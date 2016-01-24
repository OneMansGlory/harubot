'use strict';
const config = require('./managers/config_manager.js');

class Commander {
  constructor(client, message) {
    this.client = client;
    this.message = message;
  }

  process () {
    const args = this.message.content.split(' ');
    const trigger = args[0].substring(config.get('prefix').length);

    let cmd = {
      bot: this.client,
      trigger: trigger,
      prefix: config.get('prefix'),
      msg: this.message,
      sender: this.message.sender,
      users: (function(client) {
        let list = args.join(' ').replace(/<@/g, '').replace(/>/g, '').split(' ');
        let userList = [];
        list.forEach((elem, idx) => {
          if (/\d{17,18}/.test(elem)) {
            userList.push(client.users.get('id', list[idx]));
          }
        })
        return {
          list: userList,
          isUser: function(str) {
            return /<@\d{17,18}>/g.test(str) || /\d{17,18}/g.test(str)
          }
        }
      }(this.client)),
      send: function (message, cb) {
        cmd.msg.channel.sendMessage(message);
        return cb;
      },
      reply: function (message, cb) {
        if (cmd.msg.channel instanceof require('discord.js').PMChannel) {
          cmd.msg.channel.sendMessage(message);
        } else {
          cmd.msg.reply(message);
        }
        return cb;
      },
      pm: function (message, cb) {
        cmd.bot.sendMessage(cmd.msg.sender, message);
        return cb;
      },
      code: function codeBlock(message, cb) {
        cmd.msg.channel.sendMessage(`\`\`\`${message}\`\`\``);
        return cb;
      },
      parameter: (function (args) {
        return args[1] ? args[1].toLowerCase() : undefined;
      })(args),
      args: (function (msg, args) {
        return msg[1] ? msg.split(' ').slice(1) : args;
      })(this.message.content, args),
    };

    return cmd;
  }
}

module.exports = Commander;
