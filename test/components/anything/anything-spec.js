'use strict';

var Anything = exports.Anything || require('./../../../components/anything/anything').Anything;

describe('Anything', function(){
  it('should load', function(){
    expect(Anything).toBeDefined();
  });
});
