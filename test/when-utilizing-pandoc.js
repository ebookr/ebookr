var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

describe('When utilizing pandoc', function () {
	var ebookr, shell;

	beforeEach(function () {
		shell = { exec: sinon.spy() };
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/pandoc': mockrequire('../lib/ebookr/pandoc', {
				'shelljs': shell,
				'util': require('util'),
				'q': require('q')
			})
		}).new();
	});

	it('supports only srcFile', function () {
		ebookr.pandoc.convert('test.md');
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md');
	});

	it('returns a promise', function () {
		var promise = ebookr.pandoc.convert('test.md');
		expect(promise.then).to.exist;
	});

	it('should support option "output"', function () {
		ebookr.pandoc.convert('test.md', { output: 'test.html' });
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md -o test.html');
	});

	it('should support option "to"', function () {
		ebookr.pandoc.convert('test.md', { to: 'html5' });
		expect(shell.exec).to.have.been.calledWithMatch('pandoc test.md -t html5');
	});
});