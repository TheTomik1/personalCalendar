import {useEffect} from "react";

const ContestModal = ({ title, actionYes, actionNo }) => {
    useEffect(() => {
        const handleOutsideClick = (e) => {
            const modal = document.querySelector('.bg-zinc-800');
            if (modal && !modal.contains(e.target)) {
                actionNo();
            }
        };

        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, [actionNo]);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-zinc-800 rounded-lg w-1/3 p-4">
                <div className="flex justify-center items-center">
                    <div className="text-2xl text-white">{title}</div>
                </div>
                <div className="flex justify-center items-center mt-4 space-x-4">
                    <button className="flex items-center bg-red-600 hover:bg-red-500 text-white text-xl font-bold py-2 px-4 rounded" onClick={actionYes}>Yes</button>
                    <button className="flex items-center bg-green-600 hover:bg-green-500 text-white text-xl font-bold py-2 px-4 rounded" onClick={actionNo}>No</button>
                </div>
            </div>
        </div>
    );
}

export default ContestModal;
