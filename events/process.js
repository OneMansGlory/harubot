'use strict';
const eventName = 'process';

function listening (client) {
  client.on('message', (msg) => {
    if (msg.sender.id === client.user.id) return;
    switch (msg.content.toLowerCase()) {
      case 'die, haru':
        //client.reply(msg, '*et tu, brute?*');
        setTimeout(() => process.exit(0), 3000);
        break;
      case 'restart, haru':
        client.reply(msg, 'time for a reconfiguration.');
        require('../harubot.js').restart();
        break;
      case 'blackout, haru':
        const blackout = require('../lib/managers/perms_manager').blackout;
        blackout.toggle();
        let bl = blackout.get();
        client.reply(
          msg, bl ? '**the blackout is here!!**' : 'the blackout has subsided...'
        );
        console.log(`${msg.sender.username} ${
          bl ? 'issued a blackout.' : 'stopped the blackout.'
        }`);
    }
  });
}

module.exports = {
  eventName,
  listening,
}
