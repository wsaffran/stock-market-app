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
    },
    stocks: {
      type: new GraphQLList(StockType),
      resolve(parent, args) {
        return Stock.find({})
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
    action: { type: GraphQLString},
    datetime: { type: GraphQLDateTime }
  })
})

const StockType = new GraphQLObjectType({
  name: 'Stock',
  fields: () => ({
    id: { type: GraphQLID },
    ticker: { type: GraphQLString },
    shares: { type: GraphQLInt }
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
        let user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
          cash: 5000.00
        })
        return user.save()
      }
    },
    createTransaction: {
      type: TransactionType,
      args: {
        ticker: { type: new GraphQLNonNull(GraphQLString) },
        shares: { type: new GraphQLNonNull(GraphQLInt) },
        price: { type: new GraphQLNonNull(GraphQLFloat) },
        action: { type: new GraphQLNonNull(GraphQLString) },
        datetime: { type: new GraphQLNonNull(GraphQLDateTime) }
      },
      resolve(parent, args) {
        let transaction = new Transaction({
          ticker: args.ticker,
          shares: args.shares,
          price: args.price,
          action: args.action,
          datetime: args.datetime
        })
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
