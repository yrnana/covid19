import React, { useState, useMemo, useEffect } from 'react'
import { Box, Typography, Select, MenuItem } from '@material-ui/core'
import { countBy, sortBy, partition } from 'lodash'
import PathList from './PathList'

function PathListView({ paths, setPaths }) {
	// 경로 첫번째 데이터의 확진자 번호를 select의 확진자번호로 초기 설정
	const [patientNumber, setPatientNumber] = useState(paths[0].patient_number)

	// handle select change
	const handleChange = event => {
		setPatientNumber(event.target.value)
	}

	// select 메뉴 arr
	const patientNumbers = useMemo(() => {
		const group = Object.keys(countBy(paths, 'patient_number'))
		const [numbers, strings] = partition(group, s => /^\d+$/.test(s))
		return sortBy(numbers).concat(sortBy(strings))
	}, [paths])

	// select의 확진자번호에 해당하는 paths
	const selectedPaths = useMemo(() => {
		return paths.filter(path => path.patient_number === patientNumber)
	}, [paths, patientNumber])

	// select를 표출할 수 있는가 (patientNumber가 arr에 들어있는가)
	const isInclude = useMemo(() => {
		return patientNumbers.includes(patientNumber)
	}, [patientNumber, patientNumbers])

	// patientNumber 재조정
	useEffect(() => {
		if (!isInclude) {
			setPatientNumber(patientNumbers[0])
		}
	}, [isInclude, patientNumbers])

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				확진자 이동경로 순서 수정
			</Typography>
			{isInclude && (
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
			)}
			<PathList paths={selectedPaths} setPaths={setPaths} />
		</Box>
	)
}

export default PathListView
