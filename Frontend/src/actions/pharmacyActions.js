import axios from '../axios';
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

// Quick pharmacy setup for testing
export const quickPharmacySetup = () => async (dispatch) => {
    try {
        dispatch({ type: PHARMACY_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post('/pharmacy/quick-setup', {}, config);

        dispatch({
            type: PHARMACY_REGISTER_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PHARMACY_REGISTER_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Register pharmacy
export const registerPharmacy = (pharmacyData) => async (dispatch) => {
    try {
        dispatch({ type: PHARMACY_REGISTER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const { data } = await axios.post('/pharmacy/register', pharmacyData, config);

        dispatch({
            type: PHARMACY_REGISTER_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PHARMACY_REGISTER_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get pharmacy details
export const getPharmacyDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PHARMACY_DETAILS_REQUEST });

        const { data } = await axios.get(`/pharmacy/${id}`);

        dispatch({
            type: PHARMACY_DETAILS_SUCCESS,
            payload: data.pharmacy
        });
    } catch (error) {
        dispatch({
            type: PHARMACY_DETAILS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get my pharmacy
export const getMyPharmacy = () => async (dispatch) => {
    try {
        dispatch({ type: MY_PHARMACY_REQUEST });

        const { data } = await axios.get('/pharmacy/my');

        dispatch({
            type: MY_PHARMACY_SUCCESS,
            payload: data.pharmacy
        });
    } catch (error) {
        dispatch({
            type: MY_PHARMACY_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Update pharmacy
export const updatePharmacy = (pharmacyData) => async (dispatch) => {
    try {
        dispatch({ type: PHARMACY_UPDATE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const { data } = await axios.put('/pharmacy/my', pharmacyData, config);

        dispatch({
            type: PHARMACY_UPDATE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PHARMACY_UPDATE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get pharmacy stats
export const getPharmacyStats = () => async (dispatch) => {
    try {
        dispatch({ type: PHARMACY_STATS_REQUEST });

        const { data } = await axios.get('/pharmacy/stats');

        dispatch({
            type: PHARMACY_STATS_SUCCESS,
            payload: data.stats
        });
    } catch (error) {
        dispatch({
            type: PHARMACY_STATS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get pharmacy medicines
export const getPharmacyMedicines = (params = {}) => async (dispatch) => {
    try {
        dispatch({ type: PHARMACY_MEDICINES_REQUEST });

        const queryString = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/pharmacy/medicines/search?${queryString}`);

        dispatch({
            type: PHARMACY_MEDICINES_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: PHARMACY_MEDICINES_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Add medicine
export const addMedicine = (medicineData) => async (dispatch) => {
    try {
        dispatch({ type: ADD_MEDICINE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const { data } = await axios.post('/pharmacy/medicines', medicineData, config);

        dispatch({
            type: ADD_MEDICINE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ADD_MEDICINE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Update medicine
export const updateMedicine = (id, medicineData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_MEDICINE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const { data } = await axios.put(`/pharmacy/medicine/${id}`, medicineData, config);

        dispatch({
            type: UPDATE_MEDICINE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: UPDATE_MEDICINE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Delete medicine
export const deleteMedicine = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_MEDICINE_REQUEST });

        const { data } = await axios.delete(`/pharmacy/medicine/${id}`);

        dispatch({
            type: DELETE_MEDICINE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: DELETE_MEDICINE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Bulk upload medicines
export const bulkUploadMedicines = (medicines) => async (dispatch) => {
    try {
        dispatch({ type: BULK_UPLOAD_MEDICINES_REQUEST });

        const { data } = await axios.post('/pharmacy/medicines/bulk-upload', { medicines });

        dispatch({
            type: BULK_UPLOAD_MEDICINES_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: BULK_UPLOAD_MEDICINES_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get low stock medicines
export const getLowStockMedicines = () => async (dispatch) => {
    try {
        dispatch({ type: LOW_STOCK_MEDICINES_REQUEST });

        const { data } = await axios.get('/pharmacy/medicines/low-stock');

        dispatch({
            type: LOW_STOCK_MEDICINES_SUCCESS,
            payload: data.medicines
        });
    } catch (error) {
        dispatch({
            type: LOW_STOCK_MEDICINES_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get expiring medicines
export const getExpiringMedicines = (days = 30) => async (dispatch) => {
    try {
        dispatch({ type: EXPIRING_MEDICINES_REQUEST });

        const { data } = await axios.get(`/pharmacy/medicines/expiring?days=${days}`);

        dispatch({
            type: EXPIRING_MEDICINES_SUCCESS,
            payload: data.medicines
        });
    } catch (error) {
        dispatch({
            type: EXPIRING_MEDICINES_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get pharmacy orders
export const getPharmacyOrders = () => async (dispatch) => {
    try {
        dispatch({ type: PHARMACY_ORDERS_REQUEST });

        const { data } = await axios.get('/pharmacy/orders');

        dispatch({
            type: PHARMACY_ORDERS_SUCCESS,
            payload: data.orders
        });
    } catch (error) {
        dispatch({
            type: PHARMACY_ORDERS_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
