const schedule = require('node-schedule');
const debug = require('debug')('calendar-api:ntfy');
const { format, differenceInMinutes } = require('date-fns');

const openDatabase = require("../../openDatabaseConnection");

debug('Notification system started.');
schedule.scheduleJob('* * * * * *', async () => {
    const db = await openDatabase();

    const currentDate = new Date().toString();
    const formattedCurrentDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss');

    const events = await db.all('SELECT * FROM calendarEvents WHERE datetimeStart >= ?', [formattedCurrentDate]);

    events.forEach(event => {
        const timeDiff = Math.abs(differenceInMinutes(currentDate, new Date(event.datetimeStart).toString()) + 1);

        console.log(timeDiff);


        if (event.reminderOption === '5m' && timeDiff === 5) {
            debug(`Sending reminder for event ${event.id}`);
        } else if (event.reminderOption === '10m' && timeDiff === 10) {
            debug(`Sending reminder for event ${event.id}`);
        } else if (event.reminderOption === '15m' && timeDiff === 15) {
            debug(`Sending reminder for event ${event.id}`);
        } else if (event.reminderOption === '30m' && timeDiff === 30) {
            debug(`Sending reminder for event ${event.id}`);
        } else if (event.reminderOption === '1h' && timeDiff === 60) {
            debug(`Sending reminder for event ${event.id}`);
        } else if (event.reminderOption === '1d' && timeDiff === 1440) {
            debug(`Sending reminder for event ${event.id}`);
        }
    });
});
