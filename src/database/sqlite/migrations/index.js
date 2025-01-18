const database = require('../index');
const createUsers = require('./createUsers');

async function migrationsRun() {
    const schemas = [
        createUsers
    ].join(' ');

    database().then(db => db.exec(schemas))
}

module.exports = migrationsRun;