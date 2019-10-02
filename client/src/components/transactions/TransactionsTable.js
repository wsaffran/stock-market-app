import React, { Component } from 'react'
import './TransactionTable.css'

class TransactionsTable extends Component {

  renderTransactions = (transactions) => {
    return transactions.reverse().map(transaction => {
      return (
        <tr key={transaction.datetime}>
          <td>{(transaction.action).toUpperCase()} ({(transaction.ticker).toUpperCase()}) - {transaction.shares} shares @ ${transaction.price.toFixed(2)}</td>
        </tr>
      )
    })
  }

  render() {
    return(
      <table>
        <tbody>
          {this.renderTransactions(this.props.transactions)}
        </tbody>
      </table>
    )
  }
}

export default TransactionsTable
