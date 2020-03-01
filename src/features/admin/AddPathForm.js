import React, { useCallback, memo } from 'react'
import {
	Box,
	TextField,
	Typography,
	Grid,
	Button,
	FormControlLabel,
	Checkbox,
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { format } from 'date-fns'
import axios from 'axios'

function AddPathForm({ setPaths }) {
	const { register, handleSubmit, reset, control } = useForm()

	const onSubmit = useCallback(
		async values => {
			const { patient_number, date, latitude, longitude } = values
			const { data } = await axios.post('/api/path', {
				...values,
				patient_number: patient_number,
				latitude: parseFloat(latitude),
				longitude: parseFloat(longitude),
			})
			reset({ patient_number, date })
			setPaths(paths => [...paths, data])
		},
		[reset, setPaths]
	)

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				확진자 이동경로 추가
			</Typography>
			<Grid component="form" container spacing={2} onSubmit={handleSubmit(onSubmit)}>
				<Grid container item xs={12} spacing={2}>
					<Grid item xs={5} sm={3}>
						<TextField
							label="확진자 번호"
							name="patient_number"
							fullWidth
							defaultValue="1"
							inputRef={register}
						/>
					</Grid>
					<Grid item xs={7} sm={4}>
						<TextField
							type="date"
							label="방문 날짜"
							name="date"
							fullWidth
							defaultValue={format(new Date(), 'yyyy-MM-dd')}
							InputLabelProps={{ shrink: true }}
							inputRef={register}
						/>
					</Grid>
				</Grid>
				<Grid container item xs={12} spacing={2}>
					<Grid item xs={12} sm={6}>
						<TextField
							label="장소 설명"
							name="location_desc"
							required
							fullWidth
							inputRef={register}
						/>
					</Grid>
					<Grid item xs={6} sm={3}>
						<TextField
							type="number"
							label="latitude"
							name="latitude"
							required
							fullWidth
							inputProps={{ step: 'any', min: -90, max: 90 }}
							inputRef={register}
						/>
					</Grid>
					<Grid item xs={6} sm={3}>
						<TextField
							type="number"
							label="longitude"
							name="longitude"
							required
							fullWidth
							inputProps={{ step: 'any', min: -180, max: 180 }}
							inputRef={register}
						/>
					</Grid>
					<Grid item xs={4} sm={2}>
						<Button
							type="submit"
							color="primary"
							variant="contained"
							fullWidth
							disableElevation
						>
							등록
						</Button>
					</Grid>
					<Grid item xs={8} sm={10}>
						<Controller
							as={
								<FormControlLabel
									control={<Checkbox name="is_hospital" />}
									label="격리병원 여부"
								/>
							}
							name="is_hospital"
							value="is_hospital"
							control={control}
							defaultValue={false}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
}

export default memo(AddPathForm)
