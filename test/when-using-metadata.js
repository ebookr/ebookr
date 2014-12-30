var expect = require('chai').expect;

describe('When using metadata', function () {
	var ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
	});

	it('should return all metadata if no parameters are given', function () {
		ebookr.metadata('test', 1337);
		expect(ebookr.metadata()).to.eql({ test: 1337 });	
	})

	it('should be able to get and set metadata', function () {
		ebookr.metadata('test', 1337);
		ebookr.metadata('test', 42);
		expect(ebookr.metadata('test')).to.equal(42);	
	});

	it('should allow flag to set value only if it is not defined before', function () {
		ebookr.metadata('test', 1337, true);
		ebookr.metadata('test', 42, true);
		expect(ebookr.metadata('test')).to.equal(1337);	
	});

	it('should allow objects to be passed', function () {
		ebookr.metadata({ test: 1337 });
		ebookr.metadata({ test: 42 });
		expect(ebookr.metadata('test')).to.equal(42);	
	});

	it('should allow only new values to be extended to metadata', function () {
		ebookr.metadata({ foo: 1337 }, true);
		ebookr.metadata({ foo: 42, bar: 666 }, true);
		expect(ebookr.metadata('foo')).to.equal(1337);
		expect(ebookr.metadata('bar')).to.equal(666);
	});
});