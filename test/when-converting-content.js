var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

describe('When converting content', function () {
	var pandoc, fs, promise;

	beforeEach(function () {
		fs = {
			unlinkSync: sinon.spy(),
			writeFileSync: sinon.spy()
		};
		pandoc = {
			convert: sinon.spy(function () { return 42; })
		};
		var randomstring = {
			generate: function () {
				return 'tmp';
			}
		};
		promise = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/converter': mockrequire('../lib/ebookr/converter', {
				'fs': fs,
				'randomstring': randomstring,
				'util': require('util'),
				'q': require('q'),
				'./pandoc': pandoc
			})
		}).new().convert('# test');
	});

	it('should create tmp file with rendered content', function () {
		expect(fs.writeFileSync).to.have.been.calledWith('tmp.md', '# test');
	});

	it('should return content as a promise', function () {
		expect(promise).to.equal(42);
	});

	it('should delete tmp file afterwards', function () {
		expect(fs.unlinkSync).to.have.been.calledWith('tmp.md');
	});

	it('should execute pandoc', function () {
		expect(pandoc.convert).to.have.been.calledWith('tmp.md', { to: 'html5' });
	});
});