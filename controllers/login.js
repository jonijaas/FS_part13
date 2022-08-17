const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  if (user.disabled) {
    return response.status(401).json({ error: 'Account disabled, please contact admin.' })
  }

  const sessionCheck = await Session.findOne({
    where: {
      userId: userForToken.id,
      active: true
    }
  })

  if (sessionCheck) {
    return response.status(401).json({ error: 'You are already logged in, you can have only one active session going on.' })
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({ token: token, userId: userForToken.id, active: true })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router