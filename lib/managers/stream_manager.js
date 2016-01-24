'use strict';
const Discord = require('discord.js');
const request = require('superagent');

let queue = [];
let boundChannel = false;
let currentVideo = false;
let client = null;
let id = null;

function bind (options) {
  boundChannel = options.channel || boundChannel;
  id = options.id || id ;
  client = options.client || client;
}

function convert (millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function currVid() {
  return currentVideo;
}

function querySC (arr, callback) {
 let query = Array.prototype.join.call(arr, '_');
 request
 .get(`https://api.soundcloud.com/tracks/?client_id=${id}&q=${query}`)
 .end((err, res) => {
   if (!err && res.statusCode === 200) {
     if (typeof res.body[0] !== 'undefined') {
       return callback(err, res.body[0]);
     }
     return callback('no songs found');
   } else {
     console.log(`Error ${res.statusCode}`);
     return callback(err);
   }
 });
}

function tryToQueue (options) {
  let toQueue = {
    link: options.link,
    user: options.user,
    name: options.name,
    artist: options.artist,
    time: options.time,
    plays: options.plays,
  };

  if (typeof options.link === 'undefined')
    return;

  toQueue.prettyPrint = function () {
    let str = '';
    str += options.name ? `**${options.name}** ` : `**${options.link}** `;
    str += options.artist ? `by *${options.artist}* ` : '';
    str += options.time ? `[${convert(options.time)}] ` : '';
    str += options.plays ? `(${options.plays} plays) ` : '';
    str += options.user ? `- added by ${options.user}` : '';
    return str;
  }

  queue.push(toQueue);
  boundChannel.sendMessage(`Queued: ${toQueue.prettyPrint()}`);

  if (!currentVideo) nextInQueue();
  return toQueue;
}

function nextInQueue () {
  if (queue.length > 0) {
    var vid = queue.shift();
    play(vid);
  }
}

function destroy () {
  queue = [];
}

function stopped () {
  if (client.internal.voiceConnection)
    client.internal.voiceConnection.stopPlaying();
  currentVideo = false;
  client.setPlayingGame(null);
}

function play (vid) {
  if (client.internal.voiceConnection) {
    let connection = client.internal.voiceConnection;
    currentVideo = vid;

    connection.playFile(vid.link, {stereo: true}, (err, stream) => {
      if (err) {
        currentVideo = false;
        console.log(err);
        stopped();
        boundChannel.sendMessage(`Skipping **${vid.name}** due to an error!`);
        return;
      }
      currentVideo = vid;
      client.setPlayingGame(vid.name);
      boundChannel.sendMessage(`Now playing **${vid.name}** [${convert(vid.time)}]`);

      stream.on('error', (err) => {
        boundChannel.sendMessage(`There was an error during playback.\n\n**Error**: ${err}`);
      })

      stream.on('end', () => {
        nextInQueue();
        boundChannel.sendMessage(`Finished playing **${vid.name}** [${convert(vid.time)}]`);
      });
    });
  }
}

function list () {
  let list = '';
  if (currentVideo)
    list += `Currently playing: ${currentVideo.prettyPrint()}\n`;
  else {
    list += `The play queue is empty. How about adding some songs?\n`;
  }

  if (queue.length > 0) {
    list += '\nList of currently queued songs:\n';
    let limit = false;

    for (let i=0;i<queue.length;i++) {
      if (limit) return;
      let vid = `${i+1}. ${queue[i].prettyPrint()}\n`;
      if ((queue.length + queue[i].prettyPrint().length) > 1900) {
        list += `... and ${links.length - i} more`;
        limit = true;
      } else {
        list += vid;
      }
    }
  }
  return list;
}

function shuffle (array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

module.exports = {
  id, queue, boundChannel, currentVideo, client,
  bind, currVid, querySC, tryToQueue, nextInQueue, destroy, stopped, play, list,
};
