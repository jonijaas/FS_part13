const jwt = require('jsonwebtoken')

const { Session } = require('../models')
const { SECRET } = require('../util/config')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const activeSession = await Session.findOne({
      where: {
        token: authorization.substring(7),
        active: true
      }
    })
    if (!activeSession) {
      return res.status(401).json({ error: 'Token expired or invalid'})
    }
    try {
      req.token = authorization.substring(7)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      res.status(401).json({ error: 'Invalid token' })
    }
  } else {
    res.status(401).json({ error: 'Token missing' })
  }
  next()
}

module.exports = { tokenExtractor }