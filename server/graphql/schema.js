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
const alpha = require('alphavantage')({ key: 'NZUOBHSHQFLTC4VR' })
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
        try {
          return Transaction.find({ userId: parent.id})
        } catch (err) {
          throw err
        }
      }
    },
    stocks: {
      type: new GraphQLList(StockType),
      async resolve(parent, args) {
        try {
          const stocks = await Stock.find({userId: parent.id })
          stocks.forEach(stock => {
            axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${process.env.API_KEY}`)
            .then(response => {
              stock.price = parseFloat(response.data['Global Quote']['05. price'])
              stock.openPrice = parseFloat(response.data['Global Quote']['02. open'])
              stock.save()
            })
            .catch(console.log)
          })
            return Stock.find({ userId: parent.id })
        } catch (err) {
          throw err
        }
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
        try {
          return User.findbyId(parent.userId)
        } catch (err) {
          throw err
        }
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
        try {
          return User.findbyId(parent.userId)
        } catch (err) {
          throw err
        }
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
        try {
          return User.findById(args.id)
        } catch (err) {
          throw err
        }
      }
    },
    login: {
      type: AuthData,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      async resolve(parent, args) {
        try {
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
        } catch (err) {
          throw err
        }
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
      async resolve(parent, args, req) {
        try {
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
        } catch (err) {
          throw err
        }
      }
    },
    createTransaction: {
      type: TransactionType,
      args: {
        ticker: { type: new GraphQLNonNull(GraphQLString) },
        shares: { type: new GraphQLNonNull(GraphQLInt) },
        action: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },
      async resolve(parent, args, req) {
        try {
          if (!req.isAuth) {
            throw new Error('Unauthenticated')
          }
          const user = await User.findById(args.userId)
          const data = await alpha.data.quote(`${args.ticker}`)
          const price = parseFloat(data['Global Quote']['05. price'])
          const openPrice = parseFloat(data['Global Quote']['02. open'])
          if (user.balance > args.shares * price) {
            let stock = await Stock.findOne({userId: args.userId, ticker: args.ticker})
            if (!stock) {
              stock = new Stock({
                ticker: args.ticker,
                price: price,
                openPrice: openPrice,
                shares: args.shares,
                userId: args.userId
              })
              stock.save()
            } else {
              stock.shares += args.shares
              stock.price = price
              stock.openPrice = openPrice
              stock.save()
            }
            user.balance -= args.shares * price
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
          } else {
            throw new Error('Not enough money!')
          }
        } catch (err) {
          throw err
        }
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
