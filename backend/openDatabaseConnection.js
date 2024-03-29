const {open} = require("sqlite");
const sqlite3 = require("sqlite3");

async function openDatabase() {
    return await open({
        filename: 'personalCalendar.db',
        driver: sqlite3.Database,
    });
}

module.exports = openDatabase;