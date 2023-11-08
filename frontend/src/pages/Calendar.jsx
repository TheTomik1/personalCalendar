import React, { useEffect, useState } from "react";
import axios from "axios";

const Calendar = () => {
    const [calendarData, setCalendarData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchCalendar = await axios.get("http://localhost:8080/api/get-calendar", { withCredentials: true });

                if (fetchCalendar.status === 200) {
                    setCalendarData(fetchCalendar.data.calendar);
                } else {
                    setError("Calendar not found.");
                }
            } catch (error) {
                if (error.response.data.message === "Unauthorized.") {
                    setError(error.response.data.message);
                }
            }
        }

        fetchData();
    }, []);

    return (
        <div>
            <h1>Calendar</h1>
            {error && <p>Error: {error}</p>}
            {calendarData && (
                <div>
                    <h2>Calendar Information</h2>
                    <pre>{JSON.stringify(calendarData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Calendar;
