var expect = require('chai').expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

describe('When using the CLI', function () {
	var converter;
	var logSpy;

	var mockEbookr = function (cli) {
		logSpy = sinon.spy();
		converter = { convertFile: sinon.spy() };
		mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/cli': cli,
			'./ebookr/converter': converter,
			'./util/console': {
				log: logSpy
			}
		}).cli();
	};

	it('should be able to log version', function () {
		mockEbookr({ version: true });
		expect(logSpy.calledOnce).to.be.true;
		expect(logSpy.getCall(0).args[0]).to.match(/ebookr v/);
	});

	it('should be able to target a specific file', function () {
		mockEbookr({ files: ['test'] });
		expect(converter.convertFile.calledOnce).to.be.true;
		expect(converter.convertFile.getCall(0).args).to.eql(['test', null]);
	});

	it('should be able to name outputed file', function () {
		mockEbookr({ files: ['test.md'], output: 'test.pdf' });
		expect(converter.convertFile.getCall(0).args).to.eql(['test.md', 'test.pdf']);
	});

	it('should warn if no files given', function () {
		expect(function () {
			mockEbookr({ files: [] });
		}).to.throw(/No file\(s\) given/);
	});
});
