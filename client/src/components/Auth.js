import React, { Component } from 'react'
import SignIn from './SignIn'
import Register from './Register'

class AuthPage extends Component {
  state = {
    isSignIn: true
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {isSignIn: !prevState.isSignIn}
    })
  }

  render() {
    console.log(this.state);
    return(
      <>
        {this.state.isSignIn ?
          <div>
            <h1>Sign In!</h1>
            <SignIn />
          </div>
          :
          <div>
            <h1>Register!</h1>
            <Register />
          </div>
        }
        <button type="button" onClick={this.switchModeHandler}>
          {this.state.isSignIn ?
            'Don\'t have an account? Register here'
            :
            'Already have an account? Sign In'}
        </button>
      </>
    )
  }
}

export default AuthPage
