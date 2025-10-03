import { CREATE_APPOINTMENT_REQUEST, CREATE_APPOINTMENT_SUCCESS, CREATE_APPOINTMENT_FAIL, MY_APPOINTMENTS_REQUEST, MY_APPOINTMENTS_SUCCESS, MY_APPOINTMENTS_FAIL, ALL_DOCTORS_REQUEST, ALL_DOCTORS_SUCCESS, ALL_DOCTORS_FAIL, MARK_APPOINTMENT_COMPLETE_REQUEST, MARK_APPOINTMENT_COMPLETE_SUCCESS, MARK_APPOINTMENT_COMPLETE_FAIL, CLEAR_ERRORS } from "../constants/appointmentConstants";


export const newAppointmentReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_APPOINTMENT_REQUEST:
            return {
                ...state,
                loading: true
            }

        case CREATE_APPOINTMENT_SUCCESS:
            return {
                loading: false,
                appointment: action.payload,
            }

        case CREATE_APPOINTMENT_FAIL:
            return {
                loading: false,
                error: action.payload,
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const myAppointmentReducer = (state = { appointments: [] }, action) => {
    switch (action.type) {
        case MY_APPOINTMENTS_REQUEST:
            return {
                loading: true
            }

        case MY_APPOINTMENTS_SUCCESS:
            return {
                loading: false,
                appointments: action.payload
            }

        case MY_APPOINTMENTS_FAIL:
            return {
                loading: false,
                error: action.payload,
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

// export const allAppointmentReducer = (state = { appointments: [] }, action) => {
//     switch (action.type) {
//         case ALL_APPOINTMENTS_REQUEST:
//             return {
//                 loading: true
//             }

//         case ALL_APPOINTMENTS_SUCCESS:
//             return {
//                 loading: false,
//                 orders: action.payload,
//             }

//         case ALL_APPOINTMENTS_FAIL:
//             return {
//                 loading: false,
//                 error: action.payload,
//             }

//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null
//             }

//         default:
//             return state;
//     }
// }

export const allDoctorsReducer = (state = { doctors: [] }, action) => {
    switch (action.type) {
        case ALL_DOCTORS_REQUEST:
            return {
                loading: true
            }

        case ALL_DOCTORS_SUCCESS:
            return {
                loading: false,
                doctors: action.payload,
            }

        case ALL_DOCTORS_FAIL:
            return {
                loading: false,
                error: action.payload,
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const availableSlotsReducer = (state = { availableSlots: [], loading: false }, action) => {
    switch (action.type) {
        case 'GET_AVAILABLE_SLOTS_REQUEST':
            return {
                ...state,
                loading: true
            }

        case 'GET_AVAILABLE_SLOTS_SUCCESS':
            return {
                loading: false,
                availableSlots: action.payload.availableSlots,
                doctor: action.payload.doctor,
                date: action.payload.date
            }

        case 'GET_AVAILABLE_SLOTS_FAIL':
            return {
                loading: false,
                error: action.payload,
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const appointmentCompleteReducer = (state = {}, action) => {
    switch (action.type) {
        case MARK_APPOINTMENT_COMPLETE_REQUEST:
            return {
                ...state,
                loading: true
            }

        case MARK_APPOINTMENT_COMPLETE_SUCCESS:
            return {
                loading: false,
                success: true,
                message: action.payload.message
            }

        case MARK_APPOINTMENT_COMPLETE_FAIL:
            return {
                loading: false,
                error: action.payload,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const followUpReducer = (state = {}, action) => {
    switch (action.type) {
        case 'SCHEDULE_FOLLOWUP_REQUEST':
            return {
                ...state,
                loading: true
            }

        case 'SCHEDULE_FOLLOWUP_SUCCESS':
            return {
                loading: false,
                success: true,
                followUpAppointment: action.payload.followUpAppointment,
                message: action.payload.message
            }

        case 'SCHEDULE_FOLLOWUP_FAIL':
            return {
                loading: false,
                error: action.payload,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

// export const appointmentDetailsReducer = (state = { appointments: {} }, action) => {
//     switch (action.type) {
//         case APPOINTMENT_DETAILS_REQUEST:
//             return {
//                 loading: true,
//             };

//         case APPOINTMENT_DETAILS_SUCCESS:
//             return {
//                 loading: false,
//                 order: action.payload,
//             };

//         case APPOINTMENT_DETAILS_FAIL:
//             return {
//                 loading: false,
//                 error: action.payload,
//             };
//         case CLEAR_ERRORS:
//             return {
//                 ...state,
//                 error: null,
//             };

//         default:
//             return state;
//     }
// };