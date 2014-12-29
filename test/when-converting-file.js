var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon'),
		q = require('q');

chai.use(sinonChai);

describe('When converting file', function () {
	var ebookr, pandoc, fs, deferConverted;

	beforeEach(function () {
		fs = {
			readFileSync: sinon.spy(function () {
				return '**test**';
			}),
			unlinkSync: sinon.spy(),
			writeFileSync: sinon.spy()
		};
		deferConverted = q.defer();
		pandoc = {
			convert: sinon.spy(function () { return deferConverted.promise; })
		};
		var randomstring = {
			generate: function () {
				return 'tmp';
			}
		};
		ebookr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/converter': mockrequire('../lib/ebookr/converter', {
				'fs': fs,
				'randomstring': randomstring,
				'util': require('util'),
				'q': require('q'),
				'./pandoc': pandoc
			})
		}).new();
	});

	describe('With no output file given', function () {
		var promise;

		beforeEach(function () {
			promise = ebookr.convertFile(['test.md']);
		});

		it('should read file', function () {
			expect(fs.readFileSync).to.have.been.calledWith('test.md', 'utf-8');
		});

		it('should create tmp file with rendered content', function () {
			expect(fs.writeFileSync).to.have.been.calledWith('tmp.md', '**test**');
		});

		it('should return content as a promise', function () {
			expect(promise.then).to.exist;
		});

		it('should delete tmp file afterwards', function (done) {
			deferConverted.resolve('test');
			deferConverted.promise.then(function () {
				expect(fs.unlinkSync).to.have.been.calledWith('tmp.md');
				done();
			})
		});

		it('should execute pandoc', function () {
			expect(pandoc.convert).to.have.been.calledWith('tmp.md', { to: 'html5' });
		});
	});

	describe('With multiple files given', function () {
		it('should read all files', function () {
			ebookr.convertFile(['test.md', 'test2.md']);
			expect(fs.readFileSync).to.have.been.calledWith('test.md', 'utf-8');
			expect(fs.readFileSync).to.have.been.calledWith('test2.md', 'utf-8');
		});
	});

	describe('With output file given', function () {
		it('should create file', function () {
			ebookr.convertFile(['test.md'], 'test.html');
			expect(pandoc.convert).to.have.been.calledWith('tmp.md', { output: 'test.html' });
		});
	});
});