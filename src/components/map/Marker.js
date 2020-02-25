import { useContext, useEffect, useRef } from 'react'
import L from './leaflet'
import { MapContext } from './BaseMap'
import { format } from 'date-fns'
import 'assets/scss/marker.scss'

function Marker({ path }) {
	const map = useContext(MapContext)
	const markerRef = useRef(null)

	useEffect(() => {
		const latlng = path.location.coordinates.reverse()
		const options = { radius: 15 }
		const popup =
			`<div class="c-popup-wrap">` +
			`<div class="c-popup-date">${format(new Date(path.date), 'M.d')}</div>` +
			`<div class="c-popup-num">#${path.patient_number}</div></div>` +
			`<div class="c-popup-loc">${path.location_name}</div>`
		const popupOptions = { className: 'c-popup', minWidth: 100, closeButton: false }
		markerRef.current = L.circleMarker(latlng, options)
		markerRef.current.bindPopup(popup, popupOptions)
		markerRef.current.addTo(map)

		return function cleanup() {
			if (map && markerRef.current) {
				markerRef.current.remove()
			}
		}
	}, [map, path])

	return null
}

export default Marker
