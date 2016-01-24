'use strict';
const request = require('superagent');

const cmdName = 'img';
const parameter = {
  'site': true
};
const description = 'to satiate your pervert desires';

function execute (cmd) {
  let args = cmd.args;
  let query = '';
  switch (cmd.parameter) {
    case 'yande.re':
    case 'yandere':
      query += `+${args.slice(1).join('+')}`;
      request
      .get(
        `https://yande.re/post/index.json?limit=1&page=1&tags=order:random${query}`
      )
      .end((err, res) => {
        if (err) return console.log(err);
        if (res.statusCode !== 200) {
          console.log(res.statusCode);
          return cmd.send(`Error: Status code **${res.statusCode}**`);
        }
        if (typeof res.body[0] !== 'undefined') {
          cmd.send(`**Score**: ${res.body[0].score}\n${res.body[0].file_url}`);
        } else {
          cmd.reply(`i didn\'t find any pictures with the tags "${args.slice(1).join(', ')}".`);
        }
      });
      break;
    case 'danbooru':
      query += `+${args.slice(1).join('+')}`;
      request
      .get(
        `http://danbooru.donmai.us/posts.json?limit=1&tags=order:random${query}`
      )
      .end((err, res) => {
        if (err) console.log(err);
        let r = res.body[0];
        if (typeof r === 'undefined') {
          return cmd.reply(`**error**: query "${args.slice(1).join(', ')}" returned no pictures.`);
        }
        if (typeof r.file_url !== 'undefined') {
          return cmd.send(`**Score**: ${res.body[0].score}\nhttp://danbooru.donmai.us${res.body[0].file_url}`);
        } else {
          return cmd.reply(`have you been searching with a restricted tag? "${args.slice(1).join(', ')}".`);
        }
      });
      break;
    case 'konachan':
      query += `+${args.slice(1).join('+')}`;
      request
      .get(
        `http://www.konachan.com/post.json?limit=1&page=1&tags=order:random${query}`
      )
      .end((err, res) => {
        if (err) return console.log(err);
        if (res.statusCode !== 200) {
          console.log(res.statusCode);
          return cmd.send(`Error: Status code **${res.statusCode}**`);
        }
        if (typeof res.body[0] !== 'undefined') {
          cmd.send(`**Score**: ${res.body[0].score}\n${res.body[0].file_url}`);
        } else {
          cmd.reply(`i didn\'t find any pictures with the tags "${args.slice(1).join(', ')}".`);
        }
      });
      break;
    default:
      if (!cmd.parameter)
        return cmd.reply(
          `i need to know where you want to search images from.\n` +
          `try doing **${cmd.prefix}${cmdName} <site> [tags]**`
        );
  }

}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
