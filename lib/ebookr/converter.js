var fs = require('fs'),
		randomstring = require('randomstring'),
		util = require('util'),
		q = require('q');

var metadata = require('./metadata'),
		pandoc = require('./pandoc');

var formatMap = {
	'html': 'html5'
};

var convert = function (src) {
	var options = this.option.get();
  if (options.metadataFile) {
    this.metadata = metadata.loadYAML(options.metadataFile);
  }
  if (options.metadata) {
  	this.metadata.extend(options.metadata);
  }
  if (options.extensions) {
    options.extensions.forEach(function (extensionName) {
      this.loadExtension(extensionName);
    }.bind(this));
  }
	var renderedText = this.parse(src).render();
	var tmpFileName = randomstring.generate() + '.md';
	fs.writeFileSync(tmpFileName, renderedText);
	options = options || {};
	if (!options.output) {
		options.to = formatMap[this.option.get('format')];
	}
	var promise = pandoc.convert.call(this, tmpFileName).then(function () {
		fs.unlinkSync(tmpFileName);
	})
	return promise;
};

module.exports.convert = function (src) {
	return convert.call(this, src);
};

module.exports.convertFile = function (srcFiles) {
	var data = srcFiles.map(function (srcFile) {
		return fs.readFileSync(srcFile, this.option.get('encoding'));
	}.bind(this)).join('\n\n');
	return convert.call(this, data);
};