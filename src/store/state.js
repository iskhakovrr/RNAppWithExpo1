import {configureStore} from "@reduxjs/toolkit";

import matchMediaReducer from "./reducers/matchMedia/matchMedia";
import user from "./reducers/user/user";
import cars from "./reducers/cars/cars";
import token from "./reducers/token/token";
import statusBar from "./reducers/statusBar/statusBar";
import deviceToken from "./reducers/deviceToken/deviceToken";
import mainModalIsOpen from "./reducers/mainModal/setMainModalIsOpen";
import successModalIsOpen from "./reducers/successModal/setSuccessModalIsOpen";
import usedCarsSavedState from "./reducers/usedCarsSavedState/usedCarsSavedState";

const store = configureStore({
    // Automatically calls `combineReducers`
    reducer: {
        isTablet: matchMediaReducer,
        user: user,
        cars: cars,
        tokens: token,
        statusBar: statusBar,
        deviceToken: deviceToken,
        mainModalIsOpen: mainModalIsOpen,
        successModalIsOpen: successModalIsOpen,
        usedCarsSavedState: usedCarsSavedState
    }
})

export default store