import {
    CLEAR_ERRORS,
    LOAD_USER_FAIL, LOAD_USER_SUCCESS,
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
            headers: { "Content-Type": "application/json" }
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

export const register = (contact, password, name, role, speciality, availability, avatar) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('contact', contact);
        formData.append('password', password);
        formData.append('role', role);
        
        if (role === 'doctor') {
            if (speciality) formData.append('speciality', speciality);
            if (availability !== undefined) formData.append('availability', availability);
            if (avatar) {
                formData.append('avatar', JSON.stringify(avatar));
            }
        }
        
        const config = { 
            headers: { "Content-Type": "multipart/form-data" } 
        }
        
        const { data } = await axios.post(
            `/register`,
            formData,
            config
        )

        dispatch({ type: REGISTER_USER_SUCCESS, payload: data.user })
    } catch (error) {
        dispatch({ type: REGISTER_USER_FAIL, payload: error.response.data.message })
    }
}

export const loadUser = () => async (dispatch) => {
    try {
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
            headers: { "Content-Type": "application/json" }
        };

        // Determine if the URL is for a video
        const isVideo = url.includes('video') || url.includes('.mp4') || url.includes('.mov');
        
        const { data } = await axios.post(
            `/medical-history`,
            { 
                analysis, 
                url,
                type: isVideo ? 'video' : 'image'  // Add type field to distinguish between video and image
            },
            config
        );

        dispatch({ 
            type: UPLOAD_SUCCESS,
            payload: data.medicalHistory 
        });

        return data.medicalHistory;
    } catch (error) {
        dispatch({ 
            type: UPLOAD_FAIL, 
            payload: error.response?.data?.message || "Failed to upload medical history"
        });
        throw error; // Re-throw for component error handling
    }
};

export const getMedicalHistory = (userId) => async (dispatch) => {
    try {
        dispatch({ type: GET_HISTORY_REQUEST });
        
        const { data } = await axios.get(`/medical-history/${userId}`);

        // Process the medical history to ensure proper URL handling
        const processedHistory = data.medicalHistory.map(record => ({
            ...record,
            image: {
                ...record.image,
                url: record.image?.url || record.url, // Handle both old and new URL formats
                type: record.image?.type || (record.url?.includes('video') ? 'video' : 'image')
            }
        }));

        dispatch({ 
            type: GET_HISTORY_SUCCESS,
            payload: processedHistory 
        });

        return processedHistory;
    } catch (error) {
        dispatch({ 
            type: GET_HISTORY_FAIL, 
            payload: error.response?.data?.message || "Failed to fetch medical history"
        });
        throw error;
    }
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}