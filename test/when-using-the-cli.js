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
		}).new();
	};

	it('should be able to log version', function () {
		mockEbookr({ argv: { remain: [] }, version: true }).cli();
		expect(mockedConsole.log).to.have.been.calledWithMatch(/ebookr v/);
	});

	it('should convert files', function () {
		mockEbookr({ argv: { remain: ['test'] } }).cli();
		expect(converter.convertFile).to.have.been.calledWith(['test']);
	});

	it('should warn if no files given', function () {
		expect(function () {
			mockEbookr({ argv: { remain: [] }}).cli();
		}).to.throw(/No file\(s\) given/);
	});

	it('should parse metadata', function () {
		var ebookr = mockEbookr({ argv: { remain: ['test'] }, metadata: ['foo=42', 'bar'] });
		ebookr.cli();
		expect(ebookr.option.get('metadata')).to.eql({
			foo: '42',
			bar: true
		});
	});
});
