import axios from '../axios';
import {
    CREATE_PRESCRIPTION_REQUEST,
    CREATE_PRESCRIPTION_SUCCESS,
    CREATE_PRESCRIPTION_FAIL,
    GET_PRESCRIPTIONS_REQUEST,
    GET_PRESCRIPTIONS_SUCCESS,
    GET_PRESCRIPTIONS_FAIL,
    CLEAR_ERRORS,
} from '../constants/prescriptionConstants';

export const createPrescription = (prescriptionData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_PRESCRIPTION_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        };

        const { data } = await axios.post(
            `/prescription/new`,
            prescriptionData,
            config
        );

        dispatch({
            type: CREATE_PRESCRIPTION_SUCCESS,
            payload: data.prescription,
        });
    } catch (error) {
        dispatch({
            type: CREATE_PRESCRIPTION_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const getPrescriptions = () => async (dispatch) => {
    try {
        dispatch({ type: GET_PRESCRIPTIONS_REQUEST });

        const { data } = await axios.get('/prescriptions');

        dispatch({
            type: GET_PRESCRIPTIONS_SUCCESS,
            payload: data.prescriptions,
        });

        return data.prescriptions[0];
    } catch (error) {
        dispatch({
            type: GET_PRESCRIPTIONS_FAIL,
            payload: error.response.data.message,
        });
    }
};

export const getSinglePrescription = (appointmentId) => async (dispatch) => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        };

        const { data } = await axios.get(`/prescription/${appointmentId}`, config);
        return data.prescription;
    } catch (error) {
        console.error('Error fetching prescription:', error);
        throw error;
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};