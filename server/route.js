const Router = require('@koa/router')
const router = new Router({ prefix: '/api' })

const { ObjectId } = require('mongodb')
const { parse, format, differenceInCalendarDays } = require('date-fns')

/**
 * GET /api/path
 * 확진자 이동 경로 조회
 */
router.get('/path', async (ctx, next) => {
	const { db } = ctx
	const data = await db
		.collection('path')
		.find({})
		.sort([
			['patient_number', 1],
			['order', 1],
		])
		.toArray()
	ctx.body = data.map(path => convertPath(path))
})

/**
 * POST /api/path
 * 확진자 이동 경로 추가
 */
router.post('/path', async (ctx, next) => {
	let { latitude, longitude, location_desc, ...item } = ctx.request.body
	location_desc = location_desc.trim()

	ctx.assert(item.date, 400, '방문 날짜를 입력하세요')
	ctx.assert(item.patient_number, 400, '확진자 번호를 입력하세요')
	ctx.assert(location_desc, 400, '장소를 입력하세요')
	ctx.assert(latitude, 400, '위도를 입력하세요')
	ctx.assert(longitude, 400, '경도를 입력하세요')

	const path = ctx.db.collection('path')

	const max = await path
		.find({ patient_number: item.patient_number })
		.sort({ order: -1 })
		.limit(1)
		.toArray()
	const order = max.length > 0 ? max[0].order + 1 : 1

	const newPath = {
		...item,
		date: parse(item.date, 'yyyy-MM-dd', new Date()),
		location: {
			type: 'Point',
			coordinates: [longitude, latitude],
		},
		location_desc,
		order,
	}

	const { insertedId } = await path.insertOne(newPath)
	ctx.assert(insertedId, 500, '경로가 추가되지 않았습니다.')
	newPath._id = insertedId

	ctx.body = convertPath(newPath)
})

/**
 * PATCH /api/path
 * 확진자 별 경로 순서 변경
 */
router.patch('/path', async (ctx, next) => {
	const items = ctx.request.body
	ctx.assert(items, 400, '경로를 입력하세요.')

	const path = ctx.db.collection('path')
	const promises = items.map(({ _id, order }) =>
		path.findOneAndUpdate({ _id: ObjectId(_id) }, { $set: { order } })
	)
	await Promise.all(promises)

	ctx.body = ''
})

/**
 * DELETE /api/path
 * _id로 경로 삭제
 */
router.delete('/path/:_id', async (ctx, next) => {
	const { _id } = ctx.params
	ctx.assert(_id, 400, '삭제할 경로ID를 지정하세요.')

	const path = ctx.db.collection('path')
	let r = await path.findOneAndDelete({ _id: ObjectId(_id) })
	ctx.assert(r.value, 500, '경로가 삭제되지 않았습니다.')

	ctx.body = ''
})

module.exports = router

/**
 * 경로를 출력용으로 변환
 * @param {Date} date
 * @param {Object} location
 * @param {Object} rest
 */
function convertPath({ date, location, ...rest }) {
	const dateObj = new Date(date)
	const diff = differenceInCalendarDays(new Date(), dateObj)
	return {
		...rest,
		coordinates: location.coordinates.reverse(),
		date: format(dateObj, 'M.d'),
		// 9일 이상 경과: 0, 2일 이상 9일 미만: 1, 2일 미만: 2
		status: diff >= 10 ? 0 : diff >= 3 ? 1 : 2,
	}
}
