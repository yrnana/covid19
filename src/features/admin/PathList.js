import React, { memo, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, List, ListItem, IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import axios from 'axios'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

const ItemTypes = {
	PATH: 'PATH',
}

const useStyles = makeStyles(theme => ({
	listItem: {
		cursor: 'pointer',
	},
	iconButton: {
		margin: -14,
		marginLeft: 0,
	},
}))

function PathList({ paths, setPaths }) {
	// 드래그 할 때마다 순서를 바꾼다
	const updatePath = useCallback(
		(dragIndex, hoverIndex) => {
			setPaths(paths => {
				const dragged = paths.splice(dragIndex, 1)
				const front = paths.slice(0, hoverIndex)
				const back = paths.slice(hoverIndex)
				front.push(dragged[0])
				return front.concat(back)
			})
		},
		[setPaths]
	)

	// 드래그 완료시 서버로 현재 순서 전송
	const updatePaths = useCallback(async () => {
		const data = paths.map((path, i) => ({ _id: path._id, order: i + 1 }))
		await axios.patch('/api/path', data)
	}, [paths])

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
		<DndProvider backend={Backend}>
			<Box component={List} mt={2}>
				{paths.map((path, index) => (
					<PathItem
						key={path._id}
						index={index}
						path={path}
						updatePath={updatePath}
						updatePaths={updatePaths}
						deletePath={deletePath}
					/>
				))}
			</Box>
		</DndProvider>
	)
}

export default memo(PathList)

function PathItem({ path, index, updatePath, updatePaths, deletePath }) {
	const classes = useStyles()

	const ref = useRef(null)

	const [, drop] = useDrop({
		accept: ItemTypes.PATH,
		hover(item, monitor) {
			if (!ref.current) return

			const dragIndex = item.index
			const hoverIndex = index

			// Don't replace items with themselves
			if (dragIndex === hoverIndex) return

			const hoverBoundingRect = ref.current.getBoundingClientRect()
			const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
			const clientOffset = monitor.getClientOffset()
			const hoverClientY = clientOffset.y - hoverBoundingRect.top

			// Dragging downwards / upwards
			if (
				(dragIndex < hoverIndex && hoverClientY < hoverMiddleY) ||
				(dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
			) {
				return
			}

			updatePath(dragIndex, hoverIndex)
			item.index = hoverIndex
		},
		drop(item, monitor) {
			updatePaths()
		},
	})

	const [{ isDragging }, drag] = useDrag({
		item: { id: path._id, index, type: ItemTypes.PATH },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	const opacity = isDragging ? 0 : 1

	drag(drop(ref))
	return (
		<ListItem disableGutters divider className={classes.listItem} style={{ opacity }} ref={ref}>
			<Box mr={1.5} width={35} fontWeight={600}>
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
}
