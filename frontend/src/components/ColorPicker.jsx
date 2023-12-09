import React, { useState } from 'react';

function ColorPicker({ onColorChange }) {
    const [selectedColor, setSelectedColor] = useState("blue");

    const colors = ["blue", "red", "green", "yellow", "orange", "amber", "emerald", "purple", "pink"];

    const setColor = (color) => {
        setSelectedColor(color);
        onColorChange(color);
    };

    return (
        <div className="flex">
            {colors.map((color) => (
                <div
                    key={color}
                    className={`w-8 h-8 bg-${color}-500 rounded-lg cursor-pointer mr-2 ${selectedColor === color ? 'border-2 border-white' : ''}`}
                    onClick={() => setColor(color)}
                ></div>
            ))}
        </div>
    );
}

export default ColorPicker;