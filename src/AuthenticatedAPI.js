/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const API = require('./API');

// Authenticated API
// API that logs in before calling real request
module.exports = (function() {
    let noop = undefined;
    AuthenticatedAPI = class AuthenticatedAPI extends API {
        static initClass() {
    
            // Private noop function
            noop = function() {};
        }

        // Overrides request : login before calling real request
        async request(options) {
            if (this.syno.sessions && this.syno.sessions[options.sessionName] && this.syno.sessions[options.sessionName]['_sid']) {
                return super.request(options);
            // Else login then call real request
            } else {
                const response = await this.syno.auth.login(options.sessionName);

                this.syno.sessions[options.sessionName] = response['sid'];
                options.params['_sid'] = response['sid'];
                return AuthenticatedAPI.prototype.__proto__.request.call(this, options);
            }
        }
    };
    AuthenticatedAPI.initClass();
    return AuthenticatedAPI;
})();