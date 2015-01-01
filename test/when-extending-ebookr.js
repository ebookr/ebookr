var chai = require('chai'),
		sinonChai = require('sinon-chai'),
		expect = chai.expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

chai.use(sinonChai);

describe('When extending ebookr', function () {
	var extension, bkr;

	beforeEach(function () {
		extension = sinon.spy(function (ebookr) {
			ebookr.addParser('test', function () {});
		});
		bkr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'./ebookr/extensions': mockrequire('../lib/ebookr/extensions', {
				'ebookr-test': extension
			})
		});
	});

	it('can load modules with string', function () {
		bkr.loadExtension('test');
		expect(extension).to.have.been.calledWith(bkr);
	});

	it('can load modules from an array', function () {
		bkr.loadExtensions(['test']);
		expect(extension).to.have.been.calledWith(bkr);
	});

	it('should add tokens', function () {
		bkr.loadExtensions(['test']);
		expect(bkr.tokens.test).to.exist;
	});
});