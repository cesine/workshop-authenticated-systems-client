'use strict';

const User = exports.User || require('./../../../components/user/user').User;

describe('User', function(){
  it('should load', function(){
    expect(User).toBeDefined();
  });
});
