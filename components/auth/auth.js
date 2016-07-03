(function(exports, global) {
  'use strict';

  global.fetch = global.fetch || require('node-fetch');

  /**
   * @class The Authentication Model handles login and logout and
   *        authentication locally or remotely.
   *
   * @extends Object
   */
  class Auth {

    /**
     * @param {Object} json Serialized json from a previuos app load
     */
    constructor(json) {
      console.log('Constructing auth', json);

      if (json && json.server) {
        Auth.server = json.server;
      }
    }

    static login(options) {
      const self = this;
      let xhr;
      let opts = {
        method: 'POST'
      };

      if (!options || !options.username || !options.password) {
        throw new Error('Login requires username and password');
      }

      opts.username = options.username;
      opts.password = options.password;

      if (options.server) {
        Auth.server = {
          url: options.server
        };
      }

      return global.fetch(Auth.server.url + '/v1/auth/login', opts).then(function(response) {
        xhr = response;
        return response.json();
      }).then(function(data) {
        if (xhr.status >= 400) {
          data.status = xhr.status;
          data.statusText = xhr.statusText;
          data.url = xhr.url;
          throw data;
        }

        if (data) {
          for (const attr in data) {
            if (data.hasOwnProperty(attr)) {
              self[attr] = data[attr];
            }
          }
          return self;
        }
      });
    }
  }

  exports.Auth = Auth;
})(exports, global);

