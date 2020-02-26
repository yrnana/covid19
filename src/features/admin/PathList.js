import React, { memo, useRef, useCallback } from 'react'
import { Box, List, ListItem } from '@material-ui/core'
import axios from 'axios'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

const ItemTypes = {
	PATH: 'PATH',
}

function PathItem({ path, index, moveItem, updatePaths }) {
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

			moveItem(dragIndex, hoverIndex)
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
		<ListItem divider ref={ref} style={{ opacity }}>
			<Box mr={2} width={35} fontWeight={600}>
				{path.date}
			</Box>
			<Box>{path.location_name}</Box>
		</ListItem>
	)
}

function PathList({ paths, setPaths }) {
	// 드래그 할 때마다 순서를 바꾼다
	const moveItem = useCallback(
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

	return (
		<DndProvider backend={Backend}>
			<Box component={List} mt={2}>
				{paths.map((path, index) => (
					<PathItem
						key={path._id}
						index={index}
						path={path}
						moveItem={moveItem}
						updatePaths={updatePaths}
					/>
				))}
			</Box>
		</DndProvider>
	)
}

export default memo(PathList)
