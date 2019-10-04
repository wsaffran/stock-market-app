import React, { Component } from 'react'
import './Auth.css'

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    authFailed: false
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      authFailed: false
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
      if (resData.data.login) {
        this.props.login(resData.data.login.token, resData.data.login.userId)
      } else {
        this.setState({
          email: '',
          password: '',
          authFailed: true
        })
      }
    })
    .catch(console.log)
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        {this.state.authFailed && <p style={{color: "red"}}>Authentication Failed</p>}
        <input
          onChange={this.handleChange}
          type="email"
          name="email"
          placeholder="email"
          value={this.state.email} />
        <input
          onChange={this.handleChange}
          type="password"
          name="password" 
          placeholder="password"
          value={this.state.password} /><br></br>
        <button className="auth__button button" type="submit">Submit</button>
      </form>
    )
  }
}

export default SignIn
