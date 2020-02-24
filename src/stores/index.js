import { configureStore, combineReducers } from '@reduxjs/toolkit'
import map from './map'

// define rootReducer
const rootReducer = combineReducers({
	map,
})

// define store
const store = configureStore({
	reducer: rootReducer,
})

export default store
