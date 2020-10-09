/**
 * test cases
 * 
 * sobird<i@sobird.me> at 2020/10/09 14:57:01 created.
 */

const assert = require('assert');
const replaceTpl = require('../index');

describe('replaceTpl()', function () {
  let pathTpl = '/some/dir/[name].[hash:8].js';
  let data = {
    name: 'foo',
    hash: 'de56437c1e9544aa2521352dcdf26cb160093e52d4ea565cdf0d2bb279e22d12',
  };

  let expectation = '/some/dir/foo.de56437c.js'

  it(`${pathTpl} -> ${expectation}`, function () {
    assert.strictEqual(replaceTpl(pathTpl, data), expectation);
  });
});
