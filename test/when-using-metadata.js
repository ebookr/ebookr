var expect = require('chai').expect;

describe('When using metadata', function () {
	var metadata;

	beforeEach(function () {
		metadata = require('../lib/ebookr/metadata').new();
	});

	it('should return all metadata if no parameters are given', function () {
		metadata.set('test', 1337);
		expect(metadata.get()).to.eql({ test: 1337 });	
	})

	it('should be able to get and set metadata', function () {
		metadata.set('test', 1337);
		metadata.set('test', 42);
		expect(metadata.get('test')).to.equal(42);	
	});

	it('should allow objects to be passed', function () {
		metadata.extend({ test: 1337 });
		metadata.extend({ test: 42 });
		expect(metadata.get('test')).to.equal(42);	
	});
});