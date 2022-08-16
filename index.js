const express = require('express')
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

//Errors responds with JSON formatted error message besides express-async-errors middleware
app.use((err, _req, res, next) => {
  if (err) {
    if (err.message === 'Validation error: Validation min on year failed') {
      res.status(400).json({ error: 'Year must be at least equal to 1991!' })
    } else if (err.message === 'Validation error: Validation max on year failed') {
      res.status(400).json({ error: 'Year can not be greater than the current year!' })
    } else {
      res.status(400).json({ error: err.message })
    }
  }

  next(err)
})

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

start()