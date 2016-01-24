'use strict';
const eventName = 'nevergonna';

const array = [
  'GIVE YOU UP',
  'LET YOU DOWN',
  'RUN AROUND AND DESERT YOU',
  'MAKE YOU CRY',
  'SAY GOODBYE',
  'TELL A LIE AND HURT YOU',
]

let index = 0;

function listening (client) {
  client.on('message', (msg) => {
    if (msg.sender.id === client.user.id) return;
    switch (msg.content.toLowerCase()) {
      case 'never gonna':
        msg.channel.sendMessage(array[index]);
        (index === 6) ? index = 0 : index++;
        break;
      case 'reset the rick roll!':
        index = 0;
        break;
    }
  });
}

module.exports = {
  eventName,
  listening,
}
