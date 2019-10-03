import React, { Component } from 'react'

import PortfolioTable from './PortfolioTable'
import PortfolioForm from './PortfolioForm'
import './Portfolio.css'

class Portfolio extends Component {

  state = {
    isLoading: true,
    balance: null,
    total: null,
    stocks: []
  }

  formatNumber = x => {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  renderUser = () => {
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
        let total = resData.data.user.balance
        resData.data.user.stocks.forEach(stock => {
          total += stock.price * stock.shares
        })
        this.setState({
          isLoading: false,
          balance: resData.data.user.balance,
          total: total,
          stocks: resData.data.user.stocks
        })
      }
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.renderUser()
  }

  render() {
    return(
      <React.Fragment>
        {this.state.isLoading ?
          null
          :
          <React.Fragment>
            <h1 className="portfolio-header">Portfolio (${this.formatNumber(this.state.total)})</h1>
            <div className="row">
              <div className="column left">
                {this.state.balance && <PortfolioTable balance={this.formatNumber(this.state.balance)} stocks={this.state.stocks}/>}
              </div>
              <div className="column right">
                {this.state.balance && <PortfolioForm balance={this.formatNumber(this.state.balance)} renderUser={this.renderUser} />}
              </div>
            </div>
        </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default Portfolio
