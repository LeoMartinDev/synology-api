/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const AuthenticatedAPI = require('./AuthenticatedAPI');

module.exports = class DownloadStation extends AuthenticatedAPI {

    constructor(syno){
        {
          // Hack: trick Babel/TypeScript into allowing this before super.
          if (false) { super(); }
          let thisFn = (() => { return this; }).toString();
          let thisName = thisFn.match(/return (?:_assertThisInitialized\()*(\w+)\)*;/)[1];
          eval(`${thisName} = this;`);
        }
        this.syno = syno;
        super(this.syno);
        this.sessionName = 'DownloadStation';
        this.syno.createFunctionsFor(this, ['SYNO.DownloadStation']);
    }

    getMethods(params, done){
        const to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
        const keys = ((() => {
            const result = [];
            for (let k in this) {
                const v = this[k];
                if (typeof v === 'function') {
                    result.push(k);
                }
            }
            return result;
        })());
        const filtered = keys.filter(method_name => to_exclude.indexOf(method_name) === -1);
        return done(filtered);
    }

    // Handle Download Station specific errors
    error(code, api){
        // Task API specific errors
        if (api === 'SYNO.DownloadStation.Task') {
            switch (code) {
                case 400: return 'File upload failed'; break;
                case 401: return 'Max number of tasks reached'; break;
                case 402: return 'Destination denied'; break;
                case 403: return 'Destination does not exist'; break;
                case 404: return 'Invalid task id'; break;
                case 405: return 'Invalid task action'; break;
                case 406: return 'No default destination'; break;
                case 407: return 'Set destination failed'; break;
                case 408: return 'File does not exist'; break;
            }
        }
        // BTSearch API specific errors
        if (api === 'SYNO.DownloadStation.BTSearch') {
            switch (code) {
                case 400: return 'Unknown error'; break;
                case 401: return 'Invalid parameter'; break;
                case 402: return 'Parse the user setting failed'; break;
                case 403: return 'Get category failed'; break;
                case 404: return 'Get the search result from DB failed'; break;
                case 405: return 'Get the user setting failed'; break;
            }
        }
        // Did not find any specifi error, so call super function
        return super.error(...arguments);
    }
}