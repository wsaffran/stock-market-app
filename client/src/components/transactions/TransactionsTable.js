import React, { Component } from 'react'

class TransactionsTable extends Component {

  renderTransactions = (transactions) => {
    return transactions.reverse().map(transaction => {
      return <p key={transaction.datetime}>{(transaction.action).toUpperCase()} ({transaction.ticker}) - {transaction.shares} shares @ ${transaction.price.toFixed(2)}</p>
    })
  }

  render() {
    return(
      <div>
        {this.renderTransactions(this.props.transactions)}
      </div>
    )
  }
}

export default TransactionsTable
