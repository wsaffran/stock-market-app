import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navigation.css'

const Navigation = props => (
  <header className="navigation">
    {props.token &&
      <nav className="navigation__items">
        <ul>
          <li>
            <NavLink to="/portfolio">Portfolio</NavLink>
          </li>
          <li>
            <NavLink to="/transactions">Transactions</NavLink>
          </li>
          <li>
            <NavLink onClick={props.logout} to="/auth">Logout</NavLink>
          </li>
        </ul>
      </nav>
    }
  </header>
)

export default Navigation
