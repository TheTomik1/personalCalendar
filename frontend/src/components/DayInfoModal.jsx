import React, {useEffect, useState} from "react";
import axios from "axios";

import { format } from "date-fns";

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

import AddNewEventModal from "./AddOrEditModal";
import ContestModal from "./ContestModal";

import { FaCalendarPlus } from "react-icons/fa6";

const DayInfoModal = ({ day, eventsData, onClose }) => {
    const [editEventData, setEditEventData] = useState(null);
    const [newEventModal, setNewEventModal] = useState(false);
    const [eventIdToDelete, setEventIdToDelete] = useState(null);

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
                            <div key={index}
                                 className={`mb-2 flex items-center pl-2 p-0.5 pr-2 justify-between text-white bg-${event.color}-500 rounded-xl cursor-pointer`}>
                                <div>
                                    <p className={`text-xl text-left`}>{event.name}</p>
                                    <p className="text-sm text-left">{format(new Date(event.datetimeStart), "HH:mm")} - {format(new Date(event.datetimeEnd), "HH:mm")}</p>
                                </div>
                                <div className="flex items-center">
                                    <MdEdit className="mr-2 text-xl" onClick={() => setEditEventData(event)}/>
                                    <MdDelete className={"mr-2 text-xl"} onClick={() => setEventIdToDelete(event.id)}/>
                                </div>
                            </div>
                        ))}
                        <div className=" flex flex-col items-center">
                            <button className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 m-4 rounded cursor-pointer" onClick={() => setNewEventModal(true)}>
                                New event <FaCalendarPlus className={"ml-1"}/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 flex flex-col items-center">
                        <p className="text-xl text-white">No events</p>
                        <button
                            className="flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 m-4 rounded cursor-pointer" onClick={() => setNewEventModal(true)}>
                            New event <FaCalendarPlus className={"ml-1"}/>
                        </button>
                    </div>
                )}
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
        </div>
    )
}

export default DayInfoModal;
