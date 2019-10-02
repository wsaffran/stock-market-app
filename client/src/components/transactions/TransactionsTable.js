import React, { Component } from 'react'
import './TransactionTable.css'

class TransactionsTable extends Component {

  formatNumber = x => {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  renderTransactions = (transactions) => {
    return transactions.reverse().map(transaction => {
      return (
        <tr key={transaction.datetime}>
          <td>{(transaction.action).toUpperCase()} ({(transaction.ticker).toUpperCase()}) - {transaction.shares} shares @ ${this.formatNumber(transaction.price)}</td>
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
