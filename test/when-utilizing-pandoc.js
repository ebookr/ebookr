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
			readFileSync: sinon.spy(function() {
				return "---\ntitle: TEST\nbar: old"
			})
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
			'./metadata': require('../lib/ebookr/metadata'),
			'./ebookr/pandoc': mockrequire('../lib/ebookr/pandoc', {
				'fs': fs,
				'js-yaml': require('js-yaml'),
				'randomstring': randomstring,
				'shelljs': shell,
				'util': require('util'),
				'q': require('q')
			})
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
		ebookr.pandoc('test.md', { output: 'test.html' });
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md -o test.html');
	});

	it('should support option "to"', function () {
		ebookr.pandoc('test.md', { to: 'html5' });
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md -t html5');
	});

	it('should support option "metadata"', function () {
		ebookr.pandoc('test.md', { metadataFile: 'metadata.yaml' });
		expect(shell.exec).to.have.been.calledWithMatch('pandoc metadata.yaml test.md');
	});

	it('should set metadata for pandoc if accumulated metadata differs from metadata.yaml', function () {
		ebookr.metadata({
			title: 'TEST',
			foo: '42',
			bar: 'new'
		});
		ebookr.pandoc('test.md', { metadataFile: 'metadata.yaml' });
		expect(fs.readFileSync).to.have.been.calledWith('metadata.yaml', 'utf-8');
		expect(shell.exec).to.have.been.calledWithMatch('pandoc metadata.yaml test.md -M foo=42 -M bar=new');
	});

	describe('When converting to MOBI', function () {
		beforeEach(function () {
			ebookr.pandoc('test.md', { output: 'test.mobi' });
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