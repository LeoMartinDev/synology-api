/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const AuthenticatedAPI = require('./AuthenticatedAPI');

module.exports = class FileStation extends AuthenticatedAPI {

    constructor(syno){
        super(syno);
        this.syno = syno;
        this.sessionName = 'FileStation';
        this.syno.createFunctionsFor(this, ['SYNO.FileStation']);
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

    // Handle FileStation API errors
    error(code, api){
        // Favorite API specific errors
        if (api === 'SYNO.FileStation.Favorite') {
            switch (code) {
                case 800: return 'A folder path of favorite folder is already added to user\'s favorites.'; break;
                case 801:
                    return 'A name of favorite folder conflicts with an existing folder path in the user\'s favorites.';
                    break;
                case 802: return 'There are too many favorites to be added.'; break;
            }
        }
        // Upload API specific errors
        if (api === 'SYNO.FileStation.Upload') {
            switch (code) {
                case 1800:
                    return `There is no Content-Length information in the HTTP header or the received size doesn\'t \
match the value of Content-Length information in the HTTP header.`;
                    break;
                case 1801:
                    return `Wait too long, no date can be received from client (Default maximum wait time is 3600 \
seconds).`;
                    break;
                case 1802: return 'No filename information in the last part of file content.'; break;
                case 1803: return 'Upload connection is cancelled.'; break;
                case 1804: return 'Failed to upload too big file to FAT file system.'; break;
                case 1805: return 'Can\'t overwrite or skip the existed file, if no overwrite parameter is given.'; break;
            }
        }
        // Sharing API specfic errors
        if (api === 'SYNO.FileStation.Sharing') {
            switch (code) {
                case 2000: return 'Sharing link does not exist.'; break;
                case 2001: return 'Cannot generate sharing link because too many sharing links exist.'; break;
                case 2002: return 'Failed to access sharing links.'; break;
            }
        }
        // CreateFolder API specific errors
        if (api === 'SYNO.FileStation.CreateFolder') {
            switch (code) {
                case 1100:  return 'Failed to create a folder. More information in <errors> object.'; break;
                case 1101:  return 'The number of folders to the parent folder would exceed the system limitation.'; break;
            }
        }
        // Rename API specific errors
        if (api === 'SYNO.FileStation.Rename') {
            switch (code) {
                case 1200: return 'Failed to rename it. More information in <errors> object.'; break;
            }
        }
        // CopyMove API specific errors
        if (api === 'SYNO.FileStation.CopyMove') {
            switch (code) {
                case 1000: return 'Failed to copy files/folders. More information in <errors> object.'; break;
                case 1001: return 'Failed to move files/folders. More information in <errors> object.'; break;
                case 1002: return 'An error occurred at the destination. More information in <errors> object.'; break;
                case 1003:
                    return 'Cannot overwrite or skip the existing file because no overwrite parameter is given.';
                    break;
                case 1004:
                    return `File cannot overwrite a folder with the same name, or folder cannot overwrite a file with \
the same name.`;
                    break;
                case 1006: return 'Cannot copy/move file/folder with special characters to a FAT32 file system.'; break;
                case 1007: return 'Cannot copy/move a file bigger than 4G to a FAT32 file system.'; break;
            }
        }
        // Delete API specific errors
        if (api === 'SYNO.FileStation.Delete') {
            switch (code) {
                case 900: return 'Failed to delete file(s)/folder(s). More information in <errors> object.'; break;
            }
        }
        // Extract APi specific errors
        if (api === 'SYNO.FileStation.Extract') {
            switch (code) {
                case 1400: return 'Failed to extract files.'; break;
                case 1401: return 'Cannot open the file as archive.'; break;
                case 1402: return 'Failed to read archive data error'; break;
                case 1403: return 'Wrong password.'; break;
                case 1404: return 'Failed to get the file and dir list in an archive.'; break;
                case 1405: return 'Failed to find the item ID in an archive file.'; break;
            }
        }
        // Compress API specific errors
        if (api === 'SYNO.FileStation.Compress') {
            switch (code) {
                case 1300: return 'Failed to compress files/folders.'; break;
                case 1301: return 'Cannot create the archive because the given archive name is too long.'; break;
            }
        }
        // FileStation specific errors
        switch (code) {
            case 400: return 'Invalid parameter of file operation'; break;
            case 401: return 'Unknown error of file operation'; break;
            case 402: return 'System is too busy'; break;
            case 403: return 'Invalid user does this file operation'; break;
            case 404: return 'Invalid group does this file operation'; break;
            case 405: return 'Invalid user and group does this file operation'; break;
            case 406: return 'Can\'t get user/group information from the account server'; break;
            case 407: return 'Operation not permitted'; break;
            case 408: return 'No such file or directory'; break;
            case 409: return 'Non-supported file system'; break;
            case 410: return 'Failed to connect internet-based file system (ex: CIFS)'; break;
            case 411: return 'Read-only file system'; break;
            case 412: return 'Filename too long in the non-encrypted file system'; break;
            case 413: return 'Filename too long in the encrypted file system'; break;
            case 414: return 'File already exists'; break;
            case 415: return 'Disk quota exceeded'; break;
            case 416: return 'No space left on device'; break;
            case 417: return 'Input/output error'; break;
            case 418: return 'Illegal name or path'; break;
            case 419: return 'Illegal file name'; break;
            case 420: return 'Illegal file name on FAT file system'; break;
            case 421: return 'Device or resource busy'; break;
            case 599: return 'No such task of the file operation'; break;
        }
        // No specific error found, so call super function
        return super.error(...arguments);
    }
}