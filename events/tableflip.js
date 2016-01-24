'use strict';
const eventName = "tableflip";

function listening (client) {
  client.on('message', (msg) => {
    if (msg.content.startsWith("(╯°□°）╯︵ ┻━┻") && msg.sender.id != client.user.id)
      msg.channel.sendMessage("┬─┬﻿ ノ( ゜-゜ノ)");
    if (msg.content.startsWith("┬─┬﻿ ノ( ゜-゜ノ)") && msg.sender.id != client.user.id)
      msg.channel.sendMessage("（╯°□°）╯︵(\\ .o.)\\");
  })
}

module.exports = {
  eventName,
  listening,
}
