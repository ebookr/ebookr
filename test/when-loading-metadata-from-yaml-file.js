var expect = require('chai').expect,
		mockrequire = require('mockrequire');

describe('When loading metadata from YAML file', function () {
	var metadata, fs;

	beforeEach(function () {
		var noop = function () {};
		fs = { readFileSync: function () {
			return '---\nfoo: 42\nbar: 1337'
		} };
		metadata = mockrequire('../lib/ebookr/metadata', {
			extend: require('extend'),
			fs: fs,
			'js-yaml': require('js-yaml')
		});
		metadata.loadYAML.call(metadata, 'test.yaml');
		metadata.call(metadata, 'foo', 42);
		metadata.call(metadata, 'bar', 666);
	});

	it('should add metadata', function () {
		expect(metadata.m).to.eql({
			foo: 42,
			bar: 666
		});
	});

	it('should keep track of original values', function () {
		expect(metadata.unchanged).to.eql({foo: 42});
	});

	it('can load an object with only the non-original properties', function () {
		expect(metadata.getChanged.call(metadata)).to.eql({bar: 666});
	});
});