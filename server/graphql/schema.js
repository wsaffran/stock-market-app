const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLDate,
  GraphQLSchema
} = require('graphql')

const { GraphQLDateTime } = require('graphql-iso-date')

const User = require('../models/user')
const Transaction = require('../models/transaction')

// const alpha = require('alphavantage')({ key: 'NZUOBHSHQFLTC4VR' })
// 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=NZUOBHSHQFLTC4VR'

const axios = require('axios')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    transactions: {
      type: new GraphQLList(TransactionType),
      resolve(parent, args) {
        return Transaction.find({})
      }
    }
  })
})

const TransactionType = new GraphQLObjectType({
  name: 'Transaction',
  fields: () => ({
    id: { type: GraphQLID },
    ticker: { type: GraphQLString },
    price: { type: GraphQLFloat },
    shares: { type: GraphQLInt },
    action: { type: GraphQLString},
    datetime: { type: GraphQLDateTime },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findbyId(parent.userId)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id)
      }
    }
  }
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
          balance: 5000.00
        })
        return user.save()
      }
    },
    updateUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        const user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
          balance: 5000.00
        })
        return user.save()
      }
    },
    // Refactor later, transactions now update users cash balance. Return error for any un-met conditionals
    createTransaction: {
      type: TransactionType,
      args: {
        ticker: { type: new GraphQLNonNull(GraphQLString) },
        shares: { type: new GraphQLNonNull(GraphQLInt) },
        action: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        return User.findById(args.userId)
        .then(user => {
          return axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${args.ticker}&apikey=${process.env.API_KEY}`)
            .then(response => {
              const price = (response.data['Global Quote']['05. price']).toFixed(2)
              if (user.balance > args.shares * price) {
                user.balance -= (Math.args.shares * price)
                user.save()
                const transaction = new Transaction({
                  ticker: args.ticker,
                  shares: args.shares,
                  price: price,
                  action: args.action,
                  datetime: new Date(),
                  userId: args.userId
                })
                return transaction.save()
              }
            })
            .catch(console.log)
        })
        .catch(console.log)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
