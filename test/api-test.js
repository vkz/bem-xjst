var bem = require('..');
var assert = require('assert');

describe('BEM.js compiler', function() {
  function test(fn, data, expected) {
    var body = fn.toString().replace(/^function\s*\(\)\s*{|}$/g, '');
    var fns = [
      bem.compile(body, { optimize: false }),
      bem.compile(body)
    ];

    fns.forEach(function(fn) {
      assert.equal(fn.apply.call(data || {}), expected);
    });
  }

  it('should compile example code', function() {
    test(function() {
      block('b1').tag()(
        elem('e1')('a'),
        elem('e2').match(function() {
          return this.ctx.hooray();
        })(function() {
          return apply(this)('mode', { 'a': 1 });
        })
      );
    }, { block: 'b1', elem: 'e1' }, '<a class="b1__e1"></a>');
  });

  it('should understand applyCtx', function() {
    test(function() {
      block('b1').content()(function() {
        return applyCtx(this)({ block: 'b2' });
      });
      block('b2').tag()('li');
    }, { block: 'b1' }, '<div class="b1"><li class="b2"></li></div>');
  });
});