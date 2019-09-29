const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stockSchema = new Schema({
  userId: {
    type: String
  },
  ticker: {
    type: String,
    required: true
  },
  shares: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  openPrice: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Stock', stockSchema)
