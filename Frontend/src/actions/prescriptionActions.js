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
            headers: { "Content-Type": "application/json" }
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
            payload: error.response?.data?.message || 'Failed to create prescription',
        });
    }
};

export const getPrescriptions = () => async (dispatch) => {
    try {
        console.log('Dispatching GET_PRESCRIPTIONS_REQUEST');
        dispatch({ type: GET_PRESCRIPTIONS_REQUEST });

        console.log('Making API call to /prescriptions');
        const { data } = await axios.get('/prescriptions');
        console.log('API response:', data);

        dispatch({
            type: GET_PRESCRIPTIONS_SUCCESS,
            payload: data.prescriptions || [],
        });

        return data.prescriptions?.[0];
    } catch (error) {
        console.error('Error in getPrescriptions:', error);
        dispatch({
            type: GET_PRESCRIPTIONS_FAIL,
            payload: error.response?.data?.message || 'Failed to fetch prescriptions',
        });
    }
};

export const getSinglePrescription = (appointmentId) => async () => {
    try {
        const config = {
            headers: { "Content-Type": "application/json" }
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