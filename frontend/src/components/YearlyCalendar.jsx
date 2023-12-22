import { addMonths, format, getDay, isToday, getDaysInMonth, startOfMonth } from "date-fns";
import React, { useState } from "react";

import DayInfoModal from "./DayInfoModal";

const findDayEvents = (year, month, day, eventsData) => {
    return eventsData?.filter((event) => {
        const eventDate = new Date(event.datetimeStart);
        return eventDate.getFullYear() === year && eventDate.getMonth() + 1 === month && eventDate.getDate() === day;
    })
}

const YearlyCalendar = ({ date, eventsData }) => {
    const year = date.getFullYear();
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const today = new Date();

    const getFirstDayOfMonth = (year, month) => getDay(new Date(year, month - 1, 0));

    const [dayInfoModal, setDayInfoModal] = useState("");

    const handleDayClick = (day, month) => {
        const clickedDay = new Date(year, month - 1, day);
        const events = findDayEvents(year, month, day, eventsData);

        setDayInfoModal({
            day: clickedDay,
            isToday: isToday(clickedDay),
            events: events,
        });
    }

    return (
        <div className="flex flex-wrap justify-center">
            {months.map((month) => {
                const firstDayOfMonth = getFirstDayOfMonth(year, month);
                const daysInMonth = getDaysInMonth(new Date(year, month - 1, 1));

                return (
                    <div key={month} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
                        <div className="p-4 rounded-lg">
                            <h2 className="text-3xl text-white font-semibold mb-2">
                                {format(startOfMonth(new Date(year, month - 1)), 'MMMM')}
                            </h2>

                            <div className="grid grid-cols-7 gap-2">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                                    <div key={day} className={`text-sm font-semibold ${day === "Sun" ? "text-red-600" : "text-gray-200"}`}>
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
                                    const dayIsToday = isToday(new Date(year, month - 1, day));
                                    const isSunday = (firstDayOfMonth + index + 1) % 7 === 0;
                                    const events = findDayEvents(year, month, day, eventsData);

                                    return (
                                        <div key={index + 7} className={`text-center py-2 text-white rounded-xl cursor-pointer ${dayIsToday ? 'bg-blue-700 font-bold hover:bg-blue-600 transition' : (!dayIsToday && events.length > 0 ? `bg-${events[0].color}-500 hover:bg-${events[0].color}-400 transition` : `${!dayIsToday && !events.length && isSunday ? 'text-red-600' : ''}`)}`} onClick={() => handleDayClick(day, month)}>
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        {dayInfoModal && <DayInfoModal day={dayInfoModal} eventsData={eventsData} onClose={() => setDayInfoModal("")} />}
                    </div>
                );
            })}
        </div>
    );
};

export default YearlyCalendar;