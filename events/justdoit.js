'use strict';
const eventName = 'justdoit';

const listening = (client) => {
  client.on('message', (msg) => {
    if (msg.content.toLowerCase() === 'just' && msg.sender.id != client.user.id)
      msg.channel.sendMessage('DO IT');
  })
}

module.exports = {
  eventName,
  listening,
}
