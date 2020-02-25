import React, { createContext, useRef, useEffect, useReducer } from 'react'
import L from './leaflet'
import TileLayer from './TileLayer'
import 'assets/scss/leaflet.scss'

export const MapContext = createContext(null)

function BaseMap({ children }) {
	const [, forceUpdate] = useReducer(x => x + 1, 0)

	const mapEl = useRef(null)
	const mapRef = useRef(null)

	useEffect(() => {
		console.log('BaseMap useEffect')
		if (!mapRef.current) {
			mapRef.current = L.map(mapEl.current, {
				center: [36.37706783983682, 127.84240722656251],
				zoom: 7,
				minZoom: 6,
				maxBounds: L.latLngBounds(
					L.latLng(32.129105, 123.991699),
					L.latLng(39.707187, 132.956543)
				).pad(1.05),
			})
			forceUpdate()
		}
		return () => {
			console.log('BaseMap cleanup')
			mapRef.current.remove()
			mapRef.current = null
		}
	}, [forceUpdate])

	console.log('BaseMap Render')
	return (
		<div style={{ width: '100vw', height: '100vh' }} ref={mapEl}>
			{mapRef.current && (
				<MapContext.Provider value={mapRef.current}>
					<TileLayer />
					{children}
				</MapContext.Provider>
			)}
		</div>
	)
}

export default BaseMap
