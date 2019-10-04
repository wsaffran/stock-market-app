import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.css';

import AuthPage from './components/auth/Auth'
import Portfolio from './components/portfolio/Portfolio'
import Transactions from './components/transactions/Transactions'
import Navigation from './components/navigation/Navigation'

class App extends React.Component {

  login = (token, userId) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
    this.setState({})
  }

  logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    this.setState({})
  }

  render() {
    return (
      <BrowserRouter>
        <Navigation token={localStorage.getItem("token")} logout={this.logout} />
        <main className="main-content">
          <Switch>
            {localStorage.getItem("token") && <Route path="/portfolio" component={Portfolio} />}
            {localStorage.getItem("token") && <Route path="/transactions" component={Transactions} />}
            {!localStorage.getItem("token") && <Route path="/auth" render={props => <AuthPage {...props} login={this.login}/>} />}
            {!localStorage.getItem("token") && <Redirect from="/" to="/auth" />}
            {localStorage.getItem("token") && <Redirect from="/" to="/portfolio" />}
          </Switch>
        </main>
      </BrowserRouter>
    );
  }
}

export default App;
