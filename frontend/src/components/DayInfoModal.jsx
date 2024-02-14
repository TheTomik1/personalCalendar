import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { format, isSunday  } from "date-fns";
import axios from "axios";
import toastr from "toastr";

import AddEditEventModal from "./AddEditEventModal";
import ContestModal from "./ContestModal";

import { MdEdit, MdDelete } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa6";

const DayInfoModal = ({ day, eventsData, onClose }) => {
    const [editEventData, setEditEventData] = useState(null);
    const [newEventModal, setNewEventModal] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (e.target.classList.contains('fixed')) {
                onClose();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [onClose]);

    const deleteEvent = async (eventId) => {
        try {
            const deleteEventResponse = await axios.post("http://localhost:8080/api/delete-event", { id: eventId });

            if (deleteEventResponse.status === 201) {
                toastr.success("Event deleted successfully!");

                navigate(0);
            }
        } catch (error) {
            toastr.error("There was an error deleting the event! Try again later.");
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-zinc-800 rounded-xl p-4 w-2/3 lg:w-1/3">
                <h1 className={"text-2xl md:text-3xl text-white mb-4"}>{format(day.day, "yyyy MMMM")}</h1>
                <h2 className={`text-xl font-bold md:text-xl ${!day.isToday && !isSunday(day.day) ? "text-white" : ""} ${day.isToday ? "text-blue-600 p-2 cursor-pointer select-none" : ""} ${isSunday(day.day) ? "text-red-600" : ""}`}>
                    {format(day.day, "do eeee")}
                </h2>

                <div className="mt-4 max-h-60 overflow-y-auto" style={{touchAction: 'manipulation'}}>
                    {day.events && day.events.length > 0 ? (
                        day.events.map((event, index) => (
                            <div key={index}
                                 className={`mb-2 flex items-center px-4 py-1 justify-between text-white bg-${event.color}-500 rounded-xl cursor-pointer select-none`}>
                                <div>
                                    <p className={`text-xl text-left`}>{event.title}</p>
                                    <p className="text-sm text-left">{format(new Date(event.datetimeStart), "HH:mm")} - {format(new Date(event.datetimeEnd), "HH:mm")}</p>
                                </div>
                                <div className="flex items-center">
                                    <MdEdit className="mr-2 text-xl hover:scale-125 transition-transform"
                                            onClick={() => setEditEventData(event)}/>
                                    <MdDelete className="mr-2 text-xl hover:scale-125 transition-transform"
                                              onClick={() => setEventIdToDelete(event.id)}/>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center">
                            <p className="text-xl text-white">No events</p>
                        </div>
                    )}
                </div>

                <div className=" flex flex-col items-center">
                    <button
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 m-4 rounded cursor-pointer"
                        onClick={() => setNewEventModal(true)}>
                        New event <FaCalendarPlus className={"ml-1"}/>
                    </button>
                </div>

                {editEventData && (
                    <AddEditEventModal eventData={editEventData} onClose={() => setEditEventData(null)}/>
                )}
                {newEventModal && (
                    <AddEditEventModal eventData={{datetimeStart: day.day}} onClose={() => setNewEventModal(false)}/>
                )}
                {eventIdToDelete && (
                    <ContestModal title="Are you sure you want to delete this event?" actionYes={() => {
                        deleteEvent(eventIdToDelete)
                        setEventIdToDelete(null)
                    }} actionNo={() => setEventIdToDelete(null)}/>
                )}
            </div>
        </div>
    );
}

export default DayInfoModal;
