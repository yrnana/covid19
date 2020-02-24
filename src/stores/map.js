import { createAction, createReducer } from '@reduxjs/toolkit'

export const setMap = createAction('counter/SET_MAP')

const initialState = {
	instance: null,
}

const counter = createReducer(initialState, {
	[setMap]: (state, action) => ({ instance: action.payload }),
})

export default counter
