import React, { useState, useEffect, useMemo } from 'react'
import { Select, MenuItem } from '@material-ui/core'
import axios from 'axios'
import { countBy } from 'lodash'
import PathList from './PathList'

function PathListView() {
	const [paths, setPaths] = useState([])
	const [patientNumber, setPatientNumber] = React.useState('')

	useEffect(() => {
		async function fetch() {
			// 전체 경로 불러옴
			const { data } = await axios.get('/api/path')
			setPaths(data)
			if (data.length > 0) {
				// 경로 첫번째 데이터의 확진자 번호를 select의 확진자번호로 설정
				setPatientNumber(data[0].patient_number)
			}
		}
		fetch()
	}, [])

	// handle select change
	const handleChange = event => {
		setPatientNumber(parseInt(event.target.value))
	}

	// select 메뉴
	const patientNumbers = useMemo(() => {
		const group = countBy(paths, 'patient_number')
		return Object.keys(group)
	}, [paths])

	// select의 확진자번호에 해당하는 paths
	const selectedPaths = useMemo(() => {
		return paths.filter(path => path.patient_number === patientNumber)
	}, [paths, patientNumber])

	return (
		<div>
			<Select
				labelId="select-patient-number-label"
				id="select-patient-number"
				value={patientNumber}
				onChange={handleChange}
			>
				{patientNumbers.map(num => (
					<MenuItem key={num} value={num}>
						{num}번 확진자
					</MenuItem>
				))}
			</Select>
			<PathList paths={selectedPaths} setPaths={setPaths} />
		</div>
	)
}

export default PathListView
