var loaderUtils = require('loader-utils');
var path = require('path');
var traverse = require('traverse');
var fs = require('fs');

var URL_REGEX = /\//;

module.exports = function SassImports(content) {
  var query = loaderUtils.parseQuery(this.query);
  var context;
  var files = [];
  var imports = [];
  var dir = path.dirname(path.resolve(this.resourcePath));
  var self = this;
  var prefix = '';
  if (this.cacheable) this.cacheable();

  if (query.file) {
    if (Array.isArray(query.file)) {
      files = files.concat(query.file);
    } else {
      files.push(query.file);
    }
  }

  if (query.files) {
    if (Array.isArray(query.files)) {
      files = files.concat(query.files);
    } else {
      files.push(query.files);
    }
  }

  if (query.context) {
    context = query.context;
    self.addContextDependency(context);
  }

  var requireFresh = require('require-fresh')({
    dir: context,
    watch: false,
    force: true
  });

  files.forEach(function traverseFiles(fileName) {
    // var code = fs.readFileSync(fileName, {encoding: 'utf8'});
    // var includeContent = self.exec(code, fileName);
    var absoluteFilename = fileName;
    if (context) {
      absoluteFilename = path.join(context, absoluteFilename);
    }

    var relativeFilename = path.relative(dir, fileName);
    var includeContent = requireFresh(fileName, {fresh: true});
    var obj = traverse(includeContent);

    self.addDependency(relativeFilename);

    obj.paths().forEach(function traverseJSONPAth(jsonPath) {
      var val = obj.get(jsonPath);

      if (typeof val !== 'object') {
        if (typeof val === 'string' && URL_REGEX.test(val)) {
          val = '"' + val + '"';
        } else if (typeof val === 'boolean') {
          val = val ? 'true' : false;
        }

        imports.push('$' + jsonPath.join('-') + ': ' + val + ';');
      }
    });
  });

  prefix = imports.join('\n') + '\n\n';

  return prefix + content;
};
