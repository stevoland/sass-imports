var path = require('path')
var sinon = require('sinon');
var should = require('should');
require('should-sinon');

var loader = require('../');
var context;
var someSass = 'background-color: #ddd'

var getQuery = function(file) {
  return '?context=' + path.resolve(__dirname, 'vars') + '&file=' + file;
}

describe('loader', function() {
  beforeEach(function() {
    context = {
      addDependency: sinon.spy(),
      addContextDependency: sinon.spy(),
      resourcePath: 'oi'
    }
  });

  it('should convert JS numbers to Sass variables', function() {
    context.query = getQuery('numbers.js');
    loader.call(context, someSass)
      .should.be.eql('$zIndex: 100;\n$opacity: 0.5;\n\nbackground-color: #ddd');

    context.addDependency.should.have.callCount(1)
    context.addContextDependency.should.have.callCount(1)
  });


  it('should convert JS strings to Sass variables', function() {
    context.query = getQuery('strings.js');
    loader.call(context, someSass)
      .should.be.eql('$localNavHeight: 50px;\n$fontSize: 16px;\n\nbackground-color: #ddd');

    context.addDependency.should.have.callCount(1)
    context.addContextDependency.should.have.callCount(1)
  });

  it('should convert JS lists to Sass variables', function() {
    context.query = getQuery('lists.js');
    loader.call(context, someSass)
      .should.be.eql('$defaultMargin-0: 10px;\n$defaultMargin-1: 0;\n$defaultMargin-2: 5px;\n$deepList-0-0: 1;\n$deepList-0-1: 2;\n$deepList-1-0: 4;\n$deepList-1-1: 5;\n\nbackground-color: #ddd');

    context.addDependency.should.have.callCount(1)
    context.addContextDependency.should.have.callCount(1)
  });

  it('should convert JS objects to Sass variables', function() {
    context.query = getQuery('objects.js');
    loader.call(context, someSass)
      .should.be.eql('$breakpoints-portraitS: 320px;\n$breakpoints-portraitM: 360px;\n$breakpoints-portraitL: 414px;\n$deepObject-a-b: c;\n\nbackground-color: #ddd');

    context.addDependency.should.have.callCount(1)
    context.addContextDependency.should.have.callCount(1)
  });

  it('should convert empty object JSON to Sass', function() {
    context.query = getQuery('emptyObject.js');
    loader.call(context, someSass)
      .should.be.eql('\n\n' + someSass);

    context.addDependency.should.have.callCount(1)
    context.addContextDependency.should.have.callCount(1)
  });
});
