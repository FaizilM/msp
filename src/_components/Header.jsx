import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends React.Component {

    render() {

        const { user } = this.props;
        console.log(user)
        var home;

        if(user.role == "ROLE_ADMIN") {
            home = <li className="active"><Link to="/">Home</Link></li>
        } else {
            home = <li className="active"><Link to="/customer">Home</Link></li>
        }


        return (
            <div>
            <nav className="navbar navbar-default">
  <div className="container-fluid">
    <div className="navbar-header">
      <a className="navbar-brand" href="#">SevOne</a>
    </div>
    <ul className="nav navbar-nav">
          { home }

          {
            (user.role == "ROLE_ADMIN") ? <li><Link to="/customer_metrics">Customer Metrics</Link></li> : ""
          }


        </ul>
    <ul className="nav navbar-nav navbar-right">
      <p className="navbar-text">Signed in as<b> {user.lastName} </b></p>
        <li><Link to="/login"><span className="glyphicon glyphicon-log-in"></span> Logout</Link></li>
      <li></li>
      <p>

      </p>
    </ul>
  </div>
</nav>


    </div>

        );
    }
}

function mapStateToProps(state) {

    const { authentication } = state;

    return {
        authentication
    };

}

const connectedHeader = connect(mapStateToProps)(Header);
export { connectedHeader as Header };
