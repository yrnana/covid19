import { useEffect, useContext, useRef, memo } from 'react'
import L from './leaflet'
import { MarkerClusterGroup } from 'leaflet.markercluster/src'
import { MapContext } from './BaseMap'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import './Marker.scss'

function MarkerGroup({ paths }) {
	const map = useContext(MapContext)
	const markerGroupRef = useRef(null)

	useEffect(() => {
		console.count('MarkerGroup useEffect', paths.length)
		if (paths.length > 0) {
			const clusterOpts = { showCoverageOnHover: false }
			markerGroupRef.current = (options => new MarkerClusterGroup(options))(clusterOpts)
			paths.forEach(path => {
				let patient_number = path.patient_number
				let idx = patient_number.search(/\d/)
				if (idx === 0) {
					patient_number = '#' + patient_number
				} else {
					patient_number =
						patient_number.substring(0, idx) + '#' + patient_number.substring(idx)
				}
				const latlng = path.coordinates
				const myIcon = L.divIcon({
					iconSize: [40, 40],
					html: patient_number,
					className: `c-div-icon status-${path.status}`,
				})
				const options = { radius: 15, icon: myIcon }
				const popup =
					`<div class="c-popup-wrap">` +
					`<div class="c-popup-date">${path.date}</div>` +
					`<div class="c-popup-num">${patient_number}</div></div>` +
					`<div class="c-popup-loc">${path.location_desc}</div>`
				const popupOptions = { className: 'c-popup', minWidth: 100, closeButton: false }
				const customMarker = L.marker(latlng, options).bindPopup(popup, popupOptions)
				markerGroupRef.current.addLayer(customMarker)
			})
			map.addLayer(markerGroupRef.current)
		}

		return () => {
			console.count('MarkerGroup cleanup')
			if (map && markerGroupRef.current) {
				markerGroupRef.current.remove()
			}
		}
	}, [map, paths])

	console.count('MarkerGroup Render')
	return null
}

export default memo(MarkerGroup)
