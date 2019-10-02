import React, { Component } from 'react'

import PortfolioTable from './PortfolioTable'
import PortfolioForm from './PortfolioForm'
import './Portfolio.css'

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
      <React.Fragment>
        {this.state.isLoading ?
          null
          :
          <div className="some-page-wrapper">
            <h1>Portfolio</h1>
            <div className="row">
              <div className="column left">
                {this.state.balance && <PortfolioTable balance={this.state.balance} stocks={this.state.stocks}/>}
              </div>
              <div className="column right">
                {this.state.balance && <PortfolioForm balance={this.state.balance} />}
              </div>
            </div>
          </div>
        }
      </React.Fragment>
    )
  }
}

export default Portfolio
