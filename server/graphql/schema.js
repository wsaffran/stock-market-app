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
const Stock = require('../models/stock')

const axios = require('axios')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
        return Transaction.find({ userId: parent.id})
      }
    },
    stocks: {
      type: new GraphQLList(StockType),
      async resolve(parent, args) {
        const stocks = await Stock.find({userId: parent.id })
        stocks.forEach(stock => {
          axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${process.env.API_KEY}`)
            .then(response => {
              stock.price = parseFloat(response.data['Global Quote']['05. price']).toFixed(2)
              stock.openPrice = parseFloat(response.data['Global Quote']['02. open']).toFixed(2)
              stock.save()
            })
        })
        return Stock.find({ userId: parent.id })
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

const StockType = new GraphQLObjectType({
  name: 'Stock',
  fields: () => ({
    id: { type: GraphQLID },
    ticker: { type: GraphQLString },
    price: { type: GraphQLFloat },
    openPrice: { type: GraphQLFloat },
    shares: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findbyId(parent.userId)
      }
    }
  })
})

const AuthData = new GraphQLObjectType({
  name: 'AuthData',
  fields: () => ({
    userId: { type: GraphQLID },
    token: { type: GraphQLString }
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
    },
    login: {
      type: AuthData,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const user = await User.findOne({ email: args.email })
        if (!user) {
          throw new Error("User does not exist");
        }
        const isEqual = await bcrypt.compare(args.password, user.password)
        if (!isEqual) {
          throw new Error('Password is incorrect!')
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'secretKey')
        return { userId: user.id, token: token }
      }
    }
    // ,
    // autoLogin: {
    //   type: AuthData,
    //   args: {
    //     token: { type: GraphQLString },
    //   },
    //   async resolve(parent, args) {
    //     const verified = jwt.verify(args.token, 'secretKey')
    //     if (verified) {
    //       const
    //     }
    //   }
    // }
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
      async resolve(parent, args, req) {
        const hashedPassword = await bcrypt.hash(args.password, 12)
        const user = await new User({
          name: args.name,
          email: args.email,
          password: hashedPassword,
          balance: 5000.00
        })
        return user.save()
        .then(result => {
          return {...result._doc, password: null, id: result.id}
        })
      }
    },
    // Refactor createTransaction later. Transactions now update users cash balance and user stocks and return error for any un-met conditionals
    createTransaction: {
      type: TransactionType,
      args: {
        ticker: { type: new GraphQLNonNull(GraphQLString) },
        shares: { type: new GraphQLNonNull(GraphQLInt) },
        action: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args, req) {
        if (!req.isAuth) {
          throw new Error('Unauthenticated')
        }
        return User.findById(args.userId)
        .then(user => {
          return axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${args.ticker}&apikey=${process.env.API_KEY}`)
            .then(response => {
              const price = parseFloat(response.data['Global Quote']['05. price']).toFixed(2)
              const openPrice = parseFloat(response.data['Global Quote']['02. open']).toFixed(2)
              if (user.balance > args.shares * price) {
                // update stock list
                return Stock.findOne({ userId: args.userId, ticker: args.ticker})
                .then(stock => {
                  if (!stock) {
                    const stock = new Stock({
                      ticker: args.ticker,
                      price: price,
                      openPrice: openPrice,
                      shares: args.shares,
                      userId: args.userId
                    })
                    stock.save()
                  } else {
                    stock.shares += args.shares,
                    stock.price = price
                    stock.openPrice = openPrice
                    stock.save()
                  }
                  // update user balance
                  user.balance -= (args.shares * price)
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
                })
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
