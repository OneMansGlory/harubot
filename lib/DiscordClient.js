'use strict';
const path = require('path');
const Discord = require('discord.js');

const config = require('./managers/config_manager.js');
const perms = require('./managers/perms_manager.js');
const Commander = require('./Commander.js');

class DiscordClient {
  constructor (email, pass) {
    this.email = email;
    this.pass = pass;
  }

  init () {
    const client = new Discord.Client();
    client.on('warn', (msg, arg) => console.log(`[warn] ${msg}`));
    client.on('disconnected', () => {
      console.log(`Disconnected.`);
      process.exit(1);
    });

    client.on('ready', () => {
      console.log(
        `Connecting as ${client.user.username}. [${client.user.id}]`
      );

      console.log(
        `Initialised in ${client.servers.length} servers and ${client.channels.length} channels.`
      );

      console.log(`The bot's current prefix is ${config.get('prefix')}`);
      if (process.send) process.send('online');
    });

    client.on('message', msg => {
      let command;
      let notBot = msg.sender.id !== client.user.id;
      if (notBot && msg.content.startsWith(config.get('prefix')))
        command = perms.process(
          msg.sender.id,
          msg.content.substring(config.get('prefix').length).split(' ')[0].toLowerCase()
        );

      if (command === 'no perms') {
        client.reply(msg, 'you don\'t have the permissions to do that!');
      } else if (command) {
        let commander = new Commander(client, msg);
        command.execute(commander.process());
      }
    });

    let events = (function() {
      return require("require-all")({
        dirname: path.join(__dirname, '..', "events"),
        filter: /(.+)\.js$/,
        recursive: false
      });
    }());

    for (let i in events) {
      if (!events[i].eventName) continue;
      events[i].listening(client);
    }

    client.login(this.email, this.pass);
    function err (err) {
      console.log(err);
    }
    return client;
  }
}

module.exports = DiscordClient;
