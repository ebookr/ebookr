var chai = require('chai'),
		expect = chai.expect,
		sinonChai = require('sinon-chai'),
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

describe('When using the CLI', function () {
	var mockedConsole, converter, extensions;

	var mockEbookr = function (cli) {
		mockedConsole = { log: sinon.spy() };
		converter = { convertFile: sinon.spy() };
		extensions = { extend: sinon.spy() };
		metadata = { loadYAML: sinon.spy() };
		return mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/cli': mockrequire('../lib/ebookr/cli', {
				nopt: function () {
					return cli;
				},
				process: { argv: 42 },
				'./metadata': metadata,
				'../util/console': mockedConsole
			}),
			'./ebookr/converter': converter,
			'./ebookr/extensions': extensions
		});
	};

	it('should be able to log version', function () {
		mockEbookr({ argv: { remain: [] }, version: true }).cli();
		expect(mockedConsole.log).to.have.been.calledWithMatch(/ebookr v/);
	});

	it('should be pass on args', function () {
		var args = { argv: { remain: ['test'] } };
		mockEbookr(args).cli();
		expect(converter.convertFile).to.have.been.calledWith(['test'], args);
	});

	it('should warn if no files given', function () {
		expect(function () {
			mockEbookr({ argv: { remain: [] }}).cli();
		}).to.throw(/No file\(s\) given/);
	});

	it('should be able to pass metadata', function () {
		var args = { argv: { remain: ['test'] }, metadata: ['foo=42', 'bar'] };
		var ebookr = mockEbookr(args);
		ebookr.cli();
		expect(ebookr.metadata.get('foo')).to.equal('42');
		expect(ebookr.metadata.get('bar')).to.be.true;
		expect(converter.convertFile).to.have.been.calledWith(['test'], args);
	});

	it('should pass metadata as file', function () {
		mockEbookr({ argv: { remain: ['test'] }, metadataFile: 'test.yaml'}).cli();
		expect(metadata.loadYAML).to.have.been.calledWith('test.yaml');
	});

	it('should support adding extensions', function () {
		mockEbookr({ argv: { remain: ['test'] }, 'extension': ['test']}).cli();
		expect(extensions.extend).to.have.been.calledWith('ebookr-test');
	});
});
