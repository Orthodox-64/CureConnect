import { thunk } from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';  // redux-persist for storing data in state

import { allUsersReducer, profileReducer, userDetailsReducer, userReducer } from './reducers/userReducer';
import { allDoctorsReducer, newAppointmentReducer, myAppointmentReducer } from './reducers/appointmentReducer';
import { prescriptionReducer } from './reducers/prescriptionReducer';

const persistConfig = {
    key: 'root',
    storage,
}

const persistCombineReducer = combineReducers({
    user: userReducer,
    profile: profileReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    newAppointment: newAppointmentReducer,
    myAppointment: myAppointmentReducer,
    // appointmentDetails: appointmentDetailsReducer,
    // allAppointment: allAppointmentReducer,
    allDoctors: allDoctorsReducer,
    prescription: prescriptionReducer,
}); // To combine multiple reducers in one

const persistedReducer = persistReducer(persistConfig, persistCombineReducer)

let initialState = {};
const middleware = [thunk];

export const persistReduxStore = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
// export const persistor = persistStore(persistReduxStore);