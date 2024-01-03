process.env["DEBUG"] = "backend:oldEventDelete";

const schedule = require('node-schedule');
const debug = require('debug')('backend:oldEventDelete');

const openDatabase = require("../../openDatabaseConnection");

debug('Old event delete job started.');
schedule.scheduleJob('0 0 * * *', async() => {
    const db = await openDatabase();

    const currentDate = new Date().toISOString().split('T')[0];

    await db.run('DELETE FROM calendarEvents WHERE datetimeEnd < ?', [currentDate], (err) => {
        if (err) {
            debug('Error deleting old events:', err);
        } else {
            debug('Old events deleted successfully.');
        }
    });
});