const schedule = require('node-schedule');
const debug = require('debug')('calendar-api:oldEventDelete');
const { format } = require("date-fns");

const openDatabase = require("../../openDatabaseConnection");

debug('Old event delete system has started.');

/**
 * @description Delete old events from the database every day at midnight.
 */
schedule.scheduleJob('0 0 * * *', async() => {
    const db = await openDatabase();

    const currentDatetime = format(new Date(), 'yyyy-MM-dd HH:mm');

    try {
        await db.run('DELETE FROM calendarEvents WHERE datetimeEnd < ?', [currentDatetime]);
        debug('Old events deleted successfully.');
    } catch (error) {
        debug('Error deleting old events:', error);
    }
});