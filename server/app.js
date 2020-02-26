const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const { MongoClient } = require('mongodb')

const app = new Koa()
app.use(logger())
app.use(bodyParser())

// Error Handler
app.use(async (ctx, next) => {
	try {
		await next()
	} catch (err) {
		ctx.status = err.statusCode || err.status || 500
		ctx.body = { message: err.message }
		ctx.app.emit('error', err, ctx)
	}
})
app.on('error', (err, ctx) => {
	console.error(err)
})

// Add Router
const router = require('./route')
app.use(router.routes()).use(router.allowedMethods())

// MongoDB
const dbOpt = { useNewUrlParser: true, useUnifiedTopology: true }
const client = new MongoClient('mongodb://localhost:27017', dbOpt)
client.connect(err => {
	console.log('Connected successfully to server')
	app.context.db = client.db('covid')

	// 앱 기동
	app.listen(4000)
})
