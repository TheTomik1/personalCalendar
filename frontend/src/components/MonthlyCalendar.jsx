import { addDays, eachDayOfInterval, eachWeekOfInterval, endOfMonth, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import DayInfoModal from "./DayInfoModal";
import React, {useState} from "react";

const findDayEvents = (day, eventsData) => {
    return eventsData?.filter((event) => {
        const eventDate = new Date(event.datetimeStart);
        return eventDate.getFullYear() === day.getFullYear() && eventDate.getMonth() === day.getMonth() && eventDate.getDate() === day.getDate();
    });
}

const MonthlyCalendar = ({ date, eventsData }) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
    const daysInMonthByWeek = monthWeeks.map((weekStart) => {
        return eachDayOfInterval({
            start: startOfWeek(weekStart, { weekStartsOn: 1 }),
            end: addDays(weekStart, 6)
        }).map((day) => ({
            day: day,
            isCurrentMonth: isSameMonth(day, monthStart),
            isToday: isToday(day),
            events: findDayEvents(day, eventsData)
        }));
    });

    const [dayInfoModal, setDayInfoModal] = useState("");

    const handleDayClick = (day) => {
        setDayInfoModal(day);
    }

    return (
        <div className="table w-full">
            <div className="table-header-group">
                <div className="table-row">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => (
                        <div key={index} className="table-cell text-center text-white text-xl font-bold p-2">
                            {dayName}
                        </div>
                    ))}
                </div>
            </div>
            <div className="table-row-group">
                {daysInMonthByWeek.map((week, weekIndex) => (
                    <div key={weekIndex} className="table-row">
                        {week.map((day, dayIndex) => (
                            <div key={dayIndex} className="table-cell h-36 text-center">
                                <span className={`block cursor-pointer ${!day.isCurrentMonth ? 'text-gray-400' : 'text-white'}`} onClick={() => handleDayClick(day)}>
                                    {day.isToday ? (
                                        <span className="relative inline-block">
                                            <p className="bg-blue-700 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition">
                                                {day.day.getDate()}
                                            </p>
                                        </span>
                                    ) : day.events && day.events.length > 0 ? (
                                        <span className="relative inline-block">
                                            <p className={`bg-${day.events[0].color}-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-${day.events[0].color}-400 transition`}>
                                                {day.day.getDate()}
                                            </p>
                                        </span>
                                    ) : (
                                        <p>{day.day.getDate()}</p>
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
                {dayInfoModal && <DayInfoModal day={dayInfoModal} eventsData={eventsData} onClose={() => setDayInfoModal("")} />}
            </div>
        </div>
    );
}

export default MonthlyCalendar;