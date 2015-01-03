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
var nopt = require('nopt'),
    process = require('process');

var console = require('../util/console'),
    metadata = require('./metadata');

// Default options.
var optlist = {
  extensions: {
    short: 'e',
    info: 'Add ebookr-extension',
    type: Array
  },
  metadata: {
    short: 'M',
    info: 'Pass value to metadata',
    type: Array
  },
  metadataFile: {
    short: 'm',
    info: 'Metadata-file',
    type: String
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

module.exports.execute = function () {
  var options = nopt(known, aliases, process.argv, 2);
  var files = options.argv.remain;

  if (options.version) {
    console.log('ebookr v' + this.version());
    return;
  }
  if (options.metadata) {
    var metadata = {};
    options.metadata.forEach(function (m) {
      var keyAndValue = m.split('=');
      metadata[keyAndValue[0]] = keyAndValue[1] || true;
    });
    options.metadata = metadata;
  }
  this.option.extend(options);
  if (files.length > 0) {
    this.convertFile(files);
  } else {
    throw new Error('No file(s) given');
  }
};