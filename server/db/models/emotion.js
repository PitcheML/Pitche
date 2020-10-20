const Sequelize = require('sequelize')
const db = require('../db')

const Emotion = db.define('emotion', {
  sad: {
    type: Sequelize.FLOAT
  },
  angry: {
    type: Sequelize.FLOAT
  },
  neutral: {
    type: Sequelize.FLOAT
  },
  surprised: {
    type: Sequelize.FLOAT
  },
  happy: {
    type: Sequelize.FLOAT
  },
  disgusted: {
    type: Sequelize.FLOAT
  },
  fearful: {
    type: Sequelize.FLOAT
  },
  transcript: {
    type: Sequelize.TEXT
  },
  duration: {
    type: Sequelize.INTEGER,
    defaultValue: 30000
  }
})

module.exports = Emotion
