import React, { useCallback } from 'react'
import { Box, TextField, Typography, Grid, Button } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import axios from 'axios'

function AddPathForm() {
	const { register, handleSubmit, reset } = useForm()

	const onSubmit = useCallback(
		async values => {
			await axios.post('/api/add', values)
			reset({ date: values.date })
		},
		[reset]
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
							type="number"
							label="확진자 번호"
							name="patient_number"
							fullWidth
							defaultValue={1}
							inputProps={{ min: 1 }}
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
							name="location_name"
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
							inputProps={{ step: 'any' }}
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
							inputProps={{ step: 'any' }}
							inputRef={register}
						/>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Button type="submit" color="primary" variant="contained">
						등록
					</Button>
				</Grid>
			</Grid>
		</Box>
	)
}

export default AddPathForm
