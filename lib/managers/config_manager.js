'use strict';
const fs = require('fs');
const path = require('path');

const config = 'config.json';
const default_config = 'config.example.json';
const file_path = path.join(__dirname, '../..', config);
const default_path = path.join(__dirname, '../..', default_config);

let data = null;

function reload () {
  try {
    data = fs.readFileSync(file_path);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(file_path, fs.readFileSync(default_path, 'utf8'));
      console.log(`Configuration file ${config} missing.`);
      throw new Error('Default configuration file loaded. Please edit it.');
    }
  }
  return this;
}

function parse () {
  try {
    data = JSON.parse(data);
  } catch (err) {
    console.log(err.stack);
    throw new Error(`Invalid ${config}: Did you mess up somewhere?`);
  }
  return this;
}

function save () {
  fs.writeFile(file_path, JSON.stringify(data, null, 2));
}

function getVal (key) {
  return data[key];
}

function setVal (key, value) {
  data[key] = value;
  save();
}

module.exports = {
  data, get: getVal, set: setVal,
  reload, parse, save
}
