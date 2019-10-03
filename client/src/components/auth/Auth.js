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
    return(
      <React.Fragment>
        {this.state.isSignIn ?
          <div className="auth-container">
            <h1>Sign In!</h1>
            <SignIn login={this.props.login}/>
          </div>
          :
          <div className="auth-container">
            <h1>Register!</h1>
            <Register {...this.props}/>
          </div>
        }
        {this.state.isSignIn ?
          <p className="p">Don't have an account? <span className="link" onClick={this.switchModeHandler}>Register here</span></p>
          :
          <p className="p">Already have an account? <span className="link" onClick={this.switchModeHandler}>Sign In</span></p>
        }

      </React.Fragment>
    )
  }
}

export default AuthPage
