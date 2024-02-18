import React, { useState, useEffect } from "react";
import {format} from "date-fns";
import axios from "axios";
import toastr from "toastr";

import ColorPicker from "./ColorPicker";
import TimePicker_ from "./TimePicker";

import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"

const AddEditEventModal = ({ eventData, onClose }) => {
    const [addTitleFocused, setAddTitleFocused] = useState(false);
    const [addDescriptionFocused, setAddDescriptionFocused] = useState(false);
    const [addLocationFocused, setAddLocationFocused] = useState(false);

    const [eventType, setEventType] = useState('event');
    const [title, setTitle] = useState(eventData.title ? eventData.title : 'Add title.');
    const [description, setDescription] = useState(eventData.description ? eventData.description : 'Add description.');
    const [location, setLocation] = useState(eventData.location ? eventData.location : 'Add location.');
    const [remindOption, setRemindOption] = useState(eventData.reminderOption ? eventData.reminderOption : '5m');
    const [eventDate, setEventDate] = useState(/:/.test(eventData.datetimeStart) ? new Date(eventData.datetimeStart) : new Date());
    const [startTime, setStartTime] = useState(!/:/.test(eventData.datetimeStart) && eventData.datetimeStart ? format(new Date(eventData.datetimeStart), "HH:mm") : format(new Date(), "HH:mm"));
    const [endTime, setEndTime] = useState(eventData.datetimeEnd ? format(new Date(eventData.datetimeEnd), "HH:mm") : format(new Date(), "HH:mm"));
    const [color, setColor] = useState(`${eventData.color ? eventData.color : 'blue'}`);

    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const validateForm = () => {
            if (typeof eventDate !== "string" && typeof startTime !== "string" && typeof endTime !== "string") {
                if (format(new Date(eventDate), "yyyy-MM-dd HH:MM") < format(new Date(), "yyyy-MM-dd")) {
                    return false;
                }

                if (format(new Date(startTime), "HH:mm") > format(new Date(endTime), "HH:mm")) {
                    return false;
                }

                if (format(new Date(startTime), "HH:mm") === format(new Date(endTime), "HH:mm")) {
                    return false;
                }

                if (format(new Date(startTime), "yyyy-MM-dd") < format(new Date(), "yyyy-MM-dd")) {
                    return false;
                }

                return true;
            }
        };

        setIsFormValid(validateForm());
    }, [eventDate, startTime, endTime]);

    const handleInputChange = (e) => {
        // This exclusively handles only the input fields in the form. The rest of the fields are handled in separate arrow functions.

        const { id, value } = e.target;

        switch (id) {
            case "title":
                setTitle(value);
                break;
            case "description":
                setDescription(value);
                break;
            case "location":
                setLocation(value);
                break;
            case "remindOption":
                setRemindOption(value);
                break;
        }
    }

    const handleEventTypeChange = (e) => {
        if (e.target.textContent === "Event") {
            setEventType("event");
        }
        if (e.target.textContent === "Task") {
            setEventType("task");
        }
        if (e.target.textContent === "Meeting") {
            setEventType("meeting");
        }
    }

    const handleEventDataChange = (eventDate) => {
        setEventDate(eventDate);
    }

    const handleStartTimeChange = (time) => {
        setStartTime(time);
    }

    const handleEndTimeChange = (time) => {
        setEndTime(time);
    }

    const handleColorChange = (color) => {
        setColor(color);
    }

    const addEditEvent = async(eventType, title, description, location, remindOption, date, startTime, endTime, color) => {
        const formatReceivedDate = (date) => {
            return format(new Date(date), "yyyy-MM-dd");
        }

        const formatReceivedTime = (time) => {
            return format(new Date(time), "HH:mm");
        }

        try {
            const addEditResponse = await axios.post("http://localhost:8080/api/add-edit-event", {
                id: eventData ? eventData.id : null,
                eventType: eventType,
                title: title,
                description: description,
                location: location,
                reminderOption: remindOption,
                datetimeStart: `${formatReceivedDate(date)} ${formatReceivedTime(startTime)}`,
                datetimeEnd: `${formatReceivedDate(date)} ${formatReceivedTime(endTime)}`,
                color: color,
                action: [0,1].includes(Object.values(eventData).length) ? "add" : "edit"
            });

            if (addEditResponse.status === 201) {
                toastr.success("Event added successfully!");
            } else {
                toastr.error("Failed to add event!");
            }
        } catch (error) {
            if (error.response.data.message === "Start date cannot be before current date.") {
                toastr.error("Start date cannot be before current date."); // This error can happen if the user wants the event to start in a few minutes, but before they finish the form, the time passes.
            }
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
            <div className=" bg-zinc-700 rounded-xl p-4">
                <form className="flex flex-col">
                    <h1 className="text-4xl text-white">{[0, 1].includes(Object.values(eventData).length) ? 'Add Event' : 'Edit Event'}</h1>

                    <div className="flex justify-center space-x-2 p-2 bg-zinc-800 rounded-xl m-4">
                        <p
                            className={`text-2xl text-white p-1.5 rounded-md cursor-pointer transition ease-in-out duration-300 ${eventType === "event" ? "text-blue-400 bg-blue-600" : "hover:bg-zinc-700"}`}
                            onClick={handleEventTypeChange}>
                            Event
                        </p>
                        <p
                            className={`text-2xl text-white p-1.5 rounded-md cursor-pointer transition ease-in-out duration-300 ${eventType === "task" ? "text-blue-400 bg-blue-600" : "hover:bg-zinc-700"}`}
                            onClick={handleEventTypeChange}>
                            Task
                        </p>
                        <p
                            className={`text-2xl text-white p-1.5 rounded-md cursor-pointer transition ease-in-out duration-300 ${eventType === "meeting" ? "text-blue-400 bg-blue-600" : "hover:bg-zinc-700"}`}
                            onClick={handleEventTypeChange}>
                            Meeting
                        </p>
                    </div>

                    <div className="flex justify-center mb-4">
                        <input
                            id="title"
                            type="text"
                            value={title}
                            className={`bg-zinc-800 w-64 px-4 py-2 text-xl text-white focus:outline-none ${addTitleFocused ? 'border-blue-600 transition ease-in-out duration-300' : 'bg-gray-300 bg-opacity-10 transition ease-in-out duration-300'} border-b-2 ml-2`}
                            onFocus={() => setAddTitleFocused(true)}
                            onBlur={() => setAddTitleFocused(false)}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-center mb-4">
                        <input
                            id="description"
                            value={description}
                            className={`bg-zinc-800 w-64 px-4 py-2 text-xl text-white focus:outline-none ${addDescriptionFocused ? 'border-blue-600 transition ease-in-out duration-300' : 'bg-gray-300 bg-opacity-10 transition ease-in-out duration-300'} border-b-2 ml-2`}
                            onFocus={() => setAddDescriptionFocused(true)}
                            onBlur={() => setAddDescriptionFocused(false)}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-center mb-4">
                        <input
                            id="location"
                            value={location}
                            className={`bg-zinc-800 w-64 px-4 py-2 text-xl text-white focus:outline-none ${addLocationFocused ? 'border-blue-600 transition ease-in-out duration-300' : 'bg-gray-300 bg-opacity-10 transition ease-in-out duration-300'} border-b-2 ml-2`}
                            onFocus={() => setAddLocationFocused(true)}
                            onBlur={() => setAddLocationFocused(false)}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-center mb-4">
                        <select
                            id="remindOption"
                            value={remindOption}
                            className="bg-zinc-700 w-64 px-4 py-2 text-xl text-white focus:outline-none border-b-2 ml-2"
                            onChange={handleInputChange}
                        >
                            <option value="5m">5 minutes before.</option>
                            <option value="10m">10 minutes before.</option>
                            <option value="15m">15 minutes before.</option>
                            <option value="30m">30 minutes before.</option>
                            <option value="1h">1 hour before.</option>
                            <option value="1d">1 day before.</option>
                        </select>
                    </div>
                    <div className="flex justify-center mb-4">
                        <DatePicker
                            inputClass="bg-zinc-800 w-64 bg-opacity-10 px-4 py-2 text-xl text-white focus:outline-none border-b-2 ml-2"
                            className="bg-dark"
                            weekStartDayIndex={1}
                            format="DD.MM. YYYY"
                            value={eventDate}
                            onChange={handleEventDataChange}
                        />
                    </div>
                    {format(new Date(eventDate), "yyyy-MM-dd HH:MM") < format(new Date(), "yyyy-MM-dd") &&
                        <small className="text-red-500 text-sm ml-2">Date cannot be in the past!</small>}

                    <div className="flex justify-center">
                        <TimePicker_
                            initialStartTime={startTime}
                            initialEndTime={endTime}
                            startTimeOnChange={handleStartTimeChange}
                            endTimeOnChange={handleEndTimeChange}
                        />
                    </div>
                    {typeof startTime !== "string" && typeof endTime !== "string" && (
                        <>
                            {format(new Date(startTime), "HH:mm") > format(new Date(endTime), "HH:mm") &&
                                <small className="text-red-500 text-sm ml-2">Start time must be before end
                                    time!</small>}
                            {format(new Date(startTime), "HH:mm") === format(new Date(endTime), "HH:mm") &&
                                <small className="text-red-500 text-sm ml-2">Start time cannot be the same as end
                                    time!</small>}
                            {format(new Date(startTime), "yyyy-MM-dd") < format(new Date(), "yyyy-MM-dd") &&
                                <small className="text-red-500 text-sm ml-2">Start time cannot be in the past!</small>}
                        </>
                    )}

                    <div className="flex justify-center my-4">
                        <ColorPicker
                            selectedColor={color}
                            onColorChange={handleColorChange}
                        />
                    </div>
                    <div className="flex justify-center space-x-4">
                        {[0, 1].includes(Object.values(eventData).length) ? (
                            <button
                                className={`bg-green-500 hover:bg-green-600 w-32 text-white font-bold py-2 px-4 justify-center rounded cursor-pointer ${
                                    !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={!isFormValid}
                                onClick={() => addEditEvent(eventType, title, description, location, remindOption, eventDate, startTime, endTime, color)}
                            >
                                Create
                            </button>
                        ) : (
                            <button
                                className={`bg-blue-500 hover:bg-blue-600 w-32 text-white font-bold py-2 px-4 justify-center rounded cursor-pointer ${
                                    !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={!isFormValid}
                                onClick={() => addEditEvent(eventType, title, description, location, remindOption, eventDate, startTime, endTime, color)}
                            >
                                Edit
                            </button>
                        )}
                        <button
                            className="bg-red-500 hover:bg-red-600 w-32 text-white font-bold py-2 px-4 justify-center rounded cursor-pointer"
                            onClick={() => onClose()}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEditEventModal;