import React, { useEffect, useState } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays } from 'date-fns';
import axios from 'axios';

const Calendar = () => {
    /*
        TODO: If the user has one calendar, show the name of the calendar.
        TODO: If the user has more than one calendar, show the name of the calendar and add option to change the calendar.
        TODO: Add option for adding new event(s).
        TODO: Events in the calendar should be clickable and show the event details.
        TODO: Events in the calendar can have custom colors.
        TODO: Improve responsiveness of the calendar if there are a lot of events for the day, show only the first 2 events and add option to show more. (This might be needed to overhaul completely)
        TODO: Refresh the calendar when changing the month.
        TODO: Do not let user go to this component if he is not logged in.
        TODO: Hover effect for all the days in the calendar.
        TODO: Events must not overlap to other days. (backend)
        TODO: Add option to edit event(s). (backend too)
        TODO: Add option to delete event(s). (backend too)
     */

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [calendars, setCalendars] = useState([]);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [eventsData, setEventData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchCalendar = await axios.get("http://localhost:8080/api/get-calendars", { withCredentials: true });

                if (fetchCalendar.status === 200) {
                    setCalendars(fetchCalendar.data.calendars);
                } else {
                    setError("Calendar not found.");
                }
            } catch (error) {
                if (error.response?.data.message === "Unauthorized.") {
                    setError(error.response.data.message);
                }
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchEvents = await axios.get("http://localhost:8080/api/get-events", { withCredentials: true });

                if (fetchEvents.status === 200) {
                    setEventData(fetchEvents.data.events);
                } else {
                    setError("Events not found.");
                }
            } catch (error) {
                if (error.response?.data?.message === "Unauthorized.") {
                    setError(error.response.data.message);
                }
            }
        }

        fetchData();
    }, []);

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const getDaysAndEvents = (date) => {
        const daysInMonth = [];
        const startOfMonth = startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1), { weekStartsOn: 1 });
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        for (let i = startOfMonth; i <= endOfMonth; i = addDays(i, 1)) {
            const day = new Date(i);

            const eventsForDay = eventsData ? eventsData.filter(event => {
                const eventDate = new Date(event.datetimeStart);
                return eventDate.getDate() === day.getDate() && eventDate.getMonth() === day.getMonth() && eventDate.getFullYear() === day.getFullYear() && event.calendarId === selectedCalendar.id;
            }) : [];

            daysInMonth.push({ date: day, events: eventsForDay });
        }

        return daysInMonth;
    };

    return (
        <div className="text-center bg-gradient-to-b from-zinc-900 to-zinc-700">
            <div className="flex justify-center items-center min-h-screen">
                <div className="container mx-auto ">
                    {calendars.length > 1 && !selectedCalendar ? (
                        <>
                            <div className="flex justify-start">
                                <a className="bg-green-500 hover:bg-green-600 w-64 text-white font-bold py-2 px-4 rounded inline-block mt-5 mb-12 cursor-pointer">Create new calendar</a>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                                {calendars.map((calendar, index) => (
                                    <div key={index} className="bg-gradient-to-b from-zinc-700 to-zinc-800 p-4 rounded-lg shadow-lg">
                                        <img
                                            src={"https://assets-global.website-files.com/62196607bf1b46c300301846/62604576fc20f55acea94bac_Google%20Calendar%20Productivity%20Hacks.png"}
                                            alt={"Calendar"}
                                            className={"w-full h-auto rounded-lg shadow-lg"}
                                        />
                                        <h2 className="text-4xl font-cubano text-emerald-600 mt-4 mb-12">{calendar.guid}</h2>
                                        <div className={"flex justify-center space-x-4"}>
                                            <a className={"p-2 text-white text-2xl bg-blue-500 rounded hover:bg-blue-600 cursor-pointer"} onClick={() => setSelectedCalendar(calendar)}>View</a>
                                            <a className={"p-2 text-white text-2xl bg-red-500 rounded hover:bg-red-600 cursor-pointer"}>Delete</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={"flex justify-start space-x-4"}>
                                <a className="bg-green-500 hover:bg-green-600 w-64 text-white font-bold py-2 px-4 rounded inline-block mt-5 mb-12 cursor-pointer">Add new event</a>
                                {calendars.length > 1 ? (
                                    <a className="bg-blue-500 hover:bg-blue-600 w-64 text-white font-bold py-2 px-4 rounded inline-block mt-5 mb-12 cursor-pointer" onClick={() => setSelectedCalendar(null)}>My other calendars</a>
                                ) : (
                                    <a className="bg-blue-500 hover:bg-blue-600 w-64 text-white font-bold py-2 px-4 rounded inline-block mt-5 mb-12 cursor-pointer">Create new calendar</a>
                                )}
                            </div>

                            <div className="flex justify-between items-center mb-12">
                                <button className="text-blue-500 font-bold p-2 rounded-xl bg-gray-200 focus:outline-none" onClick={prevMonth}>Prev Month</button>
                                <h2 className="text-5xl font-bold text-white">{format(currentMonth, 'MMMM yyyy')}</h2>
                                <button className="text-blue-500 font-bold p-2 rounded-xl bg-gray-200 focus:outline-none" onClick={nextMonth}>Next Month</button>
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => (
                                    <div key={index} className="p-2 text-center text-white font-bold">{dayName}</div>
                                ))}
                                {getDaysAndEvents(currentMonth).map(({ date, events }) => (
                                    <div key={date.toISOString()} className={`p-2 text-center m-12 ${date.getMonth() !== currentMonth.getMonth() ? 'text-gray-500' : 'text-white'}`}>
                                        <div>{format(date, 'd')}</div>
                                        <div>
                                            {events && events.map((event, index) => (
                                                <div key={index} className="text-sm mt-1 text-white bg-green-500 p-1 rounded">
                                                    {event.name} - {format(new Date(event.datetimeStart), 'HH:mm')}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <a className="bg-red-500 hover:bg-red-600 w-64 text-white font-bold py-2 px-4 rounded inline-block mt-5 mb-12 cursor-pointer">Delete this calendar!</a>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
