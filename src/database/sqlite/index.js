const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

async function database() {
    const db = await sqlite.open({
        filename: './src/database/db.db',
        driver: sqlite3.Database
    });

    return db;
}

module.exports = database;