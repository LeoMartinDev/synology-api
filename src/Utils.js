/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {isFunction, isPlainObject, each, filter, camelCase, startsWith, endsWith, last} = require('lodash');
const pluralize = require('pluralize');

module.exports = class Utils {

    // Camelize a string
    // `str` [String]
    // Input: str = "get_something"
    // Output: str = "getSomething"
    static underscoreToCamelize(str) {
        str = str.replace(/(\_[a-z])/g, $1 => $1.toUpperCase().replace('_', ''));
        return str.substring(0, 1).toLowerCase() + str.slice(1);
    }

    // Trim method name
    // Input: str = "SYNO.Backup.Storage.AmazonCloudDrive"
    // Output: str = "BackupStorageAmazonCloudDrive"
    // `str` [String]
    static trimSyno(str) {
        str = str.replace(/SYNO\./, '');
        return str.replace(/\./g, $1 => $1.replace('.', ''));
    }

    // Trim syno name
    // Input: str = "SYNO.Backup.Storage.AmazonCloudDrive"
    // Output: str = "Backup"
    // `str` [String]
    static trimSynoNamespace(str) {
        return str.split('.')[1];
    }

    // Fix CamelCase
    // Input: str = "getconfigchannel"
    // Output: str = "getConfigchannel"
    // `str` [String]
    // `replacement` [String]
    // `pattern` [String]
    static fixCamelCase(str) {
        const words = ['ack', 'add', 'apply', 'archive', 'arrange', 'audio', 'auth',
        'bat', 'break', 'cam', 'card', 'category', 'check', 'chk', 'clear',
        'close', 'compare', 'config', 'control', 'copy', 'count', 'create',
        'delete', 'del', 'disabled', 'disable', 'door', 'download', 'edit',
        'eject', 'enable', 'enabled', 'enum', 'event', 'export', 'force',
        'format', 'get', 'go', 'holder', 'imported', 'import', 'info', 'io',
        'keep', 'list', 'live', 'load', 'unlock', 'lock', 'log', 'mark', 'md',
        'migration', 'modify', 'module', 'monitor', 'motion', 'notify', 'ntp',
        'open', 'unpair', 'pair', 'play', 'poll', 'polling', 'query', 'quick',
        'record', 'rec', 'recount', 'redirect', 'remove', 'resync', 'retrieve', 'roi',
        'run', 'save', 'search', 'selected', 'select', 'send', 'server', 'set',
        'setting', 'share', 'snapshot', 'start', 'stop', 'stream', 'sync',
        'test', 'trigger', 'updated', 'update', 'upload',
        'verify', 'view', 'volume'];

        for (var idx = 0; idx < words.length; idx++) {
            const word = words[idx];
            str = str.replace(RegExp(`${word}.`, 'i'), function($1) {
                const match = $1.slice(0, -1).toLowerCase();
                if (!(words.slice(0, idx).some(el => el.indexOf(match) >= 0))) {
                    return $1.charAt(0).toUpperCase() +
                    $1.slice(1, -1) +
                    $1.charAt($1.length - 1).toUpperCase();
                } else {
                    return $1;
                }
            });
        }
        return str;
    }

    // Remove duplicated occurences
    // Input: str = "listFileStationSnapshot"
    // Output: str = "listSnapshot"
    // `str` [String]
    // `pattern` [String]
    static deletePattern(str, pattern) {
        const regex = new RegExp(pattern, 'i');
        return str = str.replace(regex, '');
    }

    // Pluralize apiSubNname if method is list
    // Input: str = "listSearch"
    // Output: str = "listSearches"
    // `str` [String]
    static listPluralize(method, apiSubNname) {
        if (startsWith(method.toLowerCase(), 'list') && !endsWith(apiSubNname, 's')) {
            apiSubNname = apiSubNname.replace(/([A-Z][^A-Z]+)$/, (_, last) => pluralize(last)); // pluralize if list
        }
        return apiSubNname;
    }
        
    static createFunctionName(apiName, method) {
        const nameSpace    = Utils.trimSynoNamespace(apiName);
        apiName      = Utils.trimSyno(apiName);
        apiName      = Utils.deletePattern(apiName, nameSpace);
        apiName      = Utils.deletePattern(apiName, method);
        method       = Utils.deletePattern(method, apiName);
        method       = Utils.fixCamelCase(method); // getinfo to getInfo
        apiName      = Utils.listPluralize(method, apiName); // if list -> apiName plural
        let functionName = `${method}${apiName}`;
        return functionName = camelCase(functionName);
    }
    
    // Processes optional parameters and done callback
    // `options`         [Object]
    // `options.params`  [Object]    Parameters object.
    // `options.done`    [Function]  Done callback.
    static optionalParamsAndDone(options){
        // Get params and done varaibles from options
        if (options == null) { options = {}; }
        const { params } = options;

        // If params is not a plain object, use an empty one
        if (!isPlainObject(params)) { options.params = {}; }

        // Return processed options
        return options;
    }
}
