import {
    CLEAR_ERRORS,
    LOAD_USER_FAIL, LOAD_USER_REQUEST, LOAD_USER_SUCCESS,
    LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS,
    LOGOUT_SUCCESS, LOGOUT_FAIL,
    REGISTER_USER_FAIL, REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS
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

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}