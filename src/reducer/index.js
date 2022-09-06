import { combineReducers } from "redux";
import reducer from "./reducer"
import historyReducer from "./historyReducer"

export default combineReducers ({
    reducer, historyReducer
})