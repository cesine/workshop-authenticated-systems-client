'use strict';
/* globals fetchMock */

var fetchMockLocal;

try {
  fetchMockLocal = fetchMock;
} catch (err) {
  fetchMockLocal = require('fetch-mock');
}

var Auth = exports.Auth || require('./../../../components/auth/auth').Auth;

describe('Auth', function() {
  it('should load', function() {
    expect(Auth).toBeDefined();
  });

  describe('contruction', function() {
    it('should construct', function() {
      var auth = new Auth();
      expect(auth).toBeDefined();
    });

    it('should support json', function() {
      var auth = new Auth({
        server: {
          url: 'http://localhost:3000'
        }
      });

      expect(auth).toBeDefined();
      expect(Auth.server.url).toEqual('http://localhost:3000');
    });
  });

  describe('login', function() {
    afterEach(function() {
      fetchMockLocal.restore();
    });

    it('should require options', function() {
      var auth = new Auth();

      expect(function() {
        Auth.login();
      }).toThrow(new Error('Login requires username and password'));
    });

    it('should require username', function() {
      var auth = new Auth();

      expect(function() {
        Auth.login({
          password: 'IUH@8q98wejnsd'
        });
      }).toThrow(new Error('Login requires username and password'));
    });

    it('should require password', function() {
      var auth = new Auth();

      expect(function() {
        Auth.login({
          username: 'anonymouse'
        });
      }).toThrow(new Error('Login requires username and password'));
    });

    it('should login', function(done) {
      var auth = new Auth({
        server: {
          url: 'http://localhost:3000'
        }
      });

      fetchMockLocal.mock({
        name: 'valid_login',
        matcher: /\/v1\/auth\/login/,
        method: 'POST',
        response: {
          id: 1,
          givenName: 'Anony',
          language: 'fr',
          username: 'anonymouse',
          createdAt: '2016-05-15T15:04:18.027Z',
          updatedAt: '2016-05-15T15:04:18.027Z'
        }
      });

      Auth.login({
          username: 'anonymouse',
          password: 'IUH@8q98wejnsd'
        })
        .then(function(result) {
          expect(result.givenName).toEqual('Anony');
          expect(result.language).toEqual('fr');
          expect(result.createdAt).toEqual('2016-05-15T15:04:18.027Z');

          expect(fetchMockLocal.called('valid_login')).toBeTruthy();

          done();
        })
        .catch(function(err) {
          expect(err).toBeNull();
          exect(false).toBeTruthy();

          expect(fetchMockLocal.called('valid_login')).toBeTruthy();
          done();
        });
    });

    it('should accept a server url', function(done) {
      var auth = new Auth({
        server: 'http://example.com'
      });

      fetchMockLocal.mock({
        name: 'another_server',
        matcher: /\/v1\/auth\/login/,
        method: 'POST',
        response: {}
      });

      Auth.login({
        username: 'anonymouse',
        password: 'IUH@8q98wejnsd',
        server: 'http://another.com'
      }).then(function(result) {
        expect(fetchMockLocal.called('another_server')).toBeTruthy();
        done();
      });
    });

    it('should handle 403', function(done) {
      var auth = new Auth({
        server: {
          url: 'http://localhost:3000'
        }
      });

      fetchMockLocal.mock({
        name: 'invalid_login',
        matcher: /\/v1\/auth\/login/,
        method: 'POST',
        response: {
          status: 403,
          body: {
            message: 'Invalid username or password, please try again.'
          }
        }
      });

      Auth.login({
          username: 'anonymouse',
          password: 'IUH@8q98wejnsd'
        })
        .then(function(result) {
          expect(result).toBeNull();
          expect(true).toBeFalsy();

          done();
        })
        .catch(function(err) {
          expect(err.status).toEqual(403);
          expect(err.statusText).toEqual('Forbidden');
          expect(err.message).toEqual('Invalid username or password, please try again.');
          // expect(err.url).toEqual('http://localhost:3000/v1/auth/login');

          expect(fetchMockLocal.called('invalid_login')).toBeTruthy();
          done();
        });
    });
  });

  describe('logout', function() {
    afterEach(function() {
      fetchMockLocal.restore();
    });

    it('should logout', function(done) {
      var auth = new Auth({
        server: {
          url: 'http://localhost:3000'
        }
      });

      fetchMockLocal.mock({
        name: 'valid_logout',
        matcher: /\/v1\/auth\/logout/,
        method: 'POST',
        response: {}
      });

      Auth.logout()
        .then(function(result) {
          expect(result).toEqual({});

          expect(fetchMockLocal.called('valid_logout')).toBeTruthy();
          done();
        })
        .catch(function(err) {
          expect(err).toBeNull();
          exect(false).toBeTruthy();

          expect(fetchMockLocal.called('valid_logout')).toBeTruthy();
          done();
        });
    });

    it('should accept a server url', function(done) {
      var auth = new Auth({
        server: 'http://example.com'
      });

      fetchMockLocal.mock({
        name: 'another_server',
        matcher: /http:\/\/another.com\/v1\/auth\/logout/,
        method: 'POST',
        response: {
          status: 200,
          body: {}
        }
      });

      Auth.logout({
        server: 'http://another.com'
      }).then(function(result) {
        expect(result).toEqual({});

        expect(fetchMockLocal.called('another_server')).toBeTruthy();
        done();
      });
    });

    it('should handle 403', function(done) {
      var auth = new Auth();

      fetchMockLocal.mock({
        name: 'invalid_logout',
        matcher: /\/v1\/auth\/logout/,
        method: 'POST',
        response: {
          status: 403,
          body: {
            message: 'Not logged in.'
          }
        }
      });

      Auth.logout()
        .then(function(result) {
          expect(result).toBeNull();
          expect(true).toBeFalsy();

          expect(fetchMockLocal.called('invalid_logout')).toBeTruthy();
          done();
        })
        .catch(function(err) {
          expect(err.status).toEqual(403);
          expect(err.statusText).toEqual('Forbidden');
          expect(err.message).toEqual('Not logged in.');
          // expect(err.url).toEqual('http://localhost:3000/v1/auth/logout');

          expect(fetchMockLocal.called('invalid_logout')).toBeTruthy();
          done();
        });
    });
  });
});
