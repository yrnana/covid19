import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, Box, Paper, Divider } from '@material-ui/core'
import AddPathForm from 'features/admin/AddPathForm'
import PathListView from 'features/admin/PathListView'

function AdminPage() {
	const [paths, setPaths] = useState(null)

	useEffect(() => {
		async function fetch() {
			// 전체 경로 불러옴
			const { data } = await axios.get('/api/path')
			setPaths(data)
		}
		fetch()
	}, [])

	return (
		<Container maxWidth="sm">
			<Box component={Paper} my={2} p={2}>
				<AddPathForm setPaths={setPaths} />
				<Divider light style={{ marginTop: 16, marginBottom: 16 }} />
				{paths && <PathListView paths={paths} setPaths={setPaths} />}
			</Box>
		</Container>
	)
}

export default AdminPage
