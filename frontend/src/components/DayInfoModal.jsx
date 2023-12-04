import React from "react";

const DayInfoModal = ({ day }) => {
    const isCurrentMonth = day.isCurrentMonth;

    return (
        <h1 className={"text-white"}>
            {isCurrentMonth}
        </h1>
    )
}

export default DayInfoModal;
