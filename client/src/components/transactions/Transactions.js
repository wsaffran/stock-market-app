import React, { Component } from 'react'

import TransactionsTable from './TransactionsTable'
import './Transactions.css'

class Transactions extends Component {

  state = {
    isLoading: true,
    transactions: []
  }

  componentDidMount() {
    const requestBody = {
      query: `
        {
          user(id: "${localStorage.getItem("userId")}") {
            transactions {
              ticker
              shares
              price
              action
              datetime
            }
          }
        }
      `
    }

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!")
      }
      return res.json()
    })
    .then(resData => {
      if (resData.data) {
        this.setState({
          isLoading: false,
          transactions: resData.data.user.transactions
        })
      }
    })
    .catch(console.log)
  }

  render() {
    return(
      <React.Fragment>
        {this.state.isLoading ?
          null
          :
          <React.Fragment>
            <h1 className="transactions-header">Transactions</h1>
            <div className="row">
              <div className="column left">
                {this.state.transactions && <TransactionsTable transactions={this.state.transactions} />}
              </div>
              <div className="column right">
              </div>
            </div>
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default Transactions
