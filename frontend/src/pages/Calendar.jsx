import React, {useEffect, useState} from 'react';
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import axios from 'axios';

import { FaCalendarPlus } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import WeeklyCalendar from "../components/WeeklyCalendar";
import MonthlyCalendar from "../components/MonthlyCalendar";
import AddNewEventModal from '../components/AddOrEditModal';
import YearlyCalendar from "../components/YearlyCalendar";

const Calendar = () => {
    /*
        TODO: Finish the weekly calendar.
        TODO: Scrolling up and down will scroll between weeks/months/years depending on the view.
        TODO: Whenever the component is mounted, fetch the calendar and events data from the backend.
        TODO: Whenever the component is refreshed, it will remember the view permanently (maybe use cookies).
     */

    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState(null);
    const [eventsData, setEventData] = useState(null);
    const [viewType, setViewType] = useState("week");
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
        if (viewType === 'week') {
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
                        viewType === "week" && (
                            <WeeklyCalendar date={currentDate} eventsData={eventsData} />
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
