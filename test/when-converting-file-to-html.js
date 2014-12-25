var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

describe('When converting file to html', function () {
	var ebookr, shell, fs;

	beforeEach(function () {
		fs = {
			readFileSync: sinon.spy(function () {
				return '**test**';
			}),
			unlinkSync: sinon.spy(),
			writeFileSync: sinon.spy()
		};
		shell = {
			exec: sinon.spy()
		};
		var randomstring = {
			generate: function () {
				return 'tmp';
			}
		};
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./converter': mockrequire('../lib/converter', {
				'shelljs': shell,
				'fs': fs,
				'randomstring': randomstring,
				'util': require('util')
			}),
			'./token': require('../lib/token')
		}).new();
	});

	it('should create tmp file with rendered content', function () {
		ebookr.convert('test.md');
		expect(fs.readFileSync).to.have.been.calledWith('test.md', 'utf-8');
		expect(fs.writeFileSync).to.have.been.calledWith('tmp.md', '**test**');
	});

	it('should delete tmp file afterwards', function () {
		ebookr.convert('test.md');
		expect(fs.unlinkSync).to.have.been.calledWith('tmp.md');
	});

	describe('With no output file given', function () {
		it('should execute pandoc', function () {
			ebookr.convert('test.md');
			expect(shell.exec).to.have.been.calledWith('pandoc tmp.md -t html5');
		});
	});

	describe('With output file given', function () {
		it('should create file', function () {
			ebookr.convert('test.md', 'test.html');
			expect(shell.exec).to.have.been.calledWith('pandoc tmp.md -o test.html');
		});
	});
});