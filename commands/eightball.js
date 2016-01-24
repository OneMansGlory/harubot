'use strict';
const cmdName = '8ball';
const description =
  'i\'ll reply any question with something between \'yes\' and \'no\'.';
const aliases = [
  'eightball'
]

let eightball = [
  'yep.',
  'why, certainly.',
  'my CPU gives the green light.',
  'naturally.',
  'that is without a doubt.',
  'obviously, what a question!',
  'as i see it, yes',
  'most likely',
  'don\'t try to count on it.',
  'i don\'t think so.',
  'in your dreams, mate',
  'very doubtful',
  'impossible',
  'it\'s pretty unlikely',
  'nah.',
  'both ways are possible',
  'yes, that is a no.',
  'you already know the answer, don\'t cha?',
  'don\'t ask me, i\'m just a bot.',
  'ask someone who cares',
  'Jesus, for He is always the answer',
  'i can eat alphabet soup and shit out a smarter question than that. next.'
];

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined')
    cmd.reply('that doesn\'t seem like a question to me...');
  else
    cmd.reply(
      eightball[Math.floor(Math.random() * eightball.length)]
    );
}

module.exports = {
  cmdName,
  description,
  aliases,
  execute,
}
