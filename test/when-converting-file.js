var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

describe('When converting file', function () {
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
			'./ebookr/converter': mockrequire('../lib/ebookr/converter', {
				'shelljs': shell,
				'fs': fs,
				'randomstring': randomstring,
				'util': require('util'),
				'q': require('q')
			})
		}).new();
	});

	describe('With no output file given', function () {
		var promise;

		beforeEach(function () {
			promise = ebookr.convertFile('test.md');
		});

		it('should read file', function () {
			expect(fs.readFileSync).to.have.been.calledWith('test.md', 'utf-8');
		});

		it('should create tmp file with rendered content', function () {
			expect(fs.writeFileSync).to.have.been.calledWith('tmp.md', '**test**');
		});

		it('should return content as a promise if no output is given', function () {
			expect(promise.then).to.exist;
		});

		it('should delete tmp file afterwards', function () {
			expect(fs.unlinkSync).to.have.been.calledWith('tmp.md');
		});

		it('should execute pandoc', function () {
			expect(shell.exec).to.have.been.calledWith('pandoc tmp.md -t html5');
		});
	});

	describe('With output file given', function () {
		it('should create file', function () {
			ebookr.convertFile('test.md', 'test.html');
			expect(shell.exec).to.have.been.calledWith('pandoc tmp.md -o test.html');
		});
	});
});