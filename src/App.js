import React, { lazy, Suspense } from 'react'
import { CircularProgress, Box } from '@material-ui/core'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

const Home = lazy(() => import('./pages/Home'))
const Admin = lazy(() => import('./pages/Admin'))

const Loading = () => (
	<Box position="relative" display="flex" alignItems="center" justifyContent="center">
		<CircularProgress />
	</Box>
)

const App = () => {
	return (
		<Router>
			<Suspense fallback={<Loading />}>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/admin" component={Admin} />
				</Switch>
			</Suspense>
		</Router>
	)
}

export default App
