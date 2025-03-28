import {
    CLEAR_ERRORS,
    LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS,
    LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS,
    LOGOUT_SUCCESS, LOGOUT_FAIL,
    REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS,
    UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAIL,
    GET_HISTORY_REQUEST, GET_HISTORY_SUCCESS, GET_HISTORY_FAIL
} from "../constants/userConstants";
import axios from '../axios';


export const login = (contact, password) => async (dispatch) => {
    try {
        dispatch({ type: LOGIN_REQUEST });
        const config = { 
            headers: { "Content-Type": "application/json" },
            withCredentials: true // Add this line
        };
        
        const { data } = await axios.post(
            `/login`,
            { contact, password },
            config
        );

        dispatch({ type: LOGIN_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
    }
}

export const register = (contact, password, name, role, speciality, availability) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });
        const config = { headers: { "Content-Type": "application/json" } }
        
        const { data } = await axios.post(
            `/register`,
            { contact, password, name, role },
            // { email, password, name, role, speciality, availability },
            config
        )

        dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user })
    } catch (error) {
        dispatch({ type: REGISTER_USER_FAIL, payload: error.response.data.message })
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        // dispatch({ type: LOAD_USER_REQUEST });
        const { data } = await axios.get(`/me`);
        dispatch({ type: LOAD_USER_SUCCESS, payload: data.user });
    } catch (error) {
        dispatch({ type: LOAD_USER_FAIL, payload: error.response.data.message });
    }
};

export const logout = () => async (dispatch) => {
    try {
        await axios.get(`/logout`)
        dispatch({ type: LOGOUT_SUCCESS })
    } catch (error) {
        dispatch({ type: LOGOUT_FAIL, payload: error.response.data.message })
    }
}

export const addMedicalHistory = (analysis, url) => async (dispatch) => {
    try {
        dispatch({ type: UPLOAD_REQUEST });
        
        const config = { 
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        };
        
        const { data } = await axios.post(
            `/medical-history`,
            { analysis, url },
            config
        );

        dispatch({ 
            type: UPLOAD_SUCCESS,
            payload: data.medicalHistory 
        });

        return data.medicalHistory; // Return for component use if needed
    } catch (error) {
        dispatch({ 
            type: UPLOAD_FAIL, 
            payload: error.response?.data?.message || "Failed to upload medical history"
        });
    }
};

export const getMedicalHistory = (userId) => async (dispatch) => {
    try {
        dispatch({ type: GET_HISTORY_REQUEST });
        
        const config = { 
            withCredentials: true 
        };
        
        const { data } = await axios.get(`/medical-history/${userId}`, config);

        dispatch({ 
            type: GET_HISTORY_SUCCESS,
            payload: data.medicalHistory 
        });

        return data.medicalHistory; // Return for component use if needed
    } catch (error) {
        dispatch({ 
            type: GET_HISTORY_FAIL, 
            payload: error.response?.data?.message || "Failed to fetch medical history"
        });
        throw error; // Re-throw for component error handling
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}