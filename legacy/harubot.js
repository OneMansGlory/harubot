'use strict';
const Discord = require("discord.js")
const bot = new Discord.Client()
const auth = require("./auth.json")

const fs = require('fs')
const byteFile = "./bytes.json"
const bytes = require(byteFile)

var trigger = ""
var version = "0.1.0"

/** Crystal ball answers **/
var yesorno = [
  "yep.",
  "why, certainly.",
  "my CPU gives the green light.",
  "naturally.",
  "that is without a doubt.",
  "obviously, what a question!",
  "as i see it, yes",
  "most likely",
  "if you say so?",
  "don't try to count on it.",
  "i don't think so.",
  "in your dreams, mate",
  "very doubtful",
  "impossible",
  "it's pretty unlikely",
  "nah.",
  "both ways are possible",
  "try flipping a coin",
  "you already know the answer, don't cha?"
];

var sarcasm = [
  "well done.",
  "good one.",
  "that's great.",
  "that's *awesome*.",
  "congratulations.",
  "nice going there",
  "nice."
];

/** General Functions **/
function writeConf(file, fileName) { //writes to config file
  fs.writeFile(fileName, JSON.stringify(file, null, 2), err => {
    if (err) return console.log(err);
  });
}

function arrayCharCount(array) { //hacky way to get the character count of an array
  return JSON.stringify(array).length - array.length * 3 - 1;
}

