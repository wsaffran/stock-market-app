import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css';

import AuthPage from './components/Auth'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={AuthPage} />
        <Route path="/portfolio" component={null} />
        <Route path="/transactions" component={null} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
