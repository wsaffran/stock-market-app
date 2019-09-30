import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.css';

import AuthPage from './components/Auth'
import AuthContext from './context/auth-context'

class App extends React.Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId) => {
    this.setState({ token: token, userId: userId })
  }

  logout = () => {
    this.setState({ token: null, userId: null })
  }

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
          <Switch>
            {this.state.token && <Route path="/portfolio" component={null} />}
            {this.state.token && <Route path="/transactions" component={null} />}
            {!this.state.token && <Route path="/auth" component={AuthPage} />}
            {this.state.token && <Redirect from="/" to="/portfolio" />}
            {!this.state.token && <Redirect from="/" to="/auth" />}
          </Switch>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
