import React, { useState } from 'react';
import { format, addMinutes } from 'date-fns';

const TimePicker = ({ onStartTimeChange, onEndTimeChange }) => {
    const [startSelectedTime, setStartSelectedTime] = useState(null);
    const [endSelectedTime, setEndSelectedTime] = useState(null);

    const generateTimeOptions = (minTime) => {
        const startTime = new Date();
        const endTime = addMinutes(new Date(), 24 * 60);

        const timeOptions = [];
        let currentTime = startTime;

        while (currentTime < endTime) {
            const timeValue = format(currentTime, 'HH:mm');
            const timeLabel = format(currentTime, 'h:mm a');

            if (!minTime || timeValue > minTime) {
                timeOptions.push({ value: timeValue, label: timeLabel });
            }

            currentTime = addMinutes(currentTime, 5);
        }

        return timeOptions;
    };

    const handleStartChange = (e) => {
        const newStartSelectedTime = e.target.value;
        setStartSelectedTime(newStartSelectedTime);
        onStartTimeChange(newStartSelectedTime);

        if (endSelectedTime && endSelectedTime <= newStartSelectedTime) {
            setEndSelectedTime(null);
            onEndTimeChange(null);
        }
    };

    const handleEndChange = (e) => {
        setEndSelectedTime(e.target.value);
        onEndTimeChange(e.target.value);
    };

    return (
        <div className="flex items-center">
            <select value={startSelectedTime} className="bg-zinc-600 m-4 p-1 text-white rounded-xl focus:outline-none" onChange={handleStartChange}>
                {generateTimeOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <span className="text-white mx-2">-</span>
            <select value={endSelectedTime} className="bg-zinc-600 m-4 p-1 text-white rounded-xl focus:outline-none" onChange={handleEndChange}>
                {generateTimeOptions(startSelectedTime).map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>

    );
};

export default TimePicker;
