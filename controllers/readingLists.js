const router = require('express').Router()

const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res) => {
  const readingList = await ReadingList.create(req.body)
  res.json(readingList)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const readingListItem = await ReadingList.findByPk(req.params.id)

  if (readingListItem) {
    const user = await User.findByPk(req.decodedToken.id)
    if (user.id === readingListItem.userId) {
      readingListItem.read = req.body.read
      await readingListItem.save()
      res.json(readingListItem)
    } else {
      return res.status(401).json({ error: 'Operation not permitted, you can only mark the blogs in your own reading list as read.'})
    }
  }
})


module.exports = router;