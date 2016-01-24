'use strict';
const Discord = require('discord.js');
const stream_manager = require('../lib/managers/stream_manager.js');
const config = require('../lib/managers/config_manager.js');

const cmdName = 'stream';
const parameter = {
  'join': false,
  'sc': false,
  'leave': false,
  'play': false,
  'list': false
};
const description = 'i stream music from soundcloud (and audio streams)';

function fetchChannelByName (msg, name) {
  for (let channel of msg.channel.server.channels) {
    if (channel instanceof Discord.VoiceChannel &&
      channel.name === name) {
      return channel;
    }
  }
  return null;
}

function formatTime (seconds) {
  return `${
    Math.round((seconds - Math.ceil(seconds % 60)) / 60)
  }:${
    String('00' + Math.ceil(seconds % 60)).slice(-2)
  }`;
};

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined') {
    cmd.reply(
      `i need more arguments. try doing ${cmd.prefix}help`
    );
    return;
  }
  let args = cmd.args;

  if (stream_manager.boundChannel && cmd.msg.channel.id !== stream_manager.boundChannel.id) return;

  switch (cmd.parameter) {
    case 'join':
      if (typeof args[1] === 'undefined') {
        cmd.reply(
          'please specify a channel for me to join.'
        );
        break;
      }

      let channel = fetchChannelByName(cmd.msg, cmd.args.slice(1).join(' '));
      if (channel === null) {
        cmd.reply(
          'i don\'t know any voice channel in this server by that name'
        );
        break;
      }

      stream_manager.bind({
        channel: cmd.msg.channel,
        id: config.get('soundcloud-ID'),
        client: cmd.bot
      });

      cmd.bot.joinVoiceChannel(channel, (err, conn) => {
        if (err) {
          console.log(err);
          cmd.reply(
            'i can\'t join the specified channel due to an error.'
          )
          return;
        } else {
          stream_manager.destroy();
          stream_manager.stopped();
          cmd.send(
            `Connected to voice channel '**${
              conn.voiceChannel.name
            }**' and bound to channel <#${
              cmd.msg.channel.id
            }>`
          );
        }
      });
      break;

    case 'leave':
      if (cmd.bot.voiceConnection === null) {
        cmd.reply(
          'i\'m not in any voice channels, so i can\'t leave any.'
        );
        break;
      }

      stream_manager.bind({channel:false});

      cmd.bot.leaveVoiceChannel((err) => {
        if (err) console.log(err);
        else {
          stream_manager.destroy();
          stream_manager.stopped();
          cmd.send(
            `Disconnected from '**${cmd.bot.voiceConnection.voiceChannel}**'`
          );
        }
      });
      break;

    case 'sc':
      if (typeof args[1] === 'undefined') {
        cmd.reply(
          'please specify a phrase so i can search soundcloud'
        );
        break;
      }

      if (!cmd.bot.voiceConnection) {
        cmd.reply('i\'m not in any voice channels yet.');
        break;
      }

      args = args.slice(1);

      stream_manager.querySC(
        args,
        (err, res) => {
          if (err) {
            return cmd.reply(`that query returned an error: **${err}**`);
          }
          let url = `https://api.soundcloud.com/tracks/${res.id}/stream?client_id=${config.get('soundcloud-ID')}`;

          stream_manager.tryToQueue({
            link:url,
            user:`<@${cmd.sender.id}>`,
            name:res.title,
            artist:res.user.username,
            time:res.duration,
            plays:res.playback_count
          });
        }
      );
      break;

    case 'play':
      if (typeof args[1] === 'undefined') {
        cmd.reply('i need a link to a sound file!');
        break;
      }

      if (!cmd.bot.voiceConnection) {
        cmd.reply('i\'m not in any voice channels yet.');
        break;
      }
      let link = args.slice(1).join(' ');
      stream_manager.tryToQueue(
        `<@${cmd.sender.id}>`, link, link);
      break;

    case 'list':
      cmd.reply(stream_manager.list());
      break;

    case 'time':
      let videoTime = stream_manager.currentVideo.time;
      if (typeof videoTime === 'undefined') {
        cmd.reply(
          'i don\'t know the length of the stream, sorry.'
        );
        break;
      }
      let time = cmd.bot.voiceConnection.streamTime / 1000;
      videoTime = videoTime / 1000;
      cmd.send(
        `${formatTime(time)} / ${formatTime(videoTime)} (${((time * 100) / videoTime).toFixed(2)} %)`
      );
      break;

    case 'next':
      if (cmd.bot.voiceConnection === null) {
        cmd.reply(
          'i\'m not in any voice channels, so i can\'t play anything.'
        );
        break;
      }
      if (stream_manager.currVid()) stream_manager.stopped();
      else cmd.reply('there\'s no song playing.');
      break;

    case 'shuffle':
      let queue = stream_manager.queue;
      if (queue.length < 2) {
        cmd.reply(
          'we don\'t have enough songs in the queue.'
        );
        return;
      } else {
        stream_manager.shuffle(queue);
        cmd.send('Songs in the queue have been shuffled.');
      }
      break;
    case 'yq':

  }
  return;
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
