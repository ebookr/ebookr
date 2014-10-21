var expect = require('chai').expect,
		parser = require('../src/parser');

describe('When instantiating parser', function () {
	it('should act like a singleton', function () {
		var parser1 = parser(),
				parser2 = parser(),
				fn = function () {};
		parser1.addToken('test', fn);
		expect(parser2.tokens.test).to.equal(fn);
	});
});