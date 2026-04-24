import mainapi from './auth';

export const getAllEvents = async () => {
    try {
        const response = await mainapi.get('/events');
        return response.data;
    } catch (error) {
        console.error("Error fetching all events:", error);
        throw error;
    }
};

export const getEventById = async (id) => {
    try {
        const response = await mainapi.get(`/events/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event details:", error);
        throw error;
    }
};