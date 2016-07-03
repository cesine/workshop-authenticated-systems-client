'use strict'

var lib = require('./..');

describe('anything library', function(){
  it('should load', function(){
    expect(lib).toBeDefined();
  });

  it('should have Auth', function(){
    expect(lib.Auth).toBeDefined();
  });

  it('should expose Anything', function(){
    expect(lib.Anything).toBeDefined();
  });

  it('should expose User', function(){
    expect(lib.User).toBeDefined();
  });
});
