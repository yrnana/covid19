import { configureStore, combineReducers } from '@reduxjs/toolkit'
import counter from './counter'

// define rootReducer
const rootReducer = combineReducers({
	counter,
})

// define store
const store = configureStore({
	reducer: rootReducer,
})

export default store
