import React, {useEffect, useState} from "react";

import { format } from "date-fns";

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import axios from "axios";

import AddNewEventModal from "./AddNewEventModal";

const DayInfoModal = ({ day, eventsData, onClose }) => {
    const [editEventData, setEditEventData] = useState(null);

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

    const editEvent = async(event) => {
        setEditEventData(event);
    }

    const deleteEvent = async(eventId) => {
        // TODO: Add a contest for deletion here.

        await axios.post("http://localhost:8080/api/delete-event", { id: eventId }, { withCredentials: true }).then((response) => {
            if (response.status === 201) {
                onClose();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-zinc-800 rounded-xl p-4">
                <h1 className={"text-4xl text-white mb-4"}>{format(day.day, "EEEE")}</h1>
                <h2 className={`text-3xl text-white ${day.isToday ? "bg-blue-700 p-2 rounded-xl" : null}`}>{format(day.day, "do LLLL")}</h2>

                {day.events && day.events.length > 0 ? (
                    <div className="mt-4">
                        {day.events.map((event, index) => (
                            <div key={index} className={`mb-2 flex items-center pl-2 p-0.5 pr-2 justify-between text-white bg-${event.color}-500 rounded-xl cursor-pointer`}>
                                <div>
                                    <p className={`text-xl text-left`}>{event.name}</p>
                                    <p className="text-sm text-left">{format(new Date(event.datetimeStart), "HH:mm")} - {format(new Date(event.datetimeEnd), "HH:mm")}</p>
                                </div>
                                <div className="flex items-center">
                                    <MdEdit className="mr-2 text-xl" onClick={() => editEvent(event)}/>
                                    <MdDelete className={"mr-2 text-xl"} onClick={() => deleteEvent(event.id)}/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4">
                        <p className="text-xl text-white">No events</p>
                    </div>
                )}

                {editEventData && (
                    <AddNewEventModal eventData={editEventData} onClose={() => setEditEventData(null)} />
                )}
            </div>
        </div>
    )
}

export default DayInfoModal;
