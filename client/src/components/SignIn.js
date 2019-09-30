import React, { Component } from 'react'
import AuthContext from '../context/auth-context'

class SignIn extends Component {
  state = {
    email: '',
    password: ''
  }

  static contextType = AuthContext

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()

    if (this.state.email.trim().length === 0 || this.state.password.trim().length === 0) {
      return
    }

    const requestBody = {
      query: `
        {
          login(email: "${this.state.email}", password: "${this.state.password}") {
            token
            userId
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
      if (resData.data.login.token) {
        this.context.login(resData.data.login.token, resData.data.login.userId)
      }
    })
    .catch(console.log)
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input onChange={this.handleChange} type="email" name="email" value={this.state.email} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input onChange={this.handleChange} type="password" name="password" value={this.state.password} />
        </div>
        <button type="submit">Submit</button>
      </form>
    )
  }
}

export default SignIn
