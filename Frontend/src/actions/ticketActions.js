import axios from '../axios';

// Create ticket action types
export const CREATE_TICKET_REQUEST = 'CREATE_TICKET_REQUEST';
export const CREATE_TICKET_SUCCESS = 'CREATE_TICKET_SUCCESS';
export const CREATE_TICKET_FAIL = 'CREATE_TICKET_FAIL';

// Get user tickets action types
export const GET_USER_TICKETS_REQUEST = 'GET_USER_TICKETS_REQUEST';
export const GET_USER_TICKETS_SUCCESS = 'GET_USER_TICKETS_SUCCESS';
export const GET_USER_TICKETS_FAIL = 'GET_USER_TICKETS_FAIL';

// Get ticket details action types
export const GET_TICKET_DETAILS_REQUEST = 'GET_TICKET_DETAILS_REQUEST';
export const GET_TICKET_DETAILS_SUCCESS = 'GET_TICKET_DETAILS_SUCCESS';
export const GET_TICKET_DETAILS_FAIL = 'GET_TICKET_DETAILS_FAIL';

// Admin ticket actions
export const GET_ALL_TICKETS_REQUEST = 'GET_ALL_TICKETS_REQUEST';
export const GET_ALL_TICKETS_SUCCESS = 'GET_ALL_TICKETS_SUCCESS';
export const GET_ALL_TICKETS_FAIL = 'GET_ALL_TICKETS_FAIL';

export const UPDATE_TICKET_STATUS_REQUEST = 'UPDATE_TICKET_STATUS_REQUEST';
export const UPDATE_TICKET_STATUS_SUCCESS = 'UPDATE_TICKET_STATUS_SUCCESS';
export const UPDATE_TICKET_STATUS_FAIL = 'UPDATE_TICKET_STATUS_FAIL';

export const DELETE_TICKET_REQUEST = 'DELETE_TICKET_REQUEST';
export const DELETE_TICKET_SUCCESS = 'DELETE_TICKET_SUCCESS';
export const DELETE_TICKET_FAIL = 'DELETE_TICKET_FAIL';

export const GET_TICKET_STATS_REQUEST = 'GET_TICKET_STATS_REQUEST';
export const GET_TICKET_STATS_SUCCESS = 'GET_TICKET_STATS_SUCCESS';
export const GET_TICKET_STATS_FAIL = 'GET_TICKET_STATS_FAIL';

export const CLEAR_TICKET_ERRORS = 'CLEAR_TICKET_ERRORS';
export const CLEAR_TICKET_MESSAGES = 'CLEAR_TICKET_MESSAGES';

// Create new ticket
export const createTicket = (ticketData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_TICKET_REQUEST });

        const config = { 
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true 
        };

        const { data } = await axios.post('/ticket/create', ticketData, config);

        dispatch({
            type: CREATE_TICKET_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: CREATE_TICKET_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get user's tickets
export const getUserTickets = (filters = {}) => async (dispatch) => {
    try {
        dispatch({ type: GET_USER_TICKETS_REQUEST });

        const config = { withCredentials: true };
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
        if (filters.page) queryParams.append('page', filters.page);
        if (filters.limit) queryParams.append('limit', filters.limit);

        const queryString = queryParams.toString();
        const url = queryString ? `/ticket/my-tickets?${queryString}` : '/ticket/my-tickets';

        const { data } = await axios.get(url, config);

        dispatch({
            type: GET_USER_TICKETS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: GET_USER_TICKETS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get ticket details
export const getTicketDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_TICKET_DETAILS_REQUEST });

        const config = { withCredentials: true };

        const { data } = await axios.get(`/ticket/details/${id}`, config);

        dispatch({
            type: GET_TICKET_DETAILS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: GET_TICKET_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Admin: Get all tickets
export const getAllTickets = (filters = {}) => async (dispatch) => {
    try {
        dispatch({ type: GET_ALL_TICKETS_REQUEST });

        const config = { withCredentials: true };
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);
        if (filters.priority && filters.priority !== 'all') queryParams.append('priority', filters.priority);
        if (filters.category && filters.category !== 'all') queryParams.append('category', filters.category);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.page) queryParams.append('page', filters.page);
        if (filters.limit) queryParams.append('limit', filters.limit);

        const queryString = queryParams.toString();
        const url = queryString ? `/ticket/admin/all?${queryString}` : '/ticket/admin/all';

        const { data } = await axios.get(url, config);

        dispatch({
            type: GET_ALL_TICKETS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: GET_ALL_TICKETS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Admin: Update ticket status
export const updateTicketStatus = (id, updateData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_TICKET_STATUS_REQUEST });

        const config = { 
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true 
        };

        const { data } = await axios.put(`/ticket/admin/${id}`, updateData, config);

        dispatch({
            type: UPDATE_TICKET_STATUS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: UPDATE_TICKET_STATUS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Admin: Delete ticket
export const deleteTicket = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_TICKET_REQUEST });

        const config = { withCredentials: true };

        const { data } = await axios.delete(`/ticket/admin/${id}`, config);

        dispatch({
            type: DELETE_TICKET_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: DELETE_TICKET_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get ticket statistics
export const getTicketStats = () => async (dispatch) => {
    try {
        dispatch({ type: GET_TICKET_STATS_REQUEST });

        const config = { withCredentials: true };

        const { data } = await axios.get('/ticket/admin/stats', config);

        dispatch({
            type: GET_TICKET_STATS_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: GET_TICKET_STATS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Clear errors
export const clearTicketErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_TICKET_ERRORS });
};

// Clear messages
export const clearTicketMessages = () => (dispatch) => {
    dispatch({ type: CLEAR_TICKET_MESSAGES });
};
