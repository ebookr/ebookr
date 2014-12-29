var chai = require('chai'),
		expect = chai.expect,
		sinonChai = require('sinon-chai'),
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

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
		expect(logSpy).to.have.been.calledWithMatch(/ebookr v/);
	});

	it('should be pass on args', function () {
		var args = { files: ['test'] };
		mockEbookr(args);
		expect(converter.convertFile).to.have.been.calledWith(['test'], args);
	});

	it('should warn if no files given', function () {
		expect(function () {
			mockEbookr({ files: [] });
		}).to.throw(/No file\(s\) given/);
	});
});
