import React from 'react';
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";

const TimePicker_ = ({ initialStartTime, initialEndTime, startTimeOnChange, endTimeOnChange }) => {
    /*
    * @param newValue - The new value of the start time.
    * @description Handles the change of the start time.
    */
    const handleStartTimeChange = (newValue) => {
        startTimeOnChange(newValue);
    };

    /*
    * @param newValue - The new value of the end time.
    * @description Handles the change of the end time.
    */
    const handleEndTimeChange = (newValue) => {
        endTimeOnChange(newValue);
    };

    return (
        <div className="flex items-center">
            <DatePicker
                disableDayPicker
                placeholder={initialStartTime.toString()}
                onChange={handleStartTimeChange}
                format="HH:mm"
                inputClass={"bg-zinc-600 m-4 p-1 text-white rounded-xl focus:outline-none w-24 text-center"}
                className={"bg-dark"}
                plugins={[
                    <TimePicker hideSeconds/>
                ]}
            />
            <span className="text-white mx-2">-</span>
            <DatePicker
                disableDayPicker
                placeholder={initialEndTime.toString()}
                onChange={handleEndTimeChange}
                format="HH:mm"
                inputClass={"bg-zinc-600 m-4 p-1 text-white rounded-xl focus:outline-none w-24 text-center"}
                className={"bg-dark"}
                plugins={[
                    <TimePicker hideSeconds/>
                ]}
            />
        </div>
    );
};

export default TimePicker_;
