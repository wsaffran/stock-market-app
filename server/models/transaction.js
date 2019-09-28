const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
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
  action: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)
