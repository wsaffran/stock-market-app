import React, { Component } from 'react'

import PortfolioTable from './PortfolioTable'
import PortfolioForm from './PortfolioForm'

class Portfolio extends Component {

  state = {
    isLoading: true,
    balance: null,
    stocks: []
  }

  componentDidMount() {
    const requestBody = {
      query: `
        {
          user(id: "${localStorage.getItem("userId")}") {
            balance
            stocks {
              ticker
              shares
              openPrice
              price
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
          balance: resData.data.user.balance,
          stocks: resData.data.user.stocks
        })
      }
    })
    .catch(console.log)
  }

  render() {
    return(
      <div>
        {this.state.isLoading ?
          null
          :
          <div>
          <h1>Portfolio</h1>
          {this.state.balance && <PortfolioTable balance={this.state.balance} stocks={this.state.stocks}/>}
          {this.state.balance && <PortfolioForm balance={this.state.balance} />}
          </div>
        }
      </div>
    )
  }
}

export default Portfolio
