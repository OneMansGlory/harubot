'use strict';
const fs = require('fs');
const path = require('path');

const config = require('./config_manager.js');

const perms_path = 'perms.json';
const file_path = path.join(__dirname, '..', perms_path);

let perms = null;

const blackout = (function() {
  let bool = false;
  return {
    get: function() {
      return bool;
    },
    toggle: function() {
      bool = !bool;
    }
  }
}());

function reload () {
  try {
    perms = fs.readFileSync(file_path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(file_path, '{}');
      console.log('Configuration file ' + perms_path + ' missing.');
      throw new Error('Configuration file reset.');
    }
  }
  return this;
}

function parse () {
  try {
    perms = JSON.parse(perms);
  } catch (err) {
    throw new Error('Invalid ' + perms_path + '. Did you mess up somewhere?');
  }
  return this;
}

function save () {
  fs.writeFile(file_path, JSON.stringify(perms, null, 2));
};

function hasPerms (id, perm) {
  let list = getPerms(id);
  if (list === undefined) return false;
  else {
    for (const i of list) {
      if (i === perm) return true;
    }
  }
  return false;
}

function getPerms (id) {
  return perms[id];
}

function addPerm (id, perm, callback) {
  if (typeof perms[id] === 'undefined') {
    let permsList = [perm];
    perms[id] = permsList;
  } else {
    perms[id].push(perm);
  }
  save();
  return callback(id, perm);
}

function delPerm (id, perm, callback) {
  if (typeof perms[id] === 'undefined') {
    return false;
  }
  if (perms[id].indexOf(perm) > -1) {
    perms[id].splice(perms[id].indexOf(perm), 1);
    return callback(id, perm);
  }
  save();
}

function copyPerms (copy, paste, callback) {
  if (typeof perms[copy] === 'undefined') {
    return false;
  }
  perms[paste] = perms[copy];
  save();
  return callback(copy, paste);
}

function delAll (id, callback) {
  if (perms[id] !== undefined)
    perms[id] = undefined;
  save();
  return callback(id);
}

function setVal (id, perm) {
  perms[id] = perm;
  save();
}

const cmds = (function() {
  return require('require-all')({
    dirname: path.join(__dirname, '../../commands'),
    filter: /(.+)\.js$/,
    recursive: false
  });
}());


function process (user, trigger) {
  for (let i in cmds) {
    if (!cmds[i].cmdName || trigger !== cmds[i].cmdName.toLowerCase()) continue;

    if (user === config.get('master') || !config.get('perms-enabled'))
      return cmds[i];

    if (blackout.get() === true || !hasPerms(user, trigger))
      return 'no perms';

    return cmds[i];
  }
  return false;
}

module.exports = {
  blackout, perms,
  reload, parse, save,
  hasPerms, getPerms, addPerm, delPerm, copyPerms, delAll, set: setVal,
  cmds, process,
}