function randomAns(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function isDigit(foo) {
  return /^\d+$/.test(foo);
}

/** List of commands **/
const commands = {
  "ping": {
    description: "i reply with 'pong!'. my dimwit creators made it to check if i'm online.",
    execute: function(bot, msg) {
      bot.reply(msg, "**pong!**");
    }
  },
  "source": {
    usage: "[@user]",
    description: "i reply with the URL for the specified user's avatar.",
    execute: function(bot, msg, arg) {
      if (msg.mentions.length == 0) bot.reply(msg,
        "that isn't a user. what are you really trying to search for?");
      else
        for (var user of msg.mentions)
          if (user != null) bot.reply(msg, user.username + "'s avatar is: " +
            user.avatarURL);
    }
  },
  "lmgtfy": {
    usage: "[phrase]",
    description: "/)_-) let me google that phrase for you.",
    execute: function(bot, msg) {
      var lmgtfy = "http://lmgtfy.com/?q=";
      var input = msg.content.split(" ").join("+");
      lmgtfy += input.substring(msg.content.split(" ")[0].substring(1).length +
        2);
      bot.sendMessage(msg.channel, lmgtfy);
    }
  },
  "setgame": {
    usage: "[game name]",
    description: "i play the game you request, at your command.",
    execute: function(bot, msg, arg) {
      bot.setPlayingGame(arg);
      bot.reply(msg, "i'm now playing " + arg.toLowerCase());
    }
  },
  "typing": {
    description: "this compels to start typing in a channel indefinitely. thanks a lot.",
    execute: function(bot, msg) {
      bot.startTyping(msg.channel);
    }
  },
  "stoptyping": {
    description: "this compels me to stop typing. why did you make me type in the first place?",
    execute: function(bot, msg) {
      bot.stopTyping(msg.channel);
    }
  },
  "serverinfo": {
    description: "i fetch a sitrep of the channel's server, at your command.",
    execute: function(bot, msg) {
      let server = msg.channel.server;
      if (!server instanceof Discord.PMChannel) {
        let online = 0;
        let topic = " - ";
        let infoList = [];
        if (msg.channel.topic) topic += msg.channel.topic + "";
        else topic = "\n";
        for (var member of msg.channel.server.members)
          if (member.status == "online") online++;
        infoList.push("**" + server.name + "**");
        infoList.push(msg.channel + topic);
        infoList.push("**Owner**: " + msg.channel.server.owner.username);
        infoList.push("**Region**: " + msg.channel.server.region);
        infoList.push("**Server ID**: " + server.id);
        infoList.push("**Total members**: " + msg.channel.server.members.length +
          " (" + online + " online)");
        bot.sendMessage(msg.channel, infoList);
      } else bot.reply(msg,
        "please execute the command in a damn text channel and not via DM."
      );
    }
  },
  "servers": {
    description: "i create a sitrep of all the servers i'm connected to.",
    execute: function(bot, msg) {
      var serversList = "";
      for (var server of bot.servers) {
        let online = 0;
        let member = "";
        serversList += "**" + server + "** has " + server.members.length +
          " members (";
        online = server.members.reduce((count, member) => count + (member.status ===
          'online' ? 1 : 0), 0);
        serversList += online + " online)\n";
      }
      bot.sendMessage(msg.channel,
        "**Server List**\
            \nConnected to " + bot.servers.length +
        " servers, " + bot.channels.length + " channels and " + bot.users
        .length + " users.\
            \n\n" + serversList);
    }
  },
  "nick": {
    usage: "<nickname>",
    description: "you may have the pleasure of deciding on my username, to my chagrin.",
    execute: function(bot, msg, arg) {
      console.log(bot.user.username + " has been renamed to " + arg);
      bot.setUsername(arg);
    }
  },
  "utc": {
    description: "why do you need UTC time?",
    execute: function(bot, msg) {
      var now = new Date();
      var date = [now.getUTCDate(), now.getUTCMonth() + 1, now.getUTCFullYear()];
      var time = [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()];
      var suffix = (time[0] < 12) ? "AM" : "PM";
      time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
      time[0] = time[0] || 12;
      for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
          time[i] = "0" + time[i];
        }
      }
      bot.reply(msg, "GMT time is **" + date.join("~") + " " + time.join(
        ":") + " " + suffix + "**");
    }
  },
  "time": {
    description: "i reply with local time. depends on where i'm hosted in.",
    execute: function(bot, msg) {
      var now = new Date();
      var date = [now.getDate(), now.getMonth() + 1, now.getFullYear()];
      var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
      var suffix = (time[0] < 12) ? "AM" : "PM";
      time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
      time[0] = time[0] || 12;
      for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
          time[i] = "0" + time[i];
        }
      }
      bot.reply(msg, "Local time is **" + date.join("~") + " " + time.join(
        ":") + " " + suffix + "**");
    }
  },
  "status": {
    description: "this is a sitrep of my status. nothing is to be gained from this knowledge.",
    execute: function(bot, msg) {
      let msgArray = [];
      msgArray.push("**Bot Status** - " + bot.user + " **v" + version +
        "**");
      msgArray.push("Created by **Pyraxo** - follow @Pyraxo on Twitter\n");
      msgArray.push("Current uptime: " + (Math.round(bot.uptime / (1000 *
          60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) %
          60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) +
        " seconds");
      msgArray.push("I am in **" + bot.servers.length +
        "** servers, and in **" + bot.channels.length + "** channels.");
      msgArray.push("Currently, I'm connected to **" + bot.users.length +
        "** different people");
      console.log(msg.author.username + " requested the bot's status");
      bot.sendMessage(msg, msgArray);
    }
  },
  "uptime": {
    description: "i reply with my current uptime.",
    execute: function(bot, msg) {
      bot.reply(msg, "Current uptime: " + (Math.round(bot.uptime / (1000 *
          60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) %
          60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) +
        " seconds");
    }
  },
  "byte": {
    usage: "*-create* [keyword] [content] | *-edit* [keyword] [content] | *-delete* [keyword] | *-list*",
    description: "assigns a phrase to a keyword for easy retrieval, because apparently some people can't be bothered to type it out in full.",
    execute: function(bot, msg, arg) {
      if (!arg) bot.reply(msg,
        "you're not using the command properly. do '~help byte'");
      else {
        arg = arg.split(" ");
        if (arg[0][0] == "-") {
          let command = arg[0].substring(1);
          let keyword = arg[1];
          let content = "";
          for (var i = 2; i < arg.length; i++) content += arg[i] + " ";
          content = content.substring(0, content.length - 1);
          switch (command) {
            case 'create':
              if (bytes[keyword]) {
                bot.reply(msg, "**^" + keyword +
                  "** already exists. are you planning to rewrite? if so, use *-edit*"
                );
                break;
              } else {
                bytes[keyword] = content;
                writeConf(bytes, byteFile);
                console.log(msg.author.username +
                  " has create a new byte: " + keyword);
                bot.reply(msg, "byte " + keyword + " created. type **^" +
                  keyword + "** to fetch your byte.")
              }
              break;
            case 'edit':
              if (!bytes[keyword]) {
                bot.reply(msg, "**^" + keyword +
                  "** doesn't exist. are you planning to create one? if so, use *-create*"
                );
                break;
              } else {
                if (arg[2]) {
                  bytes[keyword] = content;
                  writeConf(bytes, byteFile);
                  console.log(msg.author.username + " has updated byte: " +
                    keyword);
                  bot.reply(msg, "byte " + keyword + " edited. type **^" +
                    keyword + "** to fetch your byte.");
                } else bot.reply(msg,
                  "if you want to make a blank byte, might as well add *-delete*"
                )
              }
              break;
            case 'delete':
              if (!bytes[keyword]) {
                bot.reply(msg, "**^" + keyword +
                  "** doesn't exist. you can't delete what's not there.");
                break;
              } else {
                delete bytes[keyword];
                writeConf(bytes, byteFile);
                console.log(msg.author.username + " has deleted byte: " +
                  keyword);
                bot.reply(msg, "byte " + keyword + " deleted.");
              }
              break;
            case 'list':
              let byteList = "";
              bot.reply(msg, "here's the list of bytes. \`\`\`\n " + Object
                .keys(bytes) + "\n\`\`\`");
          }
        }
      }
    }
  },
  "join": {
    usage: "<invite link>",
    description: "compels me to join a server through an invitation link, sending me off into the void of unknown servers.",
    execute: function(bot, msg, arg) {
      if (arg) {
        bot.joinServer(arg, (err, server) => {
          if (err) {
            console.log(err);
          } else console.log(bot.user.username + " has joined '" +
            server.name + "'");
          bot.reply(msg, "i have joined " + server.name +
            " and am ready to wreck havoc.");
        });
      } else {
        bot.reply(msg, "please specify an invite link..?")
      }
    }
  },
  "leave": {
    usage: "[server name]",
    description: "compels me to quit a specified server and dragging me back from the void.",
    execute: function(bot, msg, arg) {
      for (var server of bot.servers) {
        if (server.name == arg) {
          bot.leaveServer(server);
          console.log(bot.user.username + " has left server " + server.name);
        }
      }
    }
  },
  "8ball": {
    description: "i'll give you an answer to a question, between the lines of 'yes' and 'no'. this will be fun!",
    execute: function(bot, msg, arg) {
      if (arg.length === 0) {
        bot.reply(msg, "that doesn't seem like a question to me, *sir*.");
      } else {
        bot.reply(msg, randomAns(yesorno));
      }
    }
  },
  "rolldice": {
    usage: "<number of dice>X<number of sides>",
    description: "i get to roll some imaginary dice of imaginary sides, solely for your benefit. how important a task.",
    execute: function(bot, msg, arg) {
      if (arg) {
        arg = arg.split("X");
        if (/^\d+$/.test(arg[0]) && /^\d+$/.test(arg[1])) {
          var num = arg[0];
          var range = arg[1];
          var output = "you rolled a total of " + num +
            " dice which gave the following results: \n\`\`\`\n";
          while (num != 0) {
            output += Math.floor(Math.random() * range + 1) + ", ";
            num--;
          }
          output = output.substring(0, output.length - 2);
          output += "\`\`\`";
          bot.reply(msg, output);
        } else bot.reply(msg, "digits only, please.")
      } else bot.reply(msg, "you rolled a " + Math.floor(Math.random() * 7) +
        "." + randomAns(sarcasm));
    }
  },
  "whois": {
    usage: "[@username]",
    description: "for all the nosy people who wants a sitrep of other users, this is the command for you",
    execute: function(bot, msg, arg) {
      if (msg.mentions.length == 0) bot.reply(msg,
        "who? how can i 'whois' if you don't even tell me who you're whois-ing at?"
      );
      else {
        for (var user of msg.mentions)
          if (user != null) {
            let info = [];
            info.push("**User info**: " + user.username);
            info.push("\`\`\`");
            info.push("ID: " + user.id);
            info.push("Discriminator: " + user.discriminator);
            info.push("Avatar URL: <" + user.avatarURL + ">");
            info.push("\`\`\`");
            bot.sendMessage(msg, info);
          }
      }
    }
  },
  "coinflip": {
    usage: "<number of coins>",
    description: "if you really need a description, it's literally flipping some coins. what did you expect?",
    execute: function(bot, msg, arg) {
      let result = ["heads", "tails"];
      let output = "";
      if (/^\d+$/.test(arg)) {
        let coins = arg;
        while (coins != 0) {
          output += result[Math.floor(Math.random() * 2)] + ", ";
          coins--;
        }
        output = output.substring(0, output.length - 2);
        output += "\`\`\`";
        bot.reply(msg, "you flipped " + arg +
          " coins. you got the following results:\n\`\`\`\n" + output);
      } else {
        bot.reply(msg, "you flipped a coin. you got *" + result[Math.floor(
          Math.random() * 2)] + "*. " + randomAns(sarcasm))
      }
    }
  },
  "echo": {
    usage: "[phrase]",
    description: "you say something and i'll echo it for the heck of it",
    execute: function(bot, msg, arg) {
      bot.sendMessage(msg.channel, arg);
    }
  }
}

/** Other events **/
bot.on('warn', (msg, arg) => console.log('[warn]', msg));
bot.on("ready", () => console.log(bot.user.username + " is initialised in " +
  bot.servers.length + " servers."));

/** onMessage event **/
bot.on("message", msg => {
  if (msg.author.id != bot.user.id && (msg.content[0] == "~" || msg.content
      .indexOf(bot.user.mention()) == 0)) { //check if command is not by bot and bot is mentioned or command issued
    trigger = msg.content.split(" ")[0].substring(1); // command trigger (after '/')
    var arg = msg.content.substring(trigger.length + 2); // various arguments after command
    if (msg.content.indexOf(bot.user.mention()) == 0) { // if bot is mentioned, change trigger and arguments
      trigger = msg.content.split(" ")[1];
      arg = msg.content.substring(bot.user.mention().length + trigger.length +
        2);
    }
    var cmd = commands[trigger];
    if (trigger == "help") { // check if command is a /help
      if (!arg) {
        let cmdList = [];
        let cmdList2 = [];
        let miscList = [];
        for (var cmd in commands) {
          var info = "**~" + cmd + "**";
          var usage = commands[cmd].usage;
          if (usage) info += " " + usage;
          var description = commands[cmd].description;
          if (description) info += "\n\t- " + description + "\n";
          if (arrayCharCount(cmdList) < 1800) cmdList.push(info); // so char count of array won't be >2000
          else if (arrayCharCount(cmdList2) < 1800) cmdList2.push(info);
        }
        miscList.push(msg.author +
          ", you may control me with the following commands:");
        miscList.push(
          "when issuing commands, the parameters in the brackets **[]** and **<>** are arguments."
        );
        miscList.push(
          "[] is a required argument, and <> is optional. do i have to explain any further?\n\n"
        );
        bot.sendMessage(msg.author, miscList).then(() => {
          bot.sendMessage(msg.author, cmdList).then(() => { // callbacks to ensure it's in order
            bot.sendMessage(msg.author, cmdList2);
          });
        });
      } else {
        if (commands[arg] != null) {
          var info = "**~" + arg + "**";
          var usage = commands[arg].usage;
          if (usage) info += " " + usage;
          var description = commands[arg].description;
          if (description) info += "\n\t- " + description + "\n";
          bot.sendMessage(msg.author, info);
        } else if (!commands[arg]) bot.reply(msg,
          "that command doesn't exist, m8.");
      }
    } else if (cmd) {
      cmd.execute(bot, msg, arg); // executes shit
    }
  } else if (msg.content[0] == "^") { // for byte commands
    trigger = msg.content.substring(1);
    var cmd = bytes[trigger];
    if (cmd) bot.sendMessage(msg.channel, bytes[trigger]);
  }
});

bot.login(auth.email, auth.password);
