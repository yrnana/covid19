import { useContext, useEffect, useRef } from 'react'
import L from './leaflet'
import { MapContext } from './BaseMap'

function Marker() {
	const map = useContext(MapContext)
	const markerRef = useRef(null)

	useEffect(() => {
		markerRef.current = L.marker([36.37706783983682, 127.84240722656251]).addTo(map)

		return function cleanup() {
			if (map && markerRef.current) {
				markerRef.current.remove()
			}
		}
	}, [map])

	return null
}

export default Marker
