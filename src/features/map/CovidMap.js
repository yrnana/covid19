import React, { useState, useEffect } from 'react'
import axios from 'axios'
import BaseMap from './BaseMap'
import MarkerGroup from './MarkerGroup'

function CovidMap() {
	const [paths, setPaths] = useState([])

	useEffect(() => {
		async function fetch() {
			const { data } = await axios.get('/api/path')
			setPaths(data)
		}
		fetch()
	}, [])

	return (
		<BaseMap>
			<MarkerGroup paths={paths} />
		</BaseMap>
	)
}

export default CovidMap
