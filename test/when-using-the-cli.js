var expect = require('chai').expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

describe('When using the CLI', function () {
	var ebookr;

	beforeEach(function () {
		console.log = sinon.spy();
	});

	it('should be able to log version version', function () {
		var packageVersion = require('../package').version;
		var ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./cli': {
				'version': true
			}
		}).cli();
		expect(console.log.calledOnce).to.be.true;
		expect(console.log.getCall(0).args).to.eql(['ebookr v' + packageVersion]);
	});
});
