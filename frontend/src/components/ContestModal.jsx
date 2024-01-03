const ContestModal = ({ title, actionYes, actionNo }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-zinc-800 rounded-lg w-1/3 p-4">
                <div className="flex justify-center items-center">
                    <div className="text-2xl text-white">{title}</div>
                </div>
                <div className="flex justify-center items-center mt-4">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mr-2" onClick={actionYes}>Yes</button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg ml-2" onClick={actionNo}>No</button>
                </div>
            </div>
        </div>
    );
}

export default ContestModal;
