const UAParser = require('ua-parser-js');

function detectMobileDevice(socket) {
    
    const parser = new UAParser();
    const userAgent = socket.handshake.headers['user-agent'];  
    const deviceInfo = parser.setUA(userAgent).getResult();

    if(deviceInfo.os.name == 'Windows'){
        return false
    }
    return true;

}

module.exports = detectMobileDevice;