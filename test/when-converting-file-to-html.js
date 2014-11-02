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
			readFile: sinon.spy(),
			unlink: sinon.spy(),
			writeFile: sinon.spy()
		};
		shell = {
			exec: sinon.spy()
		};
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'util': require('util'),
			'./token': require('../lib/token'),
			'shelljs': shell,
			'fs': fs
		}).new();
	});

	it('should create tmp file with rendered content', function () {
		ebookr.convert('test.md');
		expect(fs.readFile).to.have.been.calledWith('test.md', 'utf-8');
		fs.readFile.firstCall.args[2](null, '**test**');
		expect(fs.writeFile).to.have.been.calledWith('tmp.md', '**test**');
	});

	it('should delete tmp file afterwards', function () {
		ebookr.convert('test.md');
		fs.readFile.firstCall.args[2](null, '**test**');
		fs.writeFile.firstCall.args[2](null);
		expect(fs.unlink).to.have.been.calledWith('tmp.md');
	});

	describe('With no output file given', function () {
		it('should execute pandoc', function () {
			ebookr.convert('test.md');
			fs.readFile.firstCall.args[2](null, '');
			fs.writeFile.firstCall.args[2](null);
			expect(shell.exec).to.have.been.calledWith('pandoc tmp.md -t html5');
		});
	});

	describe('With output file given', function () {
		it('should create file', function () {
			ebookr.convert('test.md', 'test.html');
			fs.readFile.firstCall.args[2](null, '');
			fs.writeFile.firstCall.args[2](null);
			expect(shell.exec).to.have.been.calledWith('pandoc tmp.md -o test.html');
		});
	});
});