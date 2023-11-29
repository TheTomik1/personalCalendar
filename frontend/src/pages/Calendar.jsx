import React, { useEffect, useState } from 'react';
import {format, addMonths, subMonths, addDays, eachMonthOfInterval, getDaysInMonth} from 'date-fns';
import axios from 'axios';

import { FaCalendarPlus } from "react-icons/fa6";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";

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

    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState(null);
    const [eventsData, setEventData] = useState(null);
    const [viewType, setViewType] = useState("month");
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

    const next = () => {
        if (viewType === 'day') {
            setCurrentDate(addDays(currentDate, 1));
        }
        if (viewType === 'week') {
            setCurrentDate(addDays(currentDate, 7));
        }
        else if (viewType === 'month') {
            setCurrentDate(addMonths(currentDate, 1));
        }
        else if (viewType === 'year') {
            setCurrentDate(addMonths(currentDate, 12));
        }
    }

    const prev = () => {
        if (viewType === 'day') {
            setCurrentDate(addDays(currentDate, -1));
        }
        else if (viewType === 'week') {
            setCurrentDate(addDays(currentDate, -7));
        }
        else if (viewType === 'month') {
            setCurrentDate(subMonths(currentDate, 1));
        }
        else if (viewType === 'year') {
            setCurrentDate(subMonths(currentDate, 12));
        }
    };

    const getWeekTitle = (date) => {
    };

    const changeView = (type) => {
        setViewType(type);
    };

    const DailyCalendar = () => {
        return (
            <div className="text-white font-bold text-xl">
                {Array.from({ length: 24 }).map((_, index) => {
                    const hour = index.toString().padStart(2, '0') + ":00";

                    return (
                        <div key={index} className={"m-6"}>
                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-gray-400"></div>
                                <span className="flex-shrink mx-4 text-gray-400">{hour}</span>
                                <div className="flex-grow border-t border-gray-400"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="text-center bg-zinc-900">
            <div className="flex justify-center items-center min-h-screen">
                <div className="container mx-auto">
                    <div className={"flex justify-start space-x-4"}>
                        <a className="flex items-center bg-green-500 hover:bg-green-600 w-32 text-white font-bold py-2 px-4 justify-center rounded mt-5 mb-12 cursor-pointer">
                            New <FaCalendarPlus className={"ml-1"}/>
                        </a>
                        <select className="w-32 py-2 px-4 justify-center rounded mt-5 mb-12 border border-gray-300 focus:outline-none focus:border-none" value={viewType} onChange={(e) => changeView(e.target.value)}>
                            <option value="day">Day</option>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                        </select>
                    </div>
                    <div className="flex mb-12">
                        <button className="text-2xl font-bold text-white hover:text-gray-300 cursor-pointer" onClick={prev}><FaAngleLeft /></button>
                        <button className="text-2xl font-bold text-white hover:text-gray-300 cursor-pointer" onClick={next}><FaAngleRight /></button>
                        <h2 className="text-3xl font-bold text-white pl-12">
                            {
                                format(currentDate, viewType === 'month' ? 'MMMM yyyy' : viewType === 'week' ? getWeekTitle(currentDate) : viewType === 'day' ? 'MMMM dd, yyyy' : 'yyyy')
                            }
                        </h2>
                    </div>
                    {
                        viewType === "day" && (
                            DailyCalendar()
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Calendar;
