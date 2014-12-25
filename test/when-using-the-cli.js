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
		var packageVersion = require('../package').version;
		var ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/cli': {
				'version': true
			},
			'./ebookr/util': {
				log: logSpy
			}
		}).cli();
		expect(logSpy.calledOnce).to.be.true;
		expect(logSpy.getCall(0).args).to.eql(['ebookr v' + packageVersion]);
	});
});
