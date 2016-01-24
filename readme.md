## harubot
[![Version](https://img.shields.io/badge/Version-1.1.3-green.svg?style=flat-square)](https://github.com/Pyraxo/harubot/releases)
[![Twitter](https://img.shields.io/twitter/follow/Pyraxo.svg?style=social)](http://twitter.com/pyraxo)
###### A Discord.js music streaming and command chat bot
***
### Installation
```
git clone https://github.com/Pyraxo/harubot harubot
cd harubot
npm install
node harubot.js
```

Run the bot **at least once** to generate all configuration files (`perms.json` and `config.json`)

Edit the configuration file `config.json` that gets generated, changing the values in the quotes:
  - `email` : Enter your bot's email address here
  - `password` : Likewise, enter your bot's password here
  - `prefix` : Choose whatever prefix you want, the bot will only listen to messages starting with this prefix.
  - `name` : The default name of your bot.
  - `master` : Enter your user ID here. Whoever's ID you write in will be able to issue commands regardless of perms.
  - `soundcloud-ID` : Input your client ID (you can get one [here](http://soundcloud.com/you/apps/)) to allow the bot to use Soundcloud streaming.

### Usage
Run a command by sending a message to the channel the bot is in with the prefix you chose in the configuration. e.g:
```
$help
$anime search [query]
$stream join [channel name]
```

***
### Creating commands
You can add new commands by making new .js files and saving them into the `/commands` directory.

Your command file should look similar to this:
```js
'use strict';
const cmdName = 'test';
const parameter = {
  'parameter' : true
};
const description = 'test test!';

function execute (cmd) {
  cmd.reply('testing!');
}

module.exports = {
  cmdName,
  parameter,
  description,
}
```
  - `cmdName` : This is how the command is going to be detected. e.g. `$help`, 'help' is the `cmdName`. **Required.**
  - `description` : A general description for your command. Needed for the help command. *Optional*.
  - `parameter` : First argument. e.g. `$test [parameter]`. Set `true` if it's required, and `false` if it's optional. Used for help command. *Optional*.
  - `execute` : Code to be executed once the command is called. **Required.**

`execute (cmd)` executes code after the command name with trigger `cmdName` is issued.

`cmd` is an object containing:
  - `bot` : The client
  - `prefix` : The command prefix
  - `trigger` : The command, or the 'trigger'
  - `msg` : The message object (use `msg.content` to get the message content)
  - `sender` : The message sender
  - `send(msg)` : A function that will send a message to the channel where the command is executed
  - `reply(msg)` : A function similar to `send` that replies to the user who sent the command
  - `pm(msg)` : PMs the user instead
  - `code(msg)` : Sends the message in a code block
  - `parameter` : The argument immediately following the command. e.g. `$nick harubot`, `harubot` is `cmd.parameter`
  - `args` : An array of arguments succeeding the command

***
### Creating events
You can create new commands by creating new .js files and saving them into the /events directory.

Your events file should resemble this:
```js
'use strict';
const eventName = 'message_listener';

function listening (client) {
  client.on('message'), (msg) => {
    if (msg.content.startsWith('AND HIS NAME IS')) {
      msg.channel.sendMessage('JOHN CENA'); //bad meme
    }
  });
}

module.exports = {
  eventName,
  listening,
}
```

Your file requires the following:
  - `eventName` : A random name for the event file so the bot will know to register the event
  - `listening` : Must accept a `client` parameter so you can initialise the events

***
### Dependencies
* [discord.js](https://github.com/hydrabolt/discord.js)
* [require-all](https://www.npmjs.com/package/require-all) to require the command files
* [node-base64-image](http://riyadhalnur.github.io/node-base64-image/) for the `mimic` command
