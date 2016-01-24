'use strict';
const fs = require('fs');
const path = require('path');

const TAGS = 'tags.json';
const FILE_PATH = path.join(__dirname, '..', TAGS);

const cmdName = 'tag';
const parameter = {
  'create': false,
  'edit'  : true,
  'delete': false
}
const description = 'saves bytes of information to be retrieved later. use ">>[tagname]".'

let tags = null;

try {
  tags = fs.readFileSync(FILE_PATH);
} catch (err) {
  if (err.code === 'ENOENT') {
    fs.writeFileSync(FILE_PATH, '{}');
    console.log('Database file ' + TAGS + ' missing.');
    throw new Error('Database file reset.');
  }
}

try {
  tags = JSON.parse(tags);
} catch (err) {
  throw new Error('Invalid ' + TAGS + '. Did you mess up somewhere?');
}

function save() {
  fs.writeFile(FILE_PATH, JSON.stringify(tags, null, 2));
};

function execute (cmd) {
  if (typeof cmd.parameter === 'undefined') {
    cmd.reply(
      `you're not using the command properly. do '${cmd.prefix}help tag'`);
    return;
  }
  const args = cmd.args;
  const keyword = args[1];
  switch (cmd.parameter) {
    case 'create':
      if (args.length == 1) {
        cmd.reply(
          `you're not using the command properly. do '${cmd.prefix}help tag'`
        );
        return;
      }
      if (tags[keyword]) {
        cmd.reply(
          `**^${keyword}** already exists. are you planning to rewrite?`
        );
        break;
      } else {
        tags[keyword] = args.slice(2).join(' ');
        save();
        console.log(
          `${cmd.sender.username} has created a new tag: ${keyword}`);
        cmd.reply(
          `byte **${keyword}** created. type **${trigger}${keyword}** to fetch it.`);
      }
      break;
    case 'edit':
      if (args.length == 1) {
        cmd.reply(
          `you're not using the command properly. do '${cmd.prefix}help tag'`
        );
        return;
      }
      if (typeof tags[keyword] === 'undefined') {
        cmd.reply(
          `**^${keyword}** doesn't exist. are you planning to create one?`
        );
        break;
      } else {
        tags[keyword] = args.slice(2).join(' ');
        save();
        console.log(`${cmd.sender.username} has edited the tag: ${keyword}`);
        cmd.reply(
          `byte **${keyword}** edited. type **${trigger}${keyword}** to fetch it.`);
      }
      break;
    case 'delete':
      if (args.length == 1) {
        cmd.reply(
          `you're not using the command properly. do '${cmd.prefix}help tag'`
        );
        return;
      }
      if (typeof tags[keyword] === 'undefined') {
        cmd.reply(
          `**^${keyword}** doesn't exist. you can't delete what doesn't exist.`
        );
        break;
      } else {
        delete tags[keyword];
        save();
        console.log(`${cmd.sender.username} has deleted the tag: ${keyword}`);
        cmd.reply(`byte **${keyword}** deleted.`);
      }
      break;
    case 'list':
      let str = '';
      let keys = Object.keys(tags);
      if (keys.length == 0) {
        cmd.reply('i don\'t have any tags saved!');
        break;
      }
      for (let tag in tags) {
        str += `${tag}, `;
      }
      str = str.substring(0, str.length - 2);
      cmd.code(str);
      break;
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute
}
