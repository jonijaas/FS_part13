const router = require('express').Router()

const { Session } = require('../models')
const { tokenExtractor } = require('../util/middleware')

// Logout working on route POST /api/logout
router.post('/', tokenExtractor, async (req, res) => {
  const currentSession = await Session.findOne({
    where: {
      token: req.token
    }
  })
  if (!currentSession.active) {
    return res.json({ error: 'You are not logged in!' })
  }

  currentSession.active = false
  await currentSession.save()
  res.status(200).send('Succesfully logged out!')
})


module.exports = router;