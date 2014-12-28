var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

describe('When converting content', function () {
	var shell, fs, promise;

	beforeEach(function () {
		fs = {
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
		promise = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/converter': mockrequire('../lib/ebookr/converter', {
				'shelljs': shell,
				'fs': fs,
				'randomstring': randomstring,
				'util': require('util'),
				'q': require('q')
			})
		}).new().convert('# test');
	});

	it('should create tmp file with rendered content', function () {
		expect(fs.writeFileSync).to.have.been.calledWith('tmp.md', '# test');
	});

	it('should return content as a promise', function () {
		expect(promise.then).to.exist;
	});

	it('should delete tmp file afterwards', function () {
		expect(fs.unlinkSync).to.have.been.calledWith('tmp.md');
	});

	it('should execute pandoc', function () {
		expect(shell.exec).to.have.been.calledWith('pandoc tmp.md -t html5');
	});
});