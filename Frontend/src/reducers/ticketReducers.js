import {
    CREATE_TICKET_REQUEST,
    CREATE_TICKET_SUCCESS,
    CREATE_TICKET_FAIL,
    GET_USER_TICKETS_REQUEST,
    GET_USER_TICKETS_SUCCESS,
    GET_USER_TICKETS_FAIL,
    GET_TICKET_DETAILS_REQUEST,
    GET_TICKET_DETAILS_SUCCESS,
    GET_TICKET_DETAILS_FAIL,
    GET_ALL_TICKETS_REQUEST,
    GET_ALL_TICKETS_SUCCESS,
    GET_ALL_TICKETS_FAIL,
    UPDATE_TICKET_STATUS_REQUEST,
    UPDATE_TICKET_STATUS_SUCCESS,
    UPDATE_TICKET_STATUS_FAIL,
    DELETE_TICKET_REQUEST,
    DELETE_TICKET_SUCCESS,
    DELETE_TICKET_FAIL,
    GET_TICKET_STATS_REQUEST,
    GET_TICKET_STATS_SUCCESS,
    GET_TICKET_STATS_FAIL,
    CLEAR_TICKET_ERRORS,
    CLEAR_TICKET_MESSAGES
} from '../actions/ticketActions';

// Create ticket reducer
export const createTicketReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_TICKET_REQUEST:
            return {
                loading: true
            };
        case CREATE_TICKET_SUCCESS:
            return {
                loading: false,
                success: true,
                ticket: action.payload.ticket,
                message: action.payload.message
            };
        case CREATE_TICKET_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_TICKET_ERRORS:
            return {
                ...state,
                error: null
            };
        case CLEAR_TICKET_MESSAGES:
            return {
                ...state,
                message: null,
                success: false
            };
        default:
            return state;
    }
};

// User tickets reducer
export const userTicketsReducer = (state = { tickets: [] }, action) => {
    switch (action.type) {
        case GET_USER_TICKETS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_USER_TICKETS_SUCCESS:
            return {
                loading: false,
                tickets: action.payload.tickets,
                totalTickets: action.payload.totalTickets,
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages
            };
        case GET_USER_TICKETS_FAIL:
            return {
                loading: false,
                error: action.payload,
                tickets: []
            };
        case CLEAR_TICKET_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Ticket details reducer
export const ticketDetailsReducer = (state = { ticket: {} }, action) => {
    switch (action.type) {
        case GET_TICKET_DETAILS_REQUEST:
            return {
                loading: true,
                ticket: {}
            };
        case GET_TICKET_DETAILS_SUCCESS:
            return {
                loading: false,
                ticket: action.payload.ticket
            };
        case GET_TICKET_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload,
                ticket: {}
            };
        case CLEAR_TICKET_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Admin tickets reducer
export const allTicketsReducer = (state = { tickets: [] }, action) => {
    switch (action.type) {
        case GET_ALL_TICKETS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case GET_ALL_TICKETS_SUCCESS:
            return {
                loading: false,
                tickets: action.payload.tickets,
                totalTickets: action.payload.totalTickets,
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages,
                stats: action.payload.stats
            };
        case GET_ALL_TICKETS_FAIL:
            return {
                loading: false,
                error: action.payload,
                tickets: []
            };
        case CLEAR_TICKET_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Update ticket reducer
export const updateTicketReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_TICKET_STATUS_REQUEST:
            return {
                loading: true
            };
        case UPDATE_TICKET_STATUS_SUCCESS:
            return {
                loading: false,
                success: true,
                ticket: action.payload.ticket,
                message: action.payload.message
            };
        case UPDATE_TICKET_STATUS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_TICKET_ERRORS:
            return {
                ...state,
                error: null
            };
        case CLEAR_TICKET_MESSAGES:
            return {
                ...state,
                message: null,
                success: false
            };
        default:
            return state;
    }
};

// Delete ticket reducer
export const deleteTicketReducer = (state = {}, action) => {
    switch (action.type) {
        case DELETE_TICKET_REQUEST:
            return {
                loading: true
            };
        case DELETE_TICKET_SUCCESS:
            return {
                loading: false,
                success: true,
                message: action.payload.message
            };
        case DELETE_TICKET_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_TICKET_ERRORS:
            return {
                ...state,
                error: null
            };
        case CLEAR_TICKET_MESSAGES:
            return {
                ...state,
                message: null,
                success: false
            };
        default:
            return state;
    }
};

// Ticket stats reducer
export const ticketStatsReducer = (state = { stats: {} }, action) => {
    switch (action.type) {
        case GET_TICKET_STATS_REQUEST:
            return {
                loading: true,
                stats: {}
            };
        case GET_TICKET_STATS_SUCCESS:
            return {
                loading: false,
                stats: action.payload.stats,
                categoryStats: action.payload.categoryStats,
                priorityStats: action.payload.priorityStats
            };
        case GET_TICKET_STATS_FAIL:
            return {
                loading: false,
                error: action.payload,
                stats: {}
            };
        case CLEAR_TICKET_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};
