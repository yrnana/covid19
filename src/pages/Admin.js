import React from 'react'
import { Container, Box, Paper, Divider } from '@material-ui/core'
import AddPathForm from 'features/admin/AddPathForm'
import PathListView from 'features/admin/PathListView'

function AdminPage() {
	return (
		<Container maxWidth="sm">
			<Box component={Paper} my={2} p={2}>
				<AddPathForm />
				<Divider light style={{ marginTop: 16, marginBottom: 16 }} />
				<PathListView />
			</Box>
		</Container>
	)
}

export default AdminPage
