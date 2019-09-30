import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.css';

import AuthPage from './components/Auth'
import Portfolio from './components/Portfolio'

class App extends React.Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
    this.setState({ token: token, userId: userId })
  }

  // logout = () => {
  //   localStorage.removeItem("token")
  //   localStorage.removeItem("userId")
  //   this.setState({ token: null, userId: null })
  // }

  componentDidMount() {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (token && userId) {
      this.setState({
        token: token,
        userId: userId
      })
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {this.state.token && <Route path="/portfolio" component={Portfolio} />}
          {this.state.token && <Route path="/transactions" component={null} />}
          {!this.state.token && <Route path="/auth" render={ (routeProps) => {
            return <AuthPage login={this.login}/>
          }} />}
          {this.state.token && <Redirect from="/" to="/portfolio" />}
          {!this.state.token && <Redirect from="/" to="/auth" />}
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
