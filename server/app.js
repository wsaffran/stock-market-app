const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./graphql/schema')
const mongoose = require('mongoose')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(isAuth)

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))

mongoose.connect(`
  mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ik2mz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
)
mongoose.connection.once('open', () => {
  console.log('connected to database');
})


app.listen(4000, () => {
  console.log('listening for requests on port 4000');
})
