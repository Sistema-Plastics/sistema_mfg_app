msg.startTstamp = msg.payload;
msg.transferfile = false;

const d = new Date();
const dy = d.getFullYear().toString();
const dm = d.getMonth().toString().length == 1 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
const dd = d.getDate().toString().length == 1 ? '0' + (d.getDate()) : d.getDate()

const logDate = dy + dm + dd;

msg.details = {};
msg.details.dir = {};
msg.retain = true;

//FTP SERVER
// FTP SERVER

msg.details.sftp = {
    hostname: 'ftp.newellrubbermaid.com',
    username: 'xf00347',
    password: 'Bl@cKH*t6F0rU'
};

switch (msg.environment.toUpperCase()) {
    case 'LIVE':
        msg.details.dir.sftp = global.get("epicorsftp");

        switch (msg.company.toUpperCase()) {
            case 'SUNBM':
                msg.localfilepath = msg.details.dir.sftp + 'Sunbeam/Outbound/';
                msg.localbackupfilepath = msg.details.dir.sftp + 'Sunbeam/Outbound/Backup/';
                msg.remotefilepath = '/inbound/';
                msg.details.sftp.username = 'xf00348';
                msg.details.sftp.password = 'Ten%IS#29B@L!';
                msg.transferfile = true;
                break;
            default:
                break;
        }
        break;
    case 'KINETIC':
        msg.details.dir.sftp = global.get("epicorkineticsftp");

        switch (msg.company.toUpperCase()) {
            case 'SUNBM':
                msg.localfilepath = msg.details.dir.sftp + 'Sunbeam/Outbound/';
                msg.localbackupfilepath = msg.details.dir.sftp + 'Sunbeam/Outbound/Backup/';
                msg.remotefilepath = '/inbound/';
                msg.transferfile = true;
                break;
            default:
                break;
        }
        break;
    case 'TEST':
        msg.details.dir.sftp = global.get("epicortestsftp");

        switch (msg.company.toUpperCase()) {
            case 'SUNBM':
                msg.localfilepath = msg.details.dir.sftp + 'Sunbeam/Outbound/';
                msg.localbackupfilepath = msg.details.dir.sftp + 'Sunbeam/Outbound/Backup/';
                msg.remotefilepath = '/inbound/';
                msg.transferfile = true;
                break;
            default:
                break;
        }
        break;
    default:
        break;
}

if (msg.transferfile) {

    msg.logfilename = msg.localfilepath + '_logs/nodered.log_' + logDate + '.txt';
    msg.rate = 500;
    return msg;
}