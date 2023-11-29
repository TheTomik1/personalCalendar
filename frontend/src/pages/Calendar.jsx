import React, { useEffect, useState } from 'react';
import { format, addMonths, subMonths, startOfWeek, addDays } from 'date-fns';
import axios from 'axios';

import { FaCalendarPlus } from "react-icons/fa6";

const Calendar = () => {
    /*
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
    const [calendarData, setCalendarData] = useState(null);
    const [eventsData, setEventData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchCalendar = await axios.get("http://localhost:8080/api/get-calendar", { withCredentials: true });

                if (fetchCalendar.status === 200) {
                    setCalendarData(fetchCalendar.data.calendar);
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
                return eventDate.getDate() === day.getDate() && eventDate.getMonth() === day.getMonth() && eventDate.getFullYear() === day.getFullYear();
            }) : [];

            daysInMonth.push({ date: day, events: eventsForDay });
        }

        return daysInMonth;
    };

    return (
        <div className="text-center bg-gradient-to-b from-zinc-900 to-zinc-700">
            <div className="flex justify-center items-center min-h-screen">
                <div className="container mx-auto ">
                    <div className={"flex justify-start space-x-4"}>
                        <a className="flex items-center bg-green-500 hover:bg-green-600 w-32 text-white font-bold py-2 px-4 justify-center rounded mt-5 mb-12 cursor-pointer">
                            New <FaCalendarPlus className={"ml-1"}/>
                        </a>
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
                </div>
            </div>
        </div>
    );
};

export default Calendar;
