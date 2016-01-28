# sass-vars-loader

## Webpack loader to import JavaScript object as Sass variables

Convert a JavaScript object to Sass variables and prepend them to your Sass files.
Useful for theming and sharing values between JavaScript and Sass for those who don't want
to go all in on CSS in JS.

### Example:

```javascript
// You can require other modules but for hot-reloading to work they should be
// within the `context` dir
var aValue = require('./other-module');

module.exports = {
  a: {
    b: '100px',
    c: {
      d: 99,
      e: true,
      f: aValue
    }
  },
  // URLs to assets should be relative to your Webpack `resolve.root`
  // so they can be `required` from any JS or Sass module
  logo: 'themes/id/logo.svg'
};
```

Will be converted to:

```sass
  $a-b: 100px;
  $a-c-d: 99;
  $a-c-e: true;
  $a-c-f: 1em; // From other-module';
  $logo: "themes/id/logo.svg";
```

Values containing `/` are wrapped with quotes, otherwise they become Sass values.

## Usage
```javascript
'style-loader!css-loader!autoprefixer-loader!sass-loader?indentedSyntax=sass!sass-imports?context=' + path.resolve(__dirname, 'themes') + '&file=id/vars.js'
```

 - `context` - Absolute path to a folder. Changes to assets in this folder trigger rebuilds
 - `file` - Path to module that exports vars object. Absolute or relative to `context`
 - `files[]` - Array of `file`s

## License
MIT (http://www.opensource.org/licenses/mit-license.php)
