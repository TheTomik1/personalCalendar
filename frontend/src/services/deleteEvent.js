import axios from 'axios';
import toastr from 'toastr';

export const deleteEvent = async(eventId) => {
    try {
        const response = await axios.post("http://localhost:8080/api/delete-event", { id: eventId });

        if (response.status === 201) {
            toastr.success("Event deleted successfully!");

            window.location.reload();
        }
    } catch (error) {
        toastr.error("There was an error deleting the event! Try again later.");
    }
};
