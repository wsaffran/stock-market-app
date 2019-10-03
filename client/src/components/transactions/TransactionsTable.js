import React, { Component } from 'react'
import './TransactionTable.css'

class TransactionsTable extends Component {

  formatNumber = x => {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  renderTransactions = (transactions) => {
    let share
    return transactions.reverse().map(transaction => {
      if (transaction.shares > 1) {
        share = "shares"
      } else {
        share = "share"
      }
      return (
        <tr key={transaction.datetime}>
          <td className="transactions-table__ticker td">{(transaction.action).toUpperCase()} ({(transaction.ticker).toUpperCase()})</td>
          <td className="transactions-table__dash td">-</td>
          <td className="transactions-table__price td">{transaction.shares} {share} @ ${this.formatNumber(transaction.price)}</td>
        </tr>
      )
    })
  }

  render() {
    return(
      <div>
        <table className="transactions-table">
          <tbody>
            {this.renderTransactions(this.props.transactions)}
          </tbody>
        </table>
      </div>
    )
  }
}

export default TransactionsTable
