import React, { Component } from 'react'
import './PortfolioForm.css'

class PortfolioForm extends Component {

  state = {
    ticker: "",
    quantity: ""
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    if (this.state.ticker.trim().length === 0 || this.state.quantity <= 0) {
      return
    }

    const requestBody = {
      query: `
        mutation {
          createTransaction(userId: "${localStorage.getItem("userId")}", ticker: "${this.state.ticker}", shares: ${this.state.quantity}, action: "buy") {
            ticker
          }
        }
      `
    }

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + localStorage.getItem("token")
      }
    })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed!")
      }
      return res.json()
    })
    .then(resData => {
      if (resData.data.createTransaction) {
        // temporary fix, make dynamic through state
        window.location.reload();
      }
    })
    .catch(console.log)
  }

  render() {
    return(
      <div className="form">
        <h3>Cash - ${this.props.balance.toFixed(2)}</h3>
        <form onSubmit={this.handleSubmit}>
          <div>
            <input onChange={this.handleChange} type="text" name="ticker" placeholder="Ticker" value={this.state.ticker} />
          </div>
          <div>
            <input onChange={this.handleChange} type="number" name="quantity" placeholder="Quantity" min="1" value={this.state.quantity} />
          </div>
          <button type="submit">Buy</button>
        </form>
      </div>
    )
  }
}

export default PortfolioForm
