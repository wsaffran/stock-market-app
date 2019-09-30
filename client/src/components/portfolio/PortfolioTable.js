import React, { Component } from 'react'

class PortfolioTable extends Component {

  renderStocks = (stocks) => {
    let color
    return stocks.map(stock => {
      if (stock.openPrice > stock.price) {
        color = "red"
      } else if (stock.openPrice < stock.price) {
        color = "green"
      } else {
        color = "grey"
      }
      return <p key={stock.ticker}>{(stock.ticker).toUpperCase()} {stock.shares} <span style={{color: color}}>${(stock.price * stock.shares).toFixed(2)}</span></p>
    })
  }

  render() {
    return(
      <div>
        {this.renderStocks(this.props.stocks)}
      </div>
    )
  }
}

export default PortfolioTable
