var expect = require('chai').expect,
		ebookr = require('../src/ebookr'),
		q = require('q');

describe('When instantiating ebookr', function () {
	it('should return as a promise', function () {
		expect(ebookr().then).to.exist;
	});

	it('should act like a singleton', function (done) {
		var fn = function () {};
		q.allSettled([ebookr(), ebookr()]).then(function (bkrs) {
			bkrs[0].value.addParser('test', fn);
			expect(bkrs[0].value.tokens).to.equal(bkrs[1].value.tokens);
			done();
		});
	});
});