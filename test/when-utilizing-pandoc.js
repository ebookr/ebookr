var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon'),
		q = require('q');

chai.use(sinonChai);

describe('When utilizing pandoc', function () {
	var ebookr, fs, shell, deferredExecPromise;

	beforeEach(function () {
		deferredExecPromise = q.defer();
		fs = {
			unlinkSync: sinon.spy(),
			writeFileSync: sinon.spy()
		};
		shell = { exec: sinon.spy(function (cmd, cbFn) {
			cbFn();
		}) };
		var randomstring = {
			generate: function () {
				return 'tmp';
			}
		};
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/pandoc': mockrequire('../lib/ebookr/pandoc', {
				'fs': fs,
				'randomstring': randomstring,
				'shelljs': shell,
				'util': require('util'),
				'q': require('q')
			}),
			'./ebookr/metadata': require('../lib/ebookr/metadata')
		}).new();
	});

	it('supports first argument as string', function () {
		ebookr.pandoc('test.md');
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md');
	});

	it('supports first argument as array', function () {
		ebookr.pandoc(['1.md', '2.md']);
		expect(shell.exec).to.have.been.calledWithMatch('pandoc 1.md 2.md');
	});

	it('returns a promise', function () {
		var promise = ebookr.pandoc('test.md');
		expect(promise.then).to.exist;
	});

	it('should support option "output"', function () {
		ebookr.option.set('output', 'test.html');
		ebookr.pandoc('test.md');
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md -o test.html');
	});

	it('should support option "to"', function () {
		ebookr.option.set('to', 'html5');
		ebookr.pandoc('test.md');
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md -t html5');
	});

	describe('When using metadataFile', function () {
		beforeEach(function () {
			ebookr.option.set('metadataFile', 'metadata.yaml');
			ebookr.pandoc('test.md');
		});

		it('creates temporary metadataend', function () {
			expect(fs.writeFileSync).to.have.been.calledWith('metadataend', '---');
		});

		it('inserts metadata-files into pandoc-cmd', function () {
			expect(shell.exec).to.have.been.calledWithMatch('pandoc metadata.yaml metadataend test.md');
		});

		it('deletes temporary metadataend when successful', function () {
			expect(fs.unlinkSync).to.have.been.calledWith('metadataend');
		});
	});

	it('should set metadata for pandoc if accumulated metadata differs from metadata.yaml', function () {
		ebookr.metadata.extend({ foo: 42, bar: 'new'});
		ebookr.option.set('metadataFile', 'metadata.yaml');
		ebookr.pandoc('test.md');
		expect(shell.exec).to.have.been.calledWithMatch('pandoc metadata.yaml metadataend test.md -M foo=42 -M bar=new');
	});

	describe('When converting to MOBI', function () {
		beforeEach(function () {
			ebookr.option.set('output', 'test.mobi');
			ebookr.pandoc('test.md');
		});

		it('should execute pandoc to create epub file', function () {
			expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md -o test.epub');
		});

		it('should execute kindlegen', function (done) {
			deferredExecPromise.resolve('test');
			deferredExecPromise.promise.then(function () {
				expect(shell.exec).to.have.been.calledWithMatch('kindlegen test.epub');
				done();
			});
		});
	})
});