# replace-tpl

Replaces a template strings with variables.

## Usage

```
const replaceTpl = require('replace-tpl');

var pathTpl = '/some/dir/[name].[hash:8].js';
var newPath = replaceTpl(pathTpl, {
  name: 'foo',
  hash: 'de56437c1e9544aa2521352dcdf26cb160093e52d4ea565cdf0d2bb279e22d12',
});

console.log(newPath); // /some/dir/foo.de56437c.js
```
