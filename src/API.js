/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Require lodash functions
const {extend, defaults, isEmpty, mapValues} = require('lodash');

// Class API
module.exports = (function() {
    let noop = undefined;
    API = class API {
        static initClass() {
    
            // Privat noop class
            noop = function() {};
        }

        // Constructor for the API class
        // `syno` [Syno] The syno instance linked to the API instance
        constructor(syno){
            this.syno = syno;
        }

        // Request to the syno and process generic response
        // `options`         [Object]
        // `options.api`     [String] API name
        // `options.version` [String] API version
        // `options.path`    [String] API path
        // `options.method`  [String] API method
        // `options.params`  [Object] API parameters
        request(options, done){
            // Get protocol, host and port variables from syno instance
            if (options == null) { options = {}; }
            if (done == null) { done = noop; }
            const {protocol, host, port} = this.syno;
            // Get api, version, path, method, params variables from options
            const {api, version, path, method, params} = options;

            // Create url from protocol, host, port and path
            const url = `${protocol}://${host}:${port}/webapi/${path}`;
            // Create querystring from api, verison and method
            const qs = defaults({api, version, method}, params);

            // Launch syno request with url and querystring
            return this.syno.request({url, qs}, (error, response, body)=> {
                // Call done callback with error if there is an error
                if (error) { return done(error); }
                // Call done callback with statusCode error if there is an error with the response
                if (response.statusCode !== 200) {
                    error = new Error(`HTTP status code: ${response.statusCode}`);
                    error.response = response;
                    return done(error);
                }
                // Call done callback with error if there is an error server side
                if (!body.success ||
                (body.success && body.data && body.data instanceof Array && body.data[0] && body.data[0].error)) {
                    const code = body.error ? body.error.code : body.data[0].error;
                    error = new Error(this.error(code, api));
                    error.code = code;
                    if (body.error && body.error.errors) { error.errors = body.error.errors; }
                    return done(error);
                }
                // Call done callback with no error and the data property of the response
                return done(null, body.data);
            });
        }

        // Request API using `args` parameter
        // `args.params`             [Object] Request Parameters
        // `args.done`               [Function] Done callback
        // `args.apiInfos`           [Object]
        // `args.apiInfos.api`       [String] API name
        // `args.apiInfos.version`   [String] API version
        // `args.apiInfos.path`      [String] API path
        // `args.apiInfos.method`    [String] API method
        // `args.requiredParams`     [String[]] List of required parameters for the API
        requestAPI(args){
            let {apiInfos, requiredParams, params, done} = args;

            // Process optional parameters and done callback
            ({params, done} = Utils.optionalParamsAndDone({params, done}));
            // Force params to be string if they can be converted to strings (boolean, numbers...)
            params = mapValues(params, param => param && param.toString());
            // Create request options based on parameters and api infos
            const opts = extend({}, apiInfos, {params});
            // Call request with options and done callback
            return this.request(opts, done);
        }

        // Handle API errors
        error(code){
            switch (code) {
                case 101: return 'No parameter of API, method or version';
                case 102: return 'The requested API does not exist';
                case 103: return 'The requested method does not exist';
                case 104: return 'The requested version does not support the functionality';
                case 105: return 'The logged in session does not have permission';
                case 106: return 'Session timeout';
                case 107: return 'Session interrupted by duplicate login';
                default: return 'Unknown error';
            }
        }
    };
    API.initClass();
    return API;
})();