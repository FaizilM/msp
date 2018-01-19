import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';


class Header extends React.Component {

    render() {
        return (
            <div>
            <nav class="navbar navbar-inverse navbar-fixed-top">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">SevOne</a>
    </div>

    <ul class="nav navbar-nav navbar-right">
      <p class="navbar-text">Signed in as {this.props.user.lastName}</p>
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
