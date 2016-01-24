'use strict';
const tags = require('../commands/tag.js');

const eventName = "tag_listen";
const trigger = '>>';

const listening = function (client) {
  client.on('message', (msg) => {
    if (!msg.content.startsWith(trigger)) return;
    let trig = msg.content.substring(trigger.length);
    for (var tag in tags.tags) {
      if (trig === tag) msg.channel.sendMessage(tags.tags[tag]);
    }
  })
}

module.exports = {
  eventName,
  listening
}
