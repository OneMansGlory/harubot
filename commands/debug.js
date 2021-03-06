'use strict';
const cmdName = 'debug';
const parameter = {
  'eval': true
}
const description = 'evaluating code. use at your own risk.';

function execute (cmd) {
  let args = cmd.args;
  if (typeof cmd.parameter === 'undefined') return cmd.code('\n');
  try {
    cmd.code(eval(args.join(' ')));
  } catch (err) {
    cmd.code(eval(err));
  }
}

module.exports = {
  cmdName,
  parameter,
  description,
  execute,
}
