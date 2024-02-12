import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet";
import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";

import WeeklyCalendar from "../components/WeeklyCalendar";
import MonthlyCalendar from "../components/MonthlyCalendar";
import AddEditEventModal from "../components/AddEditEventModal";
import YearlyCalendar from "../components/YearlyCalendar";

import { FaCalendarPlus } from "react-icons/fa6";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventsData, setEventData] = useState(null);
    const [newEventModal, setNewEventModal] = useState(null);

    const [cookies, setCookie] = useCookies(["viewType"]);
    const [viewType, setViewType] = useState(cookies.viewType || "month");

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchEvents = await axios.get("http://localhost:8080/api/get-events");

                if (fetchEvents.status === 200) {
                    setEventData(fetchEvents.data.events);
                } else {
                    toastr.error("Something went wrong while fetching events. Try again later.");
                    navigate("/");
                }
            } catch (error) {
                if (error.response?.data?.message === "Unauthorized.") {
                    toastr.error("Please login in order to access your calendar.");
                    navigate("/");
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
        setCookie("viewType", type, { path: "/" });
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
            <Helmet>
                <title>Personal Calendar | My Calendar</title>
            </Helmet>

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
                    {
                        newEventModal === true && (
                            <AddEditEventModal eventData={{}} onClose={() => setNewEventModal(false)} />  // Passing an empty object as eventData so the modal knows it is a new event.
                        )
                    }
                    <div className="flex">
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
                </div>
            </div>
        </div>
    );
};

export default Calendar;
