import mainapi from './auth';

let eventsCache = null;
let eventsCacheTime = 0;

export const getAllEvents = async () => {
    try {
        const now = Date.now();
        if (eventsCache && (now - eventsCacheTime < 5 * 60 * 1000)) {
            return eventsCache;
        }
        const response = await mainapi.get('/events');
        eventsCache = response.data;
        eventsCacheTime = now;
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