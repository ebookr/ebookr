var expect = require('chai').expect,
		ebookr = require('../src/ebookr');

describe('When clearing ebookr', function () {
	it('should clear tokens', function (done) {
		ebookr().then(function (bkr) {
			bkr.addParser('test', function () {});
			bkr.clear();
			expect(bkr.tokens).to.be.empty;
			done();
		});
	});
});