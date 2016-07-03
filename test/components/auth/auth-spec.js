'use strict';

var Auth = exports.Auth || require('./../../../components/auth/auth').Auth;

describe('auth', function(){
  it('should load', function(){
    expect(Auth).toBeDefined();
  });
});
