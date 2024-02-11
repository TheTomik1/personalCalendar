process.env["DEBUG"] = "backend:ntfy";

const schedule = require('node-schedule');
const debug = require('debug')('backend:ntfy');
const { format } = require('date-fns');

const openDatabase = require("../../openDatabaseConnection");

debug('Notification job started.');
schedule.scheduleJob('* * * * *', async() => {
    const db = await openDatabase();

    const currentDate = format(new Date(), 'yyyy-MM-dd');

    await db.all('SELECT * FROM calendarEvents WHERE datetimeEnd < ?', [currentDate], (err, rows) => {
        if (err) {
            debug('Error fetching events:', err);
        } else {
            rows.forEach(row => {
                debug('Event:', row);
            });
        }
    });
});