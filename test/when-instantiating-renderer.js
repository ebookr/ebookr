var expect = require('chai').expect,
		renderer = require('../src/renderer');

describe('When instantiating renderer', function () {
	it('should act like a singleton', function () {
		var rndr1 = renderer(),
				rndr2 = renderer();
		rndr1.addToken('test', 42);
		expect(rndr2.tokens.test).to.equal(42);
	});
});