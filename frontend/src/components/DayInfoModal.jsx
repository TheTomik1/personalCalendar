import React, {useEffect} from "react";
import { format } from "date-fns";

import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const DayInfoModal = ({ day, eventsData, onClose }) => {
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
                                    <MdEdit className="mr-2 text-xl" />
                                    <MdDelete className={"mr-2 text-xl"}/>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="mt-4">
                        <p className="text-xl text-white">No events</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DayInfoModal;
