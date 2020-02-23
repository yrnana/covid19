import { createAction, createReducer } from '@reduxjs/toolkit'

export const increase = createAction('counter/INCREASE')
export const decrease = createAction('counter/DECREASE')

const initialState = { count: 0 }

const counter = createReducer(initialState, {
	[increase]: state => ({ count: state.count + 1 }),
	[decrease]: state => ({ count: state.count - 1 }),
})

export default counter
