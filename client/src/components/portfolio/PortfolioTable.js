import React, { Component } from 'react'
import './PortfolioTable.css'

class PortfolioTable extends Component {

  formatNumber = x => {
    return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  renderStocks = (stocks) => {
    let color, share
    return stocks.map(stock => {
      if (stock.openPrice > stock.price) {
        color = "red"
      } else if (stock.openPrice < stock.price) {
        color = "green"
      } else {
        color = "grey"
      }
      if (stock.shares > 1) {
        share = "shares"
      } else {
        share = "share"
      }
      return (
        <tr key={stock.ticker}>
          <td className="ticker" >{(stock.ticker).toUpperCase()} {stock.shares} {share}</td>
          <td className="value" style={{color: color}}>${this.formatNumber(stock.price * stock.shares)}</td>
        </tr>
      )
    })
  }

  render() {
    return(
      <table className="table">
        <tbody>
          {this.renderStocks(this.props.stocks)}
        </tbody>
      </table>
    )
  }
}

export default PortfolioTable
