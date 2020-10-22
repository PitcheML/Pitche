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

router.get('/:pitchId', async (req, res, next) => {
  try {
    const pitch = await Emotion.findByPk(req.params.pitchId)
    //only user can view thier pitches
    if (req.user.id !== pitch.userId) {
      const error = new Error('You do not have access to this')
      error.status = 401
      throw error
    }
    res.json(pitch)
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

router.delete('/:emotionId', async (req, res, next) => {
  try {
    const emotion = await Emotion.findByPk(req.params.emotionId)
    //only user can delete thier pitch
    if (req.user.id !== emotion.userId) {
      const error = new Error('You do not have access to this')
      error.status = 401
      throw error
    }
    await emotion.destroy()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})
