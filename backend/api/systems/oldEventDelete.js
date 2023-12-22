const schedule = require('node-schedule');

const openDatabase = require("../../openDatabaseConnection");

schedule.scheduleJob('0 0 * * *', async() => {
    const db = await openDatabase();

    const currentDate = new Date().toISOString().split('T')[0];

    db.run('DELETE FROM calendarEvents WHERE datetimeEnd < ?', [currentDate], (err) => {
        if (err) {
            console.error('Error deleting old events:', err);
        } else {
            console.log('Old events deleted successfully.');
        }
    });
});