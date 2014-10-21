var expect = require('chai').expect,
		parser = require('../src/parser');

describe('When clearing parser', function () {
	it('should clear tokens', function () {
		var prsr = parser();
		prsr.addToken('test', function () {});
		prsr.clear();
		expect(prsr.tokens).to.be.empty;
	});
});