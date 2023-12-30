import React, {useState} from "react";
import {endOfWeek, format, isToday, startOfWeek} from "date-fns";
import axios from "axios";

import AddNewEventModal from "./AddOrEditModal";
import ContestModal from "./ContestModal";

import { FaCalendarPlus, FaLocationPin } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { PiTextAlignLeftLight } from "react-icons/pi";

const WeeklyCalendar = ({ date, eventsData }) => {
    const [editEventData, setEditEventData] = useState(null);
    const [newEventModal, setNewEventModal] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);

    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, dayIndex) => {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + dayIndex);
        return currentDay;
    });

    const findDayEvents = (day, eventsData) => {
        return eventsData?.filter((event) => {
            const eventDate = new Date(event.datetimeStart);
            return eventDate.getFullYear() === day.getFullYear() && eventDate.getMonth() === day.getMonth() && eventDate.getDate() === day.getDate();
        });
    }

    const deleteEvent = async(eventId) => {
        // TODO: Add a contest for deletion here and make this reusable.

        await axios.post("http://localhost:8080/api/delete-event", { id: eventId }, { withCredentials: true }).then((response) => {
            if (response.status === 201) {

            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="w-full">
            <h1 className="text-3xl text-white font-semibold text-center p-4">{format(weekStart, 'MMMM dd, yyyy')} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'MMMM dd, yyyy')}</h1>
            {weekDays.map((day, dayIndex) => {
                const dayEvents = findDayEvents(day, eventsData);

                return (
                    <div key={dayIndex} className="flex flex-col">
                        <div className="flex justify-center items-center p-4 md:p-12">
                            <div className="bg-zinc-800 rounded-xl p-4 md:p-8 shadow-md cursor-pointer hover:scale-105 transition-transform w-full md:w-1/2 lg:w-1/3">
                                <h1 className={`text-2xl md:text-4xl font-semibold ${isToday(day) ? "text-blue-600" : "text-white"}`}>{format(day, 'EEEE')}</h1>
                                <h2 className={`text-xl md:text-3xl font-semibold rounded-xl ${isToday(day) ? "text-blue-600" : "text-white"}`}>{format(day, 'do')}</h2>
                                {dayEvents && dayEvents.length > 0 ? (
                                    <div className="flex flex-col justify-center items-center">
                                        {dayEvents.map((event, index) => (
                                            <div key={index} className={`flex flex-col mt-4 p-2 text-white bg-${event.color}-500 rounded-xl cursor-pointer w-full`}>
                                                <h1 className="text-3xl">{event.name}</h1>
                                                <p className="text-sm">{format(new Date(event.datetimeStart), 'HH:mm')} - {format(new Date(event.datetimeEnd), 'HH:mm')}</p>
                                                <p className="text-2xl">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>

                                                <div className="relative flex mt-2 items-center">
                                                    <div className="flex-grow border-t border-white"></div>
                                                    <PiTextAlignLeftLight className="flex-shrink mx-4 text-3xl"/>
                                                    <div className="flex-grow border-t border-white"></div>
                                                </div>
                                                <p className="text-xl text-center">{event.description}</p>

                                                <div className="relative flex mt-2 items-center">
                                                    <div className="flex-grow border-t border-white"></div>
                                                    <FaLocationPin className="flex-shrink mx-4 text-3xl"/>
                                                    <div className="flex-grow border-t border-white"></div>
                                                </div>
                                                <p className="text-xl text-center">{event.location}</p>

                                                <div className="flex items-center mt-6">
                                                    <MdEdit className="mr-2 text-3xl hover:scale-125 transition-transform" onClick={() => setEditEventData(event)}/>
                                                    <MdDelete className="mr-2 text-3xl hover:scale-125 transition-transform" onClick={() => setEventIdToDelete(event.id)}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center">
                                        <p className="text-white font-semibold">No events for this day.</p>
                                        <button className="flex items-center bg-green-500 hover:bg-green-600 w-32 text-white font-bold py-2 px-4 justify-center rounded mt-5 mb-12 cursor-pointer" onClick={() => setNewEventModal(true)}>
                                            New <FaCalendarPlus className={"ml-1"} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {editEventData && (
                            <AddNewEventModal eventData={editEventData} onClose={() => setEditEventData(null)}/>
                        )}
                        {eventIdToDelete && (
                            <ContestModal title="Are you sure you want to delete this event?" actionYes={() => deleteEvent(eventsData)} actionNo={() => setEventIdToDelete(null)} />
                        )}
                        {newEventModal && (
                            <AddNewEventModal onClose={() => setNewEventModal(false)} />
                        )}
                    </div>
                );
            })}
        </div>
    );

};

export default WeeklyCalendar;
