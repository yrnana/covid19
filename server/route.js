const Router = require('@koa/router')
const router = new Router({ prefix: '/api' })

const { format, differenceInCalendarDays } = require('date-fns')

/**
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
	ctx.body = data.map(path => {
		const date = new Date(path.date)
		const diff = differenceInCalendarDays(new Date(), date)
		return {
			...path,
			date: format(date, 'M.d'),
			// 9일 이상 경과: 0, 2일 이상 9일 미만: 1, 2일 미만: 2
			status: diff >= 10 ? 0 : diff >= 3 ? 1 : 2,
		}
	})
})

/**
 * 확진자 이동 경로 추가
 */
router.post('/add', async (ctx, next) => {
	console.log(ctx.request.body)
	ctx.body = ''
})

/**
 * 확진자 별 경로 순서 변경
 */
router.patch('/path', async (ctx, next) => {
	console.log(ctx.request.body)
	ctx.body = ''
})

module.exports = router
