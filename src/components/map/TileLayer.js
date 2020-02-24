import { useContext, useEffect, useRef } from 'react'
import L from './leaflet'
import { MapContext } from './BaseMap'

function TileLayer() {
	const map = useContext(MapContext)
	const layerRef = useRef(null)

	useEffect(() => {
		layerRef.current = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map)

		return function cleanup() {
			if (map && layerRef.current) {
				layerRef.current.remove()
			}
		}
	}, [map])

	return null
}

export default TileLayer
