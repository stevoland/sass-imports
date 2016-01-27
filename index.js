/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author istarkov@gmail.com
  converts json to sass veriables
  example:
  test.json
  ```
  {
    "a": {
      "b": '100px',
      "c": {
        "d": 99
      }
    }
  }
  ```

  will be converted to
  ```
    $a-b : 100px
    $a-c-d : 99
  ```
*/
var loaderUtils = require('loader-utils');
var path = require('path');
var traverse = require('traverse');
var fs = require('fs');

var URL_REGEX = /\//;

module.exports = function SassImports(content) {
  var query = loaderUtils.parseQuery(this.query);
  var imports = [];
  var dir = path.dirname(path.resolve(this.resourcePath));
  var self = this;
  var prefix = '';
  if (this.cacheable) this.cacheable();

  Object.keys(query).forEach(function traverseFiles(fileName) {
    // var fpath = path.join(dir, fileName);
    // var includeContent = JSON.parse(fs.readFileSync(fpath));
    var code = fs.readFileSync(fileName, {encoding: 'utf8'});
    var includeContent = self.exec(code, fileName);
    var obj = traverse(includeContent);

    self.addDependency(fileName);

    obj.paths().forEach(function traverseJSONPAth(jsonPath) {
      var val = obj.get(jsonPath);
      if (typeof val !== 'object') {
        if (typeof val === 'string' && URL_REGEX.test(val)) {
          val = '"' + val + '"';
        }
        imports.push('$'+jsonPath.join('-') + ': ' + val + ';');
      }
    });
  });

  prefix = imports.join('\n') + '\n\n';

  return prefix + content;
};
