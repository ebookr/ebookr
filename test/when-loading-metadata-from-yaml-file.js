var expect = require('chai').expect,
		mockrequire = require('mockrequire');

describe('When loading metadata from YAML file', function () {
	var metadata;

	beforeEach(function () {
		var fs = { readFileSync: function () {
			return '---\nfoo: 42\nbar: 1337'
		} };
		metadata = mockrequire('../lib/ebookr/metadata', {
			extend: require('extend'),
			fs: fs,
			'js-yaml': require('js-yaml')
		}).loadYAML('test.yaml');
		metadata.set('foo', 42);
		metadata.set('bar', 666);
	});

	it('should add metadata', function () {
		expect(metadata.get()).to.eql({
			foo: 42,
			bar: 666
		});
	});

	it('can load an object with only the non-original properties', function () {
		expect(metadata.getChanged()).to.eql({bar: 666});
	});
});