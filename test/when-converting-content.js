var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon'),
		q = require('q');

chai.use(sinonChai);

describe('When converting content', function () {
	var pandoc, fs, promise, deferConverted;
	var metadata, extensions;

	var mockEbookr = function (options) {
		fs = {
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
		extensions = { extend: sinon.spy() };
		metadata = { loadYAML: sinon.spy() };
		return mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/converter': mockrequire('../lib/ebookr/converter', {
				'fs': fs,
				'randomstring': randomstring,
				'util': require('util'),
				'q': require('q'),
				'./metadata': metadata,
				'./pandoc': pandoc
			}),
			'./ebookr/extensions': extensions
		}).new();
	};

	describe('With no options', function () {
		beforeEach(function () {
			promise = mockEbookr().convert('# test');;
		});

		it('should create tmp file with rendered content', function () {
			expect(fs.writeFileSync).to.have.been.calledWith('tmp.md', '# test');
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
	})

	describe('With options', function () {
		it('should pass on metadata', function () {
			ebookr = mockEbookr();
			ebookr.convert('# test', { metadata: {foo: '42', bar: true} });
			expect(ebookr.metadata.get('foo')).to.equal('42');
			expect(ebookr.metadata.get('bar')).to.be.true;
		});

		it('should pass metadata as file', function () {
			ebookr = mockEbookr();
			ebookr.convert('# test', { metadataFile: 'test.yaml' });
			expect(metadata.loadYAML).to.have.been.calledWith('test.yaml');
		});

		it('should support adding extensions', function () {
			ebookr = mockEbookr();
			ebookr.convert('# test', { extensions: ['test'] });
			expect(extensions.extend).to.have.been.calledWith('ebookr-test');
		});
	});
});