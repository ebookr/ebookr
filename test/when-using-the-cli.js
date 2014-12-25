var expect = require('chai').expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

describe('When using the CLI', function () {
	var ebookr;
	var logSpy;

	beforeEach(function () {
		logSpy = sinon.spy();
	});

	it('should be able to log version version', function () {
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/cli': {
				'version': true
			},
			'./ebookr/util': {
				log: logSpy
			}
		}).cli();
		expect(logSpy.calledOnce).to.be.true;
		expect(logSpy.getCall(0).args[0]).to.match(/ebookr v/);
	});
});
