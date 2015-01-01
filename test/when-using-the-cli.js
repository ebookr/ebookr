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
		metadata = require('../lib/ebookr/metadata');
		metadata.loadYAML = sinon.spy();
		return mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/cli': cli,
			'./ebookr/converter': converter,
			'./ebookr/metadata': metadata,
			'./util/console': {
				log: logSpy
			}
		});
	};

	it('should be able to log version', function () {
		mockEbookr({ version: true }).cli();
		expect(logSpy.calledOnce).to.be.true;
		expect(logSpy).to.have.been.calledWithMatch(/ebookr v/);
	});

	it('should be pass on args', function () {
		var args = { files: ['test'] };
		mockEbookr(args).cli();
		expect(converter.convertFile).to.have.been.calledWith(['test'], args);
	});

	it('should warn if no files given', function () {
		expect(function () {
			mockEbookr({ files: [] }).cli();
		}).to.throw(/No file\(s\) given/);
	});

	it('should be able to pass metadata', function () {
		var args = { files: ['test'], metadata: ['foo=42', 'bar'] };
		var ebookr = mockEbookr(args);
		ebookr.cli();
		expect(ebookr.metadata.get('foo')).to.equal('42');
		expect(ebookr.metadata.get('bar')).to.be.true;
		expect(converter.convertFile).to.have.been.calledWith(['test'], args);
	});

	it('should pass metadata as file', function () {
		mockEbookr({files: ['test'], metadataFile: 'test.yaml'}).cli();
		expect(metadata.loadYAML).to.have.been.calledWith('test.yaml');
	});
});
