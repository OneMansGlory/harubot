'use strict';
const cmdName = 'setgame';
const parameter = {
  'name/id': true
};
const description = 'you request a game and i play it for your sake.';

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined') {
    cmd.bot.setPlayingGame(null);
    return;
  }
  let game = cmd.args.join(' ');
  cmd.bot.setPlayingGame(game);
  console.log(`${cmd.sender.username} set the bot's game to ${game}`);
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
