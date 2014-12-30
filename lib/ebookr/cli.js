/*
 * ebookr
 * http://github.com/ebookr/ebookr
 *
 * Copyright (c) 2014 Arne Hassel
 * Licensed under the MIT license.
 * https://github.com/ebookr/ebookr/blob/master/LICENSE
 */

'use strict';

// External libs.
var nopt = require('nopt');

// Default options.
var optlist = {
  metadata: {
    short: 'm',
    info: 'Pass value to metadata',
    type: Array
  },
  output: {
    short: 'o',
    info: 'Name of file to be outputted',
    type: String
  },
  verbose: {
    info: 'Outputs much more info when building',
    type: Boolean
  },
  version: {
    short: 'v',
    info: 'Print the ebookr version.',
    type: Boolean
  }
};

// Parse `optlist` into a form that nopt can handle.
var aliases = {};
var known = {};

Object.keys(optlist).forEach(function(key) {
  var short = optlist[key].short;
  if (short) {
    aliases[short] = '--' + key;
  }
  known[key] = optlist[key].type;
});

var parsed = nopt(known, aliases, process.argv, 2);
module.exports = parsed;
module.exports.files = parsed.argv.remain;