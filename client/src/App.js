import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.css';

import AuthPage from './components/auth/Auth'
import Portfolio from './components/portfolio/Portfolio'
import Transactions from './components/transactions/Transactions'

class App extends React.Component {

  login = (token, userId) => {
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userId)
    // this.setState({ token: token, userId: userId })
  }

  // logout = () => {
  //   localStorage.removeItem("token")
  //   localStorage.removeItem("userId")
  //   this.setState({ token: null, userId: null })
  // }

  // componentDidMount() {
  //   const token = localStorage.getItem("token")
  //   const userId = localStorage.getItem("userId")
  //   if (token && userId) {
  //     this.setState({
  //       token: token,
  //       userId: userId
  //     })
  //   }
  // }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {localStorage.getItem("token") && <Route path="/portfolio" component={Portfolio} />}
          {localStorage.getItem("token") && <Route path="/transactions" component={Transactions} />}
          {!localStorage.getItem("token") && <Route path="/auth" render={ (routeProps) => {
            return <AuthPage login={this.login}/>
          }} />}
          {!localStorage.getItem("token") && <Redirect from="/" to="/auth" />}
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
