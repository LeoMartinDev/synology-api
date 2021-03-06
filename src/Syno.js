/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Require node modules
const request = require('request');
const fs = require('fs');
let path = require('path');
const {defaults, mapValues, keys, values, flatten, filter,
first, last, some, merge, isArray, startsWith, endsWith, cloneDeep} = require('lodash');

const definitionsV5 = require('./definitions/definitions.5.x.json');
const definitionsV6 = require('./definitions/definitions.6.x.json');

const Utils = require('./Utils');
const Auth = require('./Auth');
const DSM = require('./DSM');
const FileStation = require('./FileStation');
const DownloadStation = require('./DownloadStation');
const AudioStation = require('./AudioStation');
const VideoStation = require('./VideoStation');
const VideoStationDTV = require('./VideoStationDTV');
const SurveillanceStation = require('./SurveillanceStation');

const definitions = {
    '5.x': definitionsV5,
    '6.x': definitionsV6,
};

// Class Syno
module.exports = (function() {
    let defParams = undefined;
    let apiVersionsAvailable = undefined;
    Syno = class Syno {
        static initClass() {
    
            // Default synology parameters
            defParams = {
                // Default account is null
                account: undefined,
                // Default password is null
                passwd: undefined,
                // Default protocol is HTTP (`http`)
                protocol: 'http',
                // Default host is `localhost`
                host: 'localhost',
                // Default port is `5000`
                port: 5000,
                // Default api version is `6.2.2`
                apiVersion: '6.2.2',
                // Default debug flag is `false`
                debug: false,
                // Default ignore certificate errors
                ignoreCertificateErrors: false
            };
    
            apiVersionsAvailable = ['5.0', '5.1', '5.2',
                                    '6.0', '6.0.1', '6.0.2', '6.0.3',
                                    '6.1', '6.1.1', '6.1.2', '6.1.3', '6.1.4', '6.1.5', '6.1.6', '6.1.7',
                                    '6.2', '6.2.1', '6.2.2'];
        }

        // Constructor for the Syno class
        // `params`             [Object]
        // `params.account`     [String] Account for the syno instance. * Required *
        // `params.passwd`      [String] Password for the account. * Required *
        // `params.protocol`    [String] Protocol for the syno requests.
        // `params.host`        [String] Host of the syno.
        // `params.port`        [String] Port for the syno requests.
        // `params.apiVersion`  [String] DSM api version.
        constructor(params){
            // Use defaults options
            defaults(this, params, defParams);

            // Debug mode
            if (this.debug) { console.log(`[DEBUG] : Account: ${this.account}`); }
            if (this.debug) { console.log(`[DEBUG] : Password: ${this.passwd}`); }
            if (this.debug) { console.log(`[DEBUG] : Host: ${this.host}`); }
            if (this.debug) { console.log(`[DEBUG] : Port: ${this.port}`); }
            if (this.debug) { console.log(`[DEBUG] : API: ${this.apiVersion}`); }
            if (this.debug) { console.log(`[DEBUG] : Ignore certificate errors: ${this.ignoreCertificateErrors}`); }

            // Throw errors if required params are not passed
            if (!this.account) { throw new Error('Did not specified `account` for syno'); }
            if (!this.passwd) { throw new Error('Did not specified `passwd` for syno'); }
            if (!(new RegExp(apiVersionsAvailable.join('|')).test(this.apiVersion))) {
            throw new Error(`Api version: ${this.apiVersion} is not available. \
Available versions are: ${apiVersionsAvailable.join(', ')}`
            ); }

            // Create request with jar
            this.request = request.defaults({rejectUnauthorized: !this.ignoreCertificateErrors, json: true});
            if (this.debug) { request.debug = true; }
            // Init session property
            this.session = null;

            // Add auth API
            this.auth = new Auth(this);
            // Add DSM API
            this.dsm = (this.diskStationManager = new DSM(this));
            // Add FileStation API
            this.fs = (this.fileStation = new FileStation(this));
            // Add Download Station API
            this.dl = (this.downloadStation = new DownloadStation(this));
            // Add Audio Station API
            this.as = (this.audioStation = new AudioStation(this));
            // Add Video Station API
            this.vs = (this.videoStation = new VideoStation(this));
            // Add Video Station DTV API
            this.dtv = (this.videoStationDTV = new VideoStationDTV(this));
            // Add Surveillance Station API
            this.ss = (this.surveillanceStation = new SurveillanceStation(this));
        }

        loadDefinitions() {
            if (this.definitions) { return this.definitions; }
            const majorVersion = `${this.apiVersion.charAt(0)}.x`;
            this.definitions = definitions[majorVersion];
            return this.definitions;
        }

        createFunctionsFor(object, apis) {
            const definitions = this.loadDefinitions();
            return (() => {
                const result = [];
                for (var api of Array.from(apis)) {
                    var apiKeys = filter(keys(definitions), key => startsWith(key, api));
                    result.push((() => {
                        const result1 = [];
                        for (api of Array.from(apiKeys)) {
                            if (definitions[api].methods) {
                                var lastApiVersionMethods = definitions[api].methods[last(keys(definitions[api].methods))];
                                if (!some(lastApiVersionMethods, m => typeof(m) === 'string')) {
                                    lastApiVersionMethods = flatten(values(mapValues(lastApiVersionMethods, m => keys(m))));
                                }
                                result1.push((() => {
                                    const result2 = [];
                                    for (let method of Array.from(lastApiVersionMethods)) {
                                        if (typeof(method) === 'object') { method = first(keys(method)); }
                                        const functionName = Utils.createFunctionName(api, method);
                                        path = 'path' in definitions[api] ? definitions[api].path : 'entry.cgi';
                                        const version = 'maxVersion' in definitions[api] ? definitions[api].maxVersion : 1;
                                        const apiInfos = cloneDeep({
                                            api,
                                            version,
                                            path,
                                            method,
                                        });

                                        result2.push(object[functionName] = function(params) {
                                            return this.requestAPI({
                                                params,
                                                apiInfos: {
                                                    sessionName: this.sessionName,
                                                    ...apiInfos,
                                                },
                                            });
                                        }.bind(object));
                                    }
                                    return result2;
                                })());
                            } else {
                                result1.push(undefined);
                            }
                        }
                        return result1;
                    })());
                }
                return result;
            })();
        }
    };
    Syno.initClass();
    return Syno;
})();
