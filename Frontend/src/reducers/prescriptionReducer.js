import {
    CREATE_PRESCRIPTION_REQUEST,
    CREATE_PRESCRIPTION_SUCCESS,
    CREATE_PRESCRIPTION_FAIL,
    GET_PRESCRIPTIONS_REQUEST,
    GET_PRESCRIPTIONS_SUCCESS,
    GET_PRESCRIPTIONS_FAIL,
    CLEAR_ERRORS,
} from '../constants/prescriptionConstants';

export const prescriptionReducer = (state = { prescriptions: [] }, action) => {
    switch (action.type) {
        case CREATE_PRESCRIPTION_REQUEST:
        case GET_PRESCRIPTIONS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case CREATE_PRESCRIPTION_SUCCESS:
            return {
                ...state,
                loading: false,
                prescriptions: [...state.prescriptions, action.payload],
            };

        case GET_PRESCRIPTIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                prescriptions: action.payload,
            };

        case CREATE_PRESCRIPTION_FAIL:
        case GET_PRESCRIPTIONS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};