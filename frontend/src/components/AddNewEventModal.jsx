const AddNewEventModal = ({ onClose }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-zinc-800 rounded-xl p-4">
                <h1 className={"text-4xl text-white font-medium mb-2"}>Add new event!</h1>
                
                <div className={"text-sm text-white"}>
                </div>
                <button className="text-white bg-red-600 px-4 py-2 rounded-lg mt-4 hover:bg-red-500 transition" onClick={() => onClose()}>Close</button>
            </div>
        </div>
    )
}

export default AddNewEventModal;