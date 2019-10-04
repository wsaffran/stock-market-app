import React, { Component } from 'react'
import './PortfolioForm.css'

class PortfolioForm extends Component {

  state = {
    ticker: "",
    quantity: "",
    error: ""
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
          createTransaction(userId: "${localStorage.getItem("userId")}", ticker: "${this.state.ticker.toUpperCase()}", shares: ${this.state.quantity}, action: "buy") {
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
        this.props.renderUser()
        this.setState({
          ticker: "",
          quantity: "",
          error: ""
        })
      } else {
        if (resData.errors) {
          let errorMsg = ''
          if (resData.errors[0]['message'].split(" ")[0] === 'Unexpected') {
            errorMsg = 'Invalid ticker'
          } else {
            errorMsg = resData.errors[0]['message']
          }
          this.setState({
            error: errorMsg
          })
        }
      }

    })
    .catch(console.log)
  }

  render() {
    return(
      <div className="portfolio-form">
        <h3>Cash - ${this.props.balance}</h3>
        <form className="portfolio-form__form" onSubmit={this.handleSubmit}>
          {this.state.error.length > 0 && <p style={{color: 'red'}}>{this.state.error}</p>}
          <input
            onChange={this.handleChange}
            type="text"
            name="ticker"
            placeholder="Ticker"
            value={this.state.ticker} />
          <div>{this.state.tickerError}</div>
          <input
            onChange={this.handleChange}
            type="number"
            name="quantity"
            placeholder="Quantity"
            min="1"
            value={this.state.quantity} /><br></br>
          <button className= "button" type="submit">Buy</button>
        </form>
      </div>
    )
  }
}

export default PortfolioForm
