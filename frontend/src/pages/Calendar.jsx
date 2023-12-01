import React, {useEffect, useState} from 'react';
import {
    addDays,
    addMonths,
    eachDayOfInterval,
    eachWeekOfInterval,
    endOfMonth,
    endOfWeek,
    format, getDay, getDaysInMonth, isSameMonth, isToday,
    startOfMonth,
    startOfWeek,
    subMonths
} from 'date-fns';
import axios from 'axios';

import {FaCalendarPlus} from "react-icons/fa6";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";

const Calendar = () => {
    /*
        TODO: Add option for adding new event(s).
        TODO: Events in the calendar can have custom colors.
        TODO: Improve responsiveness of the calendar if there are a lot of events for the day, show only the first 2 events and add option to show more. (This might be needed to overhaul completely)
        TODO: Events must not overlap to other days. (backend)
        TODO: Add option to edit event(s). (backend too)
        TODO: Add option to delete event(s). (backend too)
     */

    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState(null);
    const [eventsData, setEventData] = useState(null);
    const [viewType, setViewType] = useState("month");
    const [dayInfo, setDayInfo] = useState({});
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

    const changeView = (type) => {
        setViewType(type);
    };

    const DailyCalendar = () => {
        const currentHour = new Date().getHours();

        return (
            <div className="text-white font-bold text-xl">
                {Array.from({ length: 24 }).map((_, index) => {
                    const hour = index.toString().padStart(2, '0') + ":00";
                    const isCurrentHour = index === currentHour;

                    return (
                        <div key={index} className={`m-6`}>
                            <div className="relative flex py-5 items-center">
                                <div className={`flex-grow border-t ${isCurrentHour ? 'border-blue-700' : 'border-gray-400'}`}></div>
                                <span className={`flex-shrink mx-4 text-gray-400 ${isCurrentHour ? 'text-blue-700' : ''}`}>{hour}</span>
                                <div className={`flex-grow border-t ${isCurrentHour ? 'border-blue-700' : 'border-gray-400'}`}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const WeeklyCalendar = () => {

    };

    const weekFormat = () => {
        const startOfWeekDate = startOfWeek(currentDate);
        const endOfWeekDate = endOfWeek(currentDate);
        const startOfMonthDate = startOfMonth(currentDate);
        const endOfMonthDate = endOfMonth(currentDate);

        if (startOfWeekDate < startOfMonthDate || endOfWeekDate > endOfMonthDate) {
            return `${format(startOfWeekDate, 'MMMM yyyy')} - ${format(endOfWeekDate, 'MMMM yyyy')}`;
        } else {
            return `${format(endOfWeekDate, 'MMMM yyyy')}`;
        }
    };

    const MonthlyCalendar = (date) => {
        const handleWheel = (e) => {
            const isMouseOverTable = e.currentTarget === e.target;

            if (!isMouseOverTable) {
                e.preventDefault();
                if (e.deltaY > 0) {
                    prev();
                } else {
                    next();
                }
            } else {
                e.preventDefault();
            }
        };

        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(monthStart);
        const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
        const daysInMonthByWeek = monthWeeks.map((weekStart) => {
            return eachDayOfInterval({
                start: startOfWeek(weekStart, { weekStartsOn: 1 }),
                end: addDays(weekStart, 6) }
            ).map((day) => ({
                date: day,
                isCurrentMonth: isSameMonth(day, monthStart),
                isToday: isToday(day)})
            );
        });

        return (
            <table className="table-fixed w-full">
                <thead>
                <tr className="text-white font-bold text-xl">
                    {daysInMonthByWeek[0].map((day) => (
                        <th key={day.date} className={`border p-8 border-gray-500`}>{format(day.date, 'EEEE')}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {daysInMonthByWeek.map((week, weekIndex) => (
                    <tr key={weekIndex}>
                        {week.map((day) => (
                            <td key={day.date} className="border p-12 border-gray-500">
                                <p className={`text-xl text-white ${!day.isCurrentMonth ? 'text-gray-700' : ''} ${day.isToday ? 'bg-blue-500 rounded-xl ml-10 mr-10' : ''}`}>{format(day.date, 'dd')}</p>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    const YearlyCalendar = (date) => {
        const year = date.getFullYear();
        const months = Array.from({ length: 12 }, (_, index) => index + 1);
        const today = new Date();

        const getFirstDayOfMonth = (year, month) => getDay(new Date(year, month - 1, 0));

        return (
            <div className="flex flex-wrap justify-center">
                {months.map((month) => {
                    const firstDayOfMonth = getFirstDayOfMonth(year, month);
                    const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));

                    return (
                        <>
                            <div key={month} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
                                <div className="p-4 rounded-lg">
                                    <h2 className="text-3xl text-white font-semibold mb-2">
                                        {format(startOfMonth(new Date(year, month - 1)), 'MMMM')}
                                    </h2>

                                    <div className="grid grid-cols-7 gap-2">
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                            <div key={day} className="text-sm font-semibold text-gray-200">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-2">
                                        {Array.from({ length: firstDayOfMonth }, (_, index) => {
                                            const prevMonth = addMonths(new Date(year, month - 1), 1);
                                            const prevMonthDays = getDaysInMonth(prevMonth);

                                            return (
                                                <div key={index} className="text-center text-gray-400 py-2 cursor-pointer">
                                                    {prevMonthDays - firstDayOfMonth + index + 1}
                                                </div>
                                            );
                                        })}
                                        {Array.from({ length: daysInMonth }, (_, index) => {
                                            const day = index + 1;
                                            const isToday = year === today.getFullYear() && month - 1 === today.getMonth() && day === today.getDate();

                                            const readableDay = format(new Date(year, month - 1, day), 'EEEE');
                                            const readableMonth = format(new Date(year, month - 1, day), 'MMMM');

                                            return (
                                                <div key={index + 7} className={`text-center text-white py-2 rounded-xl cursor-pointer ${isToday ? 'bg-blue-700' : 'hover:bg-gray-500'}`} onClick={() => setDayInfo({day, readableDay, readableMonth})}>
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            {dayInfo && (
                                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
                                    <div className="bg-zinc-400 rounded-xl p-4">
                                        <h1 className={"text-2xl mb-2"}>{dayInfo.readableDay}</h1>
                                        <h2 className="text-3xl font-medium mb-2">{dayInfo.day} {dayInfo.readableMonth}</h2>
                                        <p className={"text-lg font-normal"}>There are no events scheduled for this day.</p>
                                        <button className="text-white bg-red-600 px-4 py-2 rounded-lg mt-4 hover:bg-red-500 transition" onClick={() => setDayInfo(null)}>Close</button>
                                    </div>
                                </div>
                            )}
                        </>
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
                                viewType === 'month' ? format(currentDate, 'MMMM yyyy') :
                                viewType === 'week' ? weekFormat() :
                                viewType === 'day' ? format(currentDate, 'MMMM dd, yyyy') :
                                format(currentDate, 'yyyy')
                            }
                        </h2>
                    </div>
                    {
                        viewType === "day" && (
                            DailyCalendar()
                        )
                    }
                    {
                        viewType === "week" && (
                            WeeklyCalendar()
                        )
                    }
                    {
                        viewType === "month" && (
                            MonthlyCalendar(currentDate)
                        )
                    }
                    {
                        viewType === "year" && (
                            YearlyCalendar(currentDate)
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Calendar;
