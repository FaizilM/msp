import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';


class Header extends React.Component {

    render() {
        return (
            <div>
            <nav className="navbar navbar-inverse">
  <div className="container-fluid">
    <div className="navbar-header">
      <a className="navbar-brand" href="#">SevOne</a>
    </div>

    <ul className="nav navbar-nav navbar-right">
      <p className="navbar-text">Signed in as {this.props.user.lastName}</p>
      <li><Link to="/login">Logout</Link></li>
      <p>

      </p>
    </ul>
  </div>
</nav>


    </div>

        );
    }
}


export { Header };
