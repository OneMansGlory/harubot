'use strict';
const request = require('superagent');

const cmdName = 'anime';
const parameter = {
  'search': true
};
const description = 'searches for an anime title';

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined')
    return cmd.reply(
      `please run **${cmd.prefix}help ${cmdName}** to learn how to use the command properly.`
    );

  switch (cmd.parameter) {
    case 'search':
      if (cmd.args.length === 1) {
        return cmd.reply(
          `please enter a search term. e.g. ${cmd.prefix}${cmdName} search Nagi no Asukara`
        );
      }
      var query = cmd.args.slice(1);
      query = Array.prototype.join.call(query, '_');
      request
        .get(`http://hummingbird.me/api/v1/search/anime?query=${query}`)
        .end((err, res) => {
          var reply = [];
          if (err) {
            console.log(
              `${cmd.msg.sender.username} tried querying for an anime but met an error: ${err}`);
            cmd.reply(`**Error**: ${err}`);
            return;
          } else {
            if (typeof res.body[0] === 'undefined')
              return cmd.reply(
                'that show doesn\'t exist in Hummingbird\'s databases.'
              );
            var result = res.body[0];
            reply.push(`**Name**: ${result.title} (ID: ${result.id})`);

            if (!!result.alternate_title)
              reply.push(`*${result.alternate_title}*`);

            reply.push(`**Status**: *${result.status}*`);
            reply.push(
              `**Episode count**: ${result.episode_count}\n`
            );
            reply.push(`**Synopsis**: \n${result.synopsis}`);
            reply.push(`${result.cover_image}\n`);
            cmd.send(reply);
          }
        });
      break;
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
