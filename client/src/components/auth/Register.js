import React, { Component } from 'react'
import './Auth.css'

class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    error: false
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (this.state.email.trim().length === 0 || this.state.password.trim().length === 0 || this.state.name.trim().length === 0) {
      return
    }

    const requestBody = {
      query: `
        mutation {
          createUser(name: "${this.state.name}", email: "${this.state.email}", password: "${this.state.password}") {
            id
            email
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
      if (!resData.data.createUser) {
        this.setState({error: true})
      } else {
        // figure out this.props.history
        window.location.reload();
      }
    })
    .catch(console.log)
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        {this.state.error && <p style={{color: "red"}}>Account with this email already exists</p>}
        <input onChange={this.handleChange} type="text" name="name" placeholder="Name" value={this.state.name} />
        <input onChange={this.handleChange} type="email" name="email" placeholder="Email" value={this.state.email} />
        <input onChange={this.handleChange} type="password" name="password" placeholder="Password" value={this.state.password} />
        <button className="button" type="submit">Submit</button>
      </form>
    )
  }
}

export default Register
