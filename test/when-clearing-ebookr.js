var expect = require('chai').expect,
		ebookr = require('../src/ebookr');

describe('When clearing ebookr', function () {
	it('should clear tokens', function () {
		var bkr = ebookr();
		bkr.addParser('test', function () {});
		bkr.clear();
		expect(bkr.tokens).to.be.empty;
	});
});