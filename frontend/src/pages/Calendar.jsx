import React, {useEffect, useState} from 'react';
import { addDays, addMonths, eachDayOfInterval, eachWeekOfInterval, endOfMonth, endOfWeek, format, getDay, getDaysInMonth, isSameMonth, isToday, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import axios from 'axios';

import { FaCalendarPlus } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import DayInfoModal from "../components/DayInfoModal";
import MonthlyCalendar from "../components/MonthlyCalendar";
import AddNewEventModal from '../components/AddNewEventModal';
import YearlyCalendar from "../components/YearlyCalendar";

const Calendar = () => {
    /*
        TODO: Add option for adding new event(s).
        TODO: Events in the calendar can have custom colors.
        TODO: Add option to edit event(s). (backend too)
        TODO: Add option to delete event(s). (backend too)
     */

    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState(null);
    const [eventsData, setEventData] = useState(null);
    const [viewType, setViewType] = useState("month");
    const [dayInfo, setDayInfo] = useState({});
    const [newEventModal, setNewEventModal] = useState({});
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

    const handleWheel = (e) => {
        const isMouseOverTable = e.currentTarget === e.target;

        if (!isMouseOverTable) {
            e.preventDefault();
            if (e.deltaY > 0) {
                prev();
            } else {
                next();
            }
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

    return (
        <div className="text-center bg-zinc-900">
            <div className="flex justify-center items-center min-h-screen">
                <div className="container mx-auto">
                    <div className={"flex justify-start space-x-4"}>
                        <button className="flex items-center bg-green-500 hover:bg-green-600 w-32 text-white font-bold py-2 px-4 justify-center rounded mt-5 mb-12 cursor-pointer" onClick={() => setNewEventModal(true)}>
                            New <FaCalendarPlus className={"ml-1"}/>
                        </button>
                        <select className="w-32 py-2 px-4 justify-center rounded mt-5 mb-12 border border-gray-700 bg-zinc-300 focus:outline-none focus:border-none" value={viewType} onChange={(e) => changeView(e.target.value)}>
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
                            <MonthlyCalendar date={currentDate} eventsData={eventsData} />
                        )
                    }
                    {
                        viewType === "year" && (
                            <YearlyCalendar date={currentDate} eventsData={eventsData} />
                        )
                    }
                    {
                        newEventModal === true && (
                            <AddNewEventModal onClose={() => setNewEventModal(false)} />
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Calendar;
