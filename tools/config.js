module.exports = {
    'secret': 'erpasverysecretkeystringinnodejs#123',
    'secretAdmin': 'erpasverysecretkeystringinnodejs#123foradminbtwnotforanyuserspecial',
    'versionKey': false,
    'timeoutRedis': 60,
    // 'expiresSession': 7*86400, //1 minggu
    'expiresSession': '1d', //1 minggu
    'filePath': 'uploads/files',
    // 'dirname': '/home/mhandharbeni/Documents/PROJECT/API/new-poskopi-api/',

    // 'server': '66.96.229.251',
    'server': 'localhost',
    'server_port': 20605,


    //server
    'database': 'erpas-db',
    'user': 'postgres',
    'password': 'Dbi@2020',
    // 'host' : '192.168.100.254',
    'host' : '66.96.229.251',
    'port': 20301
};
