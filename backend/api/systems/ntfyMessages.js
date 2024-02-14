const schedule = require('node-schedule');
const debug = require('debug')('calendar-api:ntfy');
const { format, differenceInMinutes } = require('date-fns');
const axios = require('axios');

const openDatabase = require("../../openDatabaseConnection");

const reminderOptionsInMinutes = {
    '5m': 5,
    '10m': 10,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '1d': 1440
};

const humanReminderOptions = {
    '5m': '5 minutes',
    '10m': '10 minutes',
    '15m': '15 minutes',
    '30m': '30 minutes',
    '1h': '1 hour',
    '1d': '1 day'
}

/**
 * @param eventId - The ID of the event to update the reminderSent column for.
 * @description Updates the reminderSent column in the database to 1 for the event with the given ID.
 */
const updateReminderSent = async (eventId) => {
    const db = await openDatabase();

    await db.run('UPDATE calendarEvents SET reminderSent = 1 WHERE id = ?', [eventId]);
}

/**
 * @param eventId - The ID of the event to fetch the details for.
 * @description Fetches the details of the event with the given ID from the database.
 */
const fetchEventDetails = async (eventId) => {
    const db = await openDatabase();

    return await db.get('SELECT eventType, title, description, location, reminderOption, datetimeStart, datetimeEnd FROM calendarEvents WHERE id = ?', [eventId]);
}

/**
 * @param eventId - The ID of the event to send a ntfy message for.
 * @description Sends a ntfy message for the event with the given ID.
 */
const sendNtfyMessage = async (eventId) => {
    const db = await openDatabase();

    const ntfyTopic = await db.get(`
        SELECT topic FROM ntfyTopics
        JOIN main.users u on u.id = ntfyTopics.userId
        JOIN calendars c on c.userId = u.id
        JOIN calendarEvents ce on ce.calendarId = c.id
        WHERE ce.id = ?
    `, [eventId]);

    if (ntfyTopic === undefined) {
        debug('\x1b[31m', `User with event ID ${eventId} doesn't have ntfy topic associated with their account.`);
        return;
    }

    const eventDetails = await fetchEventDetails(eventId);


    const message = `
           ⏰ Starts at: ${format(eventDetails.datetimeStart, "HH:mm:ss dd.MM.yyyy ")}
⏳ Ends at: ${format(eventDetails.datetimeEnd, "HH:mm:ss dd.MM.yyyy ")}
        
🎯 Type: ${eventDetails.eventType}
📝 Title: ${eventDetails.title}
📄 Description: ${eventDetails.description}
📍 Location: ${eventDetails.location}
    `;  // A bit of a weird way to format the message, but it is the only way to get the message to look good on phone notifications.

    await axios.post(`${process.env.NTFY_BASE_URL}/${ntfyTopic.topic}`,
        message
    ,{
        headers: {
            'Title': `Personal Calendar - You have an upcoming event in ${humanReminderOptions[eventDetails.reminderOption]}!`,
            'Priority': 'urgent',
            'Tags': 'warning'
        },
    });
}

debug('Notification system has started.');

/**
 * @description Check for upcoming events every second and send a ntfy message when the time is right.
 */
schedule.scheduleJob('* * * * * *', async () => {
    const db = await openDatabase();

    const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    const events = await db.all('SELECT * FROM calendarEvents WHERE datetimeStart >= ?', [currentDate]);

    for (const event of events) {
        if (event.reminderSent === 1) {
            continue;
        }

        const eventStartDate = format(new Date(event.datetimeStart), 'yyyy-MM-dd HH:mm:ss');

        const minuteDifference = reminderOptionsInMinutes[event.reminderOption];
        const timeDifference = (differenceInMinutes(currentDate, eventStartDate) * -1) + 1;  // * -1 to get positive number

        if (minuteDifference !== undefined && minuteDifference === timeDifference) {
            debug(`Sending a ntfy reminder message for event with ID ${event.id}.`);
            await sendNtfyMessage(event.id);
            await updateReminderSent(event.id);
        }
    }
});
