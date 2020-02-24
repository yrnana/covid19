import 'leaflet/dist/leaflet.css'
import React, { useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import L from 'leaflet'

const useStyles = makeStyles({
	container: {
		width: '100wh',
		height: '100vh',
	},
})

function CovidMap() {
	const classes = useStyles()

	const mapEl = useRef(null)
	const mapRef = useRef(null)

	useEffect(() => {
		mapRef.current = L.map(mapEl.current, {
			center: [36.37706783983682, 127.84240722656251],
			zoom: 7,
			minZoom: 6,
			maxBounds: L.latLngBounds(
				L.latLng(32.129105, 123.991699),
				L.latLng(39.707187, 132.956543)
			).pad(1.1),
			layers: [
				L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution:
						'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
				}),
			],
		})

		return function cleanup() {
			if (mapRef.current) {
				mapRef.current.off()
				mapRef.current.remove()
			}
		}
	}, [])

	return <div className={classes.container} ref={mapEl}></div>
}

export default CovidMap
