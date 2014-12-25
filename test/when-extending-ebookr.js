var expect = require('chai').expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon');

describe('When extending ebookr', function () {
	var spy, bkr, ebookr;

	beforeEach(function () {
		ebookr = require('../lib/ebookr').new();
		spy = sinon.spy(function () {
			ebookr.addParser('test', function () {});
		});
		bkr = mockrequire('../lib/ebookr', {
			'extend': require('extend'),
			'util': require('util'),
			'shelljs': require('shelljs'),
			'fs': require('fs'),
			'randomstring': require('randomstring'),
			'./ebookr/extensions': mockrequire('../lib/ebookr/extensions', {
				'ebookr-test': spy,
				'util': require('util')
			})
		});
	});

	it('can load modules from an object', function () {
		bkr.loadExtensions({
			'ebookr-test': 42
		});
		expect(spy.called).to.be.true;
		expect(spy.getCall(0).args[0]).to.equal(42);
	});

	it('can load modules from an array', function () {
		bkr.loadExtensions(['ebookr-test']);
		expect(spy.called).to.be.true;
		expect(spy.getCall(0).args[0]).to.be.undefined;
	});

	it('should add tokens', function () {
		bkr.loadExtensions(['ebookr-test']);
		expect(ebookr.tokens.test).to.exist;
	});
});