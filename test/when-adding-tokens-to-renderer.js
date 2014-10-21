var expect = require('chai').expect,
		renderer = require('../src/renderer');

describe('When adding tokens to renderer', function () {
	var rndr;

	beforeEach(function () {
		rndr = renderer();
	});

	it('should by default contain no tokens to convert', function () {
		expect(Object.keys(rndr.tokens)).to.be.empty;
	});

	it('should be able to add tokens individually', function () {
		rndr.addToken('test', 42);
		expect(rndr.tokens.test).to.equal(42);
	});

	it('should be able to add tokens en masse', function () {
		rndr.addTokens({
			'test1': 42,
			'test2': 1337
		});
		expect(rndr.tokens.test1).to.equal(42);
		expect(rndr.tokens.test2).to.equal(1337);
	});
});