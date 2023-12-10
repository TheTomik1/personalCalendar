import React, {useState} from "react";
import axios from "axios";
import { TwitterPicker } from "react-color";
import { format } from "date-fns";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import ColorPicker from "./ColorPicker";

import { FaLocationPin } from "react-icons/fa6";
import { PiTextAlignLeftLight } from "react-icons/pi";
import { AiFillDelete } from "react-icons/ai";
import TimePicker from "./TimePicker";

const PostEvent = async (title, description, location, color, date, start, end, eventType) => {
    await axios.post("http://localhost:8080/api/add-event", {
        title: title,
        description: description,
        location: location,
        color: color,
        start: `${date} ${start}`,
        end: `${date} ${end}`,
        type: eventType
    }, {withCredentials: true}).then((res) => {
        if (res.status === 201) {
            window.location.reload();
        }
    }).catch((err) => {
        console.log(err);
    })
}

const AddNewEventModal = ({ onClose }) => {
    const tailwindColorsObject = {
        gray: '#718096',
        red: '#e53e3e',
        yellow: '#ecc94b',
        green: '#48bb78',
        blue: '#4299e1',
        indigo: '#667eea',
        purple: '#9f7aea',
        pink: '#ed64a6',
        rose: '#f56565',
        orange: '#ed8936',
        amber: '#ecc94b',
        lime: '#48bb78',
        teal: '#38b2ac',
        cyan: '#4299e1',
        violet: '#9f7aea',
        fuchsia: '#ed64a6',
        emerald: '#48bb78',
    };
    const tailwindClassNames = Object.keys(tailwindColorsObject).map((colorName) => `${colorName}-500`);

    const [addTitleFocused, setAddTitleFocused] = useState(false);
    const [addDescriptionFocused, setAddDescriptionFocused] = useState(false);
    const [addLocationFocused, setAddLocationFocused] = useState(false);
    const [eventType, setEventType] = useState('event');

    const [title, setTitle] = useState('No title.');
    const [description, setDescription] = useState('No description.');
    const [location, setLocation] = useState('No location.');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState(new Date());
    const [color, setColor] = useState('blue');

    console.log(startTime);
    console.log(endTime);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-zinc-800 rounded-xl p-4">
                <div className="flex justify-end">
                    <AiFillDelete className={"text-3xl text-red-600 hover:text-red-500 transition"} onClick={() => onClose()}/>
                </div>
                <form onSubmit={PostEvent}>
                    <input
                         type="text"
                         placeholder="Add title."
                         className={`bg-zinc-800 px-4 py-2 text-3xl text-white focus:outline-none ${addTitleFocused ? 'border-blue-600 transition ease-in-out duration-300' : 'border-gray-300 transition ease-in-out duration-300'} border-b-2`}
                         onFocus={() => setAddTitleFocused(true)}
                         onBlur={() => setAddTitleFocused(false)}
                         onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="flex flex-row space-x-2 p-4">
                        <p className={`text-2xl text-white p-1.5 rounded-md cursor-pointer transition ease-in-out duration-300 ${eventType === "event" ? "text-blue-400 bg-blue-600": "hover:bg-zinc-700"}`} onClick={() => setEventType("event")}>Event</p>
                        <p className={`text-2xl text-white p-1.5 rounded-md cursor-pointer transition ease-in-out duration-300 ${eventType === "task" ? "text-blue-400 bg-blue-600": "hover:bg-zinc-700"}`} onClick={() => setEventType("task")}>Task</p>
                    </div>

                    <div className="flex justify-center items-center">
                        <DayPicker
                            onDayClick={(date) => setDate(date)}
                            selected={date}
                            className="bg-zinc-800 text-white"
                            showOutsideDays
                            ISOWeek
                            footer={
                            <div className="flex justify-between items-center text-black">
                                <TimePicker onStartTimeChange={(time) => setStartTime(time)} onEndTimeChange={(time) => setEndTime(time)} />
                            </div>
                            }
                        />
                    </div>

                    <div className="flex flex-col justify-start">
                        <div className="flex items-center mb-4">
                            <FaLocationPin className="text-gray-300 text-2xl" />
                            <input
                                 type="text"
                                 placeholder="Add description."
                                 className={`bg-zinc-800 px-4 py-2 text-xl text-white focus:outline-none ${addDescriptionFocused ? 'border-blue-600 transition ease-in-out duration-300' : 'bg-gray-300 bg-opacity-10 transition ease-in-out duration-300'} border-b-2 ml-2`}
                                 onFocus={() => setAddDescriptionFocused(true)}
                                 onBlur={() => setAddDescriptionFocused(false)}
                                 onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {eventType === "event" &&
                            <div className="flex items-center">
                                <PiTextAlignLeftLight className="text-gray-300 text-2xl" />
                                <input
                                    type="text"
                                    placeholder="Add location."
                                    className={`bg-zinc-800 px-4 py-2 text-xl text-white focus:outline-none ${addLocationFocused ? 'border-blue-600 transition ease-in-out duration-300' : 'bg-gray-300 bg-opacity-10 transition ease-in-out duration-300'} border-b-2 ml-2`}
                                    onFocus={() => setAddLocationFocused(true)}
                                    onBlur={() => setAddLocationFocused(false)}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                        }

                        <div className="flex-grow border-t border-gray-400 mt-5"></div>
                        <h1 className="text-gray-300 text-xl mt-4">Color</h1>
                        <div className="flex justify-center items-center">
                            <ColorPicker onColorChange={(color) => setColor(color)}/>
                        </div>
                    </div>
                </form>
                <button className="text-white bg-blue-600 px-4 py-2 rounded-lg mt-4 hover:bg-blue-500 transition" onClick={() => PostEvent(title, description, location, color, format(date, "yyyy-MM-dd"), startTime, endTime, eventType)}>Add</button>
            </div>
        </div>
    )
}

export default AddNewEventModal;