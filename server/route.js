const Router = require('@koa/router')
const router = new Router({ prefix: '/api' })

router.get('/data', async (ctx, next) => {
	const { db } = ctx
	const data = await db
		.collection('path')
		.find({ patient_number: 3 }, { projection: { _id: 0 } })
		.toArray()
	ctx.body = data
})

module.exports = router
