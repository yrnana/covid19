import React, { memo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, List, ListItem, IconButton } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import DeleteIcon from '@material-ui/icons/Delete'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import axios from 'axios'
import { differenceBy, pick } from 'lodash'

const useStyles = makeStyles(theme => ({
	listItem: {
		cursor: 'pointer',
	},
	iconButton: {
		margin: -14,
		marginLeft: 0,
	},
}))

const DragHandle = sortableHandle(() => <MenuIcon color="action" />)

const SortableItem = sortableElement(({ path, deletePath }) => {
	const classes = useStyles()

	return (
		<ListItem disableGutters divider className={classes.listItem}>
			<DragHandle />
			<Box mx={1.5} width={35} fontWeight={600}>
				{path.date}
			</Box>
			<Box mr="auto">{path.location_desc}</Box>
			<IconButton
				onClick={() => deletePath(path._id)}
				className={classes.iconButton}
				aria-label="delete"
			>
				<DeleteIcon />
			</IconButton>
		</ListItem>
	)
})

const SortableContainer = sortableContainer(({ children }) => {
	return (
		<Box component={List} mt={2}>
			{children}
		</Box>
	)
})

function PathList({ paths, setPaths }) {
	// 드래그 완료시 서버로 현재 순서 전송
	const onSortEnd = async ({ oldIndex, newIndex }) => {
		const array = [...paths]
		const startIndex = newIndex < 0 ? array.length + newIndex : newIndex
		const item = array.splice(oldIndex, 1)[0]
		array.splice(startIndex, 0, item)
		const data = array.map((path, i) => ({ ...path, order: i + 1 }))

		// path를 바꿈
		setPaths(paths => {
			const newPaths = differenceBy(paths, data, '_id')
			return newPaths.concat(data)
		})

		// 서버에 전송
		await axios.patch(
			'/api/path',
			data.map(x => pick(x, ['_id', 'order']))
		)
	}

	// 삭제
	const deletePath = useCallback(
		async _id => {
			if (window.confirm('이 경로를 삭제하시겠습니까?')) {
				await axios.delete(`/api/path/${_id}`)
				setPaths(paths => {
					const idx = paths.findIndex(x => x._id === _id)
					return [...paths.slice(0, idx), ...paths.slice(idx + 1)]
				})
			}
		},
		[setPaths]
	)

	return (
		<SortableContainer onSortEnd={onSortEnd} useDragHandle>
			{paths.map((path, index) => (
				<SortableItem key={path._id} index={index} path={path} deletePath={deletePath} />
			))}
		</SortableContainer>
	)
}

export default memo(PathList)
