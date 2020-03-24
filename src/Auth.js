/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const API = require('./API');

// Auth API
module.exports = (function() {
    let api = undefined;
    let version = undefined;
    let path = undefined;
    Auth = class Auth extends API {
        static initClass() {
    
            // API name
            api = 'SYNO.API.Auth';
            // API version
            version = 3;
            // API path
            path = 'auth.cgi';
        }

        // Login to Syno
        login(sessionName){
            // API method is `login`
            const method = 'login';
            // Parameters
            const params = {
                account: this.syno.account,
                passwd: this.syno.passwd,
                session: sessionName,
                format: 'sid'
            };

            // Set sid to null
            if (!this.syno.sessions) {
                this.syno.sessions = {};
            }
            if (!this.syno.sessions[sessionName]) {
                this.syno.sessions[sessionName] = {};
            }

            this.syno.sessions[sessionName]['_sid'] = null;

            // Request login
            return this.request({api, version, path, method, params});
        }

        // Logout to syno
        logout(sessionName = null){
            // Don't do anything if there is no session
            if (!this.syno.sessions) { return null; }
            // API method is `logout`
            const method = 'logout';
            // Init logout parameters
            const params = {session: this.syno.session};

            // Delete sessions
            if (sessionName) {
                this.syno.sessions[sessionName] = null;
            } else {
                this.syno.sessions = null;
            }

            // Request logout
            return this.request({api, version, path, method, params});
        }

        // Handle auth specific errors
        error(code){
            switch (code) {
                case 400: return 'No such account or incorrect password'; break;
                case 401: return 'Account disabled'; break;
                case 402: return 'Permission denied'; break;
                case 403: return '2-step verification code required'; break;
                case 404: return 'Failed to authenticate 2-step verification code'; break;
            }
            // No specific error, so call super function
            return super.error(...arguments);
        }
    };
    Auth.initClass();
    return Auth;
})();