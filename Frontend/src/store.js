import { thunk } from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';  // redux-persist for storing data in state

import { allUsersReducer, profileReducer, userDetailsReducer, userReducer } from './reducers/userReducer';
import { allDoctorsReducer, newAppointmentReducer, myAppointmentReducer, availableSlotsReducer, appointmentCompleteReducer } from './reducers/appointmentReducer';
import { prescriptionReducer } from './reducers/prescriptionReducer';
import { 
    pharmacyRegisterReducer, 
    pharmacyDetailsReducer, 
    myPharmacyReducer, 
    pharmacyUpdateReducer, 
    pharmacyStatsReducer,
    pharmacyMedicinesReducer,
    medicineOperationReducer,
    lowStockMedicinesReducer,
    expiringMedicinesReducer,
    pharmacyOrdersReducer
} from './reducers/pharmacyReducers';

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
    availableSlots: availableSlotsReducer,
    appointmentComplete: appointmentCompleteReducer,
    prescription: prescriptionReducer,
    // Pharmacy reducers
    pharmacyRegister: pharmacyRegisterReducer,
    pharmacyDetails: pharmacyDetailsReducer,
    myPharmacy: myPharmacyReducer,
    pharmacyUpdate: pharmacyUpdateReducer,
    pharmacyStats: pharmacyStatsReducer,
    pharmacyMedicines: pharmacyMedicinesReducer,
    medicineOperation: medicineOperationReducer,
    lowStockMedicines: lowStockMedicinesReducer,
    expiringMedicines: expiringMedicinesReducer,
    pharmacyOrders: pharmacyOrdersReducer,
}); // To combine multiple reducers in one

const persistedReducer = persistReducer(persistConfig, persistCombineReducer)

let initialState = {};
const middleware = [thunk];

export const persistReduxStore = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
// export const persistor = persistStore(persistReduxStore);