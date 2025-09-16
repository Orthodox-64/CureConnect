import {
    PHARMACY_REGISTER_REQUEST,
    PHARMACY_REGISTER_SUCCESS,
    PHARMACY_REGISTER_FAIL,
    PHARMACY_DETAILS_REQUEST,
    PHARMACY_DETAILS_SUCCESS,
    PHARMACY_DETAILS_FAIL,
    MY_PHARMACY_REQUEST,
    MY_PHARMACY_SUCCESS,
    MY_PHARMACY_FAIL,
    PHARMACY_UPDATE_REQUEST,
    PHARMACY_UPDATE_SUCCESS,
    PHARMACY_UPDATE_FAIL,
    PHARMACY_STATS_REQUEST,
    PHARMACY_STATS_SUCCESS,
    PHARMACY_STATS_FAIL,
    PHARMACY_MEDICINES_REQUEST,
    PHARMACY_MEDICINES_SUCCESS,
    PHARMACY_MEDICINES_FAIL,
    ADD_MEDICINE_REQUEST,
    ADD_MEDICINE_SUCCESS,
    ADD_MEDICINE_FAIL,
    UPDATE_MEDICINE_REQUEST,
    UPDATE_MEDICINE_SUCCESS,
    UPDATE_MEDICINE_FAIL,
    DELETE_MEDICINE_REQUEST,
    DELETE_MEDICINE_SUCCESS,
    DELETE_MEDICINE_FAIL,
    BULK_UPLOAD_MEDICINES_REQUEST,
    BULK_UPLOAD_MEDICINES_SUCCESS,
    BULK_UPLOAD_MEDICINES_FAIL,
    LOW_STOCK_MEDICINES_REQUEST,
    LOW_STOCK_MEDICINES_SUCCESS,
    LOW_STOCK_MEDICINES_FAIL,
    EXPIRING_MEDICINES_REQUEST,
    EXPIRING_MEDICINES_SUCCESS,
    EXPIRING_MEDICINES_FAIL,
    PHARMACY_ORDERS_REQUEST,
    PHARMACY_ORDERS_SUCCESS,
    PHARMACY_ORDERS_FAIL,
    CLEAR_ERRORS
} from '../constants/pharmacyConstants';

// Pharmacy registration reducer
export const pharmacyRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case PHARMACY_REGISTER_REQUEST:
            return {
                loading: true
            };
        case PHARMACY_REGISTER_SUCCESS:
            return {
                loading: false,
                success: true,
                pharmacy: action.payload.pharmacy
            };
        case PHARMACY_REGISTER_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Pharmacy details reducer
export const pharmacyDetailsReducer = (state = { pharmacy: {} }, action) => {
    switch (action.type) {
        case PHARMACY_DETAILS_REQUEST:
            return {
                loading: true,
                ...state
            };
        case PHARMACY_DETAILS_SUCCESS:
            return {
                loading: false,
                pharmacy: action.payload
            };
        case PHARMACY_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// My pharmacy reducer
export const myPharmacyReducer = (state = { pharmacy: {} }, action) => {
    switch (action.type) {
        case MY_PHARMACY_REQUEST:
            return {
                loading: true,
                ...state
            };
        case MY_PHARMACY_SUCCESS:
            return {
                loading: false,
                pharmacy: action.payload
            };
        case MY_PHARMACY_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Pharmacy update reducer
export const pharmacyUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case PHARMACY_UPDATE_REQUEST:
            return {
                loading: true
            };
        case PHARMACY_UPDATE_SUCCESS:
            return {
                loading: false,
                isUpdated: action.payload.success
            };
        case PHARMACY_UPDATE_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Pharmacy stats reducer
export const pharmacyStatsReducer = (state = { stats: {} }, action) => {
    switch (action.type) {
        case PHARMACY_STATS_REQUEST:
            return {
                loading: true,
                ...state
            };
        case PHARMACY_STATS_SUCCESS:
            return {
                loading: false,
                stats: action.payload
            };
        case PHARMACY_STATS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Pharmacy medicines reducer
export const pharmacyMedicinesReducer = (state = { medicines: [], pagination: {} }, action) => {
    switch (action.type) {
        case PHARMACY_MEDICINES_REQUEST:
            return {
                loading: true,
                ...state
            };
        case PHARMACY_MEDICINES_SUCCESS:
            return {
                loading: false,
                medicines: action.payload.medicines,
                pagination: action.payload.pagination
            };
        case PHARMACY_MEDICINES_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Medicine operations reducer
export const medicineOperationReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_MEDICINE_REQUEST:
        case UPDATE_MEDICINE_REQUEST:
        case DELETE_MEDICINE_REQUEST:
        case BULK_UPLOAD_MEDICINES_REQUEST:
            return {
                loading: true
            };
        case ADD_MEDICINE_SUCCESS:
            return {
                loading: false,
                success: true,
                medicine: action.payload.medicine
            };
        case UPDATE_MEDICINE_SUCCESS:
            return {
                loading: false,
                isUpdated: true,
                medicine: action.payload.medicine
            };
        case DELETE_MEDICINE_SUCCESS:
            return {
                loading: false,
                isDeleted: true,
                message: action.payload.message
            };
        case BULK_UPLOAD_MEDICINES_SUCCESS:
            return {
                loading: false,
                success: true,
                medicines: action.payload.medicines,
                message: action.payload.message
            };
        case ADD_MEDICINE_FAIL:
        case UPDATE_MEDICINE_FAIL:
        case DELETE_MEDICINE_FAIL:
        case BULK_UPLOAD_MEDICINES_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Low stock medicines reducer
export const lowStockMedicinesReducer = (state = { medicines: [] }, action) => {
    switch (action.type) {
        case LOW_STOCK_MEDICINES_REQUEST:
            return {
                loading: true,
                ...state
            };
        case LOW_STOCK_MEDICINES_SUCCESS:
            return {
                loading: false,
                medicines: action.payload
            };
        case LOW_STOCK_MEDICINES_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Expiring medicines reducer
export const expiringMedicinesReducer = (state = { medicines: [] }, action) => {
    switch (action.type) {
        case EXPIRING_MEDICINES_REQUEST:
            return {
                loading: true,
                ...state
            };
        case EXPIRING_MEDICINES_SUCCESS:
            return {
                loading: false,
                medicines: action.payload
            };
        case EXPIRING_MEDICINES_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Pharmacy orders reducer
export const pharmacyOrdersReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case PHARMACY_ORDERS_REQUEST:
            return {
                loading: true,
                ...state
            };
        case PHARMACY_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            };
        case PHARMACY_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};
