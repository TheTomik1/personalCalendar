function ColorPicker({ selectedColor, onColorChange }) {
    const colors = ["blue", "red", "green", "yellow", "orange", "amber", "emerald", "purple", "pink"];

    /*
    * @param color - One of the colors in the colors array.
    * @description - Sets the selected color into the parent component.
    */
    const setColor = (color) => {
        onColorChange(color);
    };

    return (
        <div className="flex">
            {colors.map((color) => (
                <div
                    key={color}
                    className={`w-6 h-6 bg-${color}-500 rounded-lg cursor-pointer mr-2 ${selectedColor === color ? 'border-2 border-white' : ''}`}
                    onClick={() => setColor(color)}
                ></div>
            ))}
        </div>
    );
}

export default ColorPicker;