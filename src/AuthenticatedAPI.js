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
        request(options, done){
            // If session property is set, call real request
            if (done == null) { done = noop; }
            if (this.syno.sessions && this.syno.sessions[options.sessionName] && this.syno.sessions[options.sessionName]['_sid']) {
                return super.request(options, done);
            // Else login then call real request
            } else { return this.syno.auth.login(options.sessionName, (error, response)=> {
                if (error) {
                    return done(error);
                } else {
                    this.syno.sessions[options.sessionName] = response['sid'];
                    options.params['_sid'] = response['sid'];
                    return AuthenticatedAPI.prototype.__proto__.request.call(this, options, done);
                }
            }); }
        }
    };
    AuthenticatedAPI.initClass();
    return AuthenticatedAPI;
})();