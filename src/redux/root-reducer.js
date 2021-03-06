import {combineReducers} from "redux";
import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage';

import backendReducer from "./backend/backend.reducer";
import userReducer from "./user/user.reducer";
import tableReducer from "./table/table.reducer";
import reservationReducer from "./reservation/reservation.reducer";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: []
};

const rootReducer = combineReducers({
    backend: backendReducer,
    user: userReducer,
    table: tableReducer,
    reservation: reservationReducer
});

export default persistReducer(persistConfig, rootReducer);