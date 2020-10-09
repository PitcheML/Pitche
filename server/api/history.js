const router = require('express').Router()
const {Emotion} = require('../db/models')
const User = require('../db/models/user')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const emotions = await Emotion.findAll({
      where: {userId: req.user.id}
    })
    res.json(emotions)
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const emotion = await Emotion.create(req.body)
    const user = await User.findByPk(req.user.id)
    await user.addEmotion(emotion)
    res.json(emotion)
  } catch (err) {
    next(err)
  }
})
