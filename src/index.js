import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'

// redux
import store from './store'
import { Provider } from 'react-redux'

// material
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { purple, blue } from '@material-ui/core/colors'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: purple,
	},
	typography: {
		fontFamily: "'Noto Sans KR', sans-serif",
		fontWeightMedium: 600,
	},
})

ReactDOM.render(
	<Provider store={store}>
		<ThemeProvider theme={theme}>
			<App />
			<CssBaseline />
		</ThemeProvider>
	</Provider>,
	document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
