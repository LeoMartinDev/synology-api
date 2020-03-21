/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const AuthenticatedAPI = require('./AuthenticatedAPI');

module.exports = class SurveillanceStation extends AuthenticatedAPI {

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
        this.sessionName = 'SurveillanceStation';
        this.syno.createFunctionsFor(this, ['SYNO.SurveillanceStation']);
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
            
    // Handle Surveillance Station specific errors
    error(code, api){
        // Task API specific errors
        if ((api === 'SYNO.SurveillanceStation.Camera') || 'SYNO.SurveillanceStation.PTZ') {
            switch (code) {
                case 400: return 'Execution failed'; break;
                case 401: return 'Parameter invalid'; break;
                case 402: return 'Camera disabled'; break;
            }
        }
        // Event API specific errors
        if ((api === 'SYNO.SurveillanceStation.Event') || 'SYNO.SurveillanceStation.Emap') {
            switch (code) {
                case 400: return 'Execution failed'; break;
                case 401: return 'Parameter invalid'; break;
            }
        }
        // Device API specific errors
        if (api === 'SYNO.SurveillanceStation.Device') {
            switch (code) {
                case 400: return 'Execution failed'; break;
                case 401: return 'Service is not enabled'; break;
            }
        }
        // Device API specific errors
        if (api === 'SYNO.SurveillanceStation.Notification') {
            switch (code) {
                case 400: return 'Execution failed'; break;
            }
        }
        // Did not find any specifi error, so call super function
        return super.error(...arguments);
    }
}