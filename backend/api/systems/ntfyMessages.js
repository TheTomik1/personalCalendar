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

/*
    * @param eventId - The ID of the event to send a reminder for.
    * @description Sends a reminder to the user for the event.
*/
const updateReminderSent = async (eventId) => {
    const db = await openDatabase();

    await db.run('UPDATE calendarEvents SET reminderSent = 1 WHERE id = ?', [eventId]);
}

/*
    * @param eventId - The ID of the event to fetch details for.
    * @description Fetches the details of the event from the database.
*/
const fetchEventDetails = async (eventId) => {
    const db = await openDatabase();

    return await db.get('SELECT eventType, title, description, location, datetimeStart, datetimeEnd FROM calendarEvents WHERE id = ?', [eventId]);
}

/*
    * @param eventId - The ID of the event to send a reminder for.
    * @description Sends a reminder to the user for the event through ntfy.
*/
const sendNtfyMessage = async (eventId) => {
    const db = await openDatabase();

    const ntfyTopic = await db.get(`
        SELECT topic FROM ntfyTopics
        JOIN main.users u on u.id = ntfyTopics.userId
        JOIN calendars c on c.ownerId = u.id
        JOIN calendarEvents ce on ce.calendarId = c.id
        WHERE ce.id = ?
    `, [eventId]);

    const eventDetails = await fetchEventDetails(eventId);

    const message = `
        Starts at: ${format(eventDetails.datetimeStart, "HH:mm:ss dd.MM.yyyy ")}
        Ends at: ${format(eventDetails.datetimeEnd, "HH:mm:ss dd.MM.yyyy ")}
    
        Type: ${eventDetails.eventType}
        Title: ${eventDetails.title}
        Description: ${eventDetails.description}
        Location: ${eventDetails.location}
    `;

    await axios.post(`${process.env.NTFY_BASE_URL}/${ntfyTopic.topic}`,
        message
    ,{
        headers: {
            'Title': "Personal Calendar - You have an upcoming event!",
        },
    });
}

debug('Notification system started.');
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
