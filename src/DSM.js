/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const AuthenticatedAPI = require('./AuthenticatedAPI');

module.exports = class DSM extends AuthenticatedAPI {

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
        this.sessionName = 'DiskStationManager';
        this.syno.createFunctionsFor(this, ['SYNO.DSM', 'SYNO.Core']);
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
}