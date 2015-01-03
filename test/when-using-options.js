var expect = require('chai').expect,
		extend = require('extend');

describe('When using option', function () {
	var option;

	beforeEach(function () {
		option = require('../lib/ebookr/option').new();
	});

	it('should return all option if no parameters are given', function () {
		var options = option.get();
		option.set('test', 1337);
		expect(option.get()).to.eql(extend(options, { test: 1337 }));
	})

	it('should be able to get and set options', function () {
		option.set('test', 1337);
		option.set('test', 42);
		expect(option.get('test')).to.equal(42);	
	});

	it('should allow objects to be passed', function () {
		option.extend({ test: 1337 });
		option.extend({ test: 42 });
		expect(option.get('test')).to.equal(42);	
	});
});