const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname+"/db/sqlite/erpas.db";
let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if(err) throw err;
});
db.serialize(function(){
    let sql = `CREATE TABLE IF NOT EXISTS active_token(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token VARCHAR(200),
        id_user VARCHAR(64)
    );`;
    db.run(sql, (err) => {
        if(err) throw err;
    });
});    

module.exports = db;