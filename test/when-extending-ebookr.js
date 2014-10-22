var expect = require('chai').expect,
		mockrequire = require('mockrequire'),
		sinon = require('sinon'),
		ebookr = require('../src/ebookr');

describe('When extending ebookr', function () {
	var spy, bkr;

	beforeEach(function (done) {
		spy = sinon.spy(function () {
			ebookr().then(function (bkr) {
				bkr.addParser('test', function () {});
			});
		});
		mockrequire('../src/ebookr', {
			'ebookr-test': spy,
			'extend': require('extend'),
			'util': require('util'),
			'q': require('q'),
			'child_process': {
				exec: function (cmd, cb) {
					cb(null, '{"ebookr-test": {}}', null);
				}
			}
		})().then(function (inst) {
			bkr = inst;
			done();
		});
	});

	afterEach(function () {
		bkr.clear();
	});

	it('should load module', function () {
		expect(spy.called).to.be.true;
	});

	it('should add tokens', function (done) {
		ebookr().then(function (inst) {
			expect(inst.tokens.test).to.exist;
			done();
		});
	});
});