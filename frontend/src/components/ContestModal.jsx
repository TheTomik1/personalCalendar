const ContestModal = ({ title, actionYes, actionNo }) => {
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-zinc-800 sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 rounded-lg p-4">
                <div className="flex justify-center items-center">
                    <div className="text-2xl text-white">{title}</div>
                </div>
                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button className="flex items-center bg-red-600 hover:bg-red-500 text-white text-lg sm:text-xl font-bold py-2 px-4 sm:px-6 rounded-lg" onClick={actionYes}>Yes</button>
                    <button className="flex items-center bg-green-600 hover:bg-green-500 text-white text-lg sm:text-xl font-bold py-2 px-4 sm:px-6 rounded-lg" onClick={actionNo}>No</button>
                </div>
            </div>
        </div>
    );
}

export default ContestModal;
