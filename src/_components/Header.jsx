import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userConstants } from '../_constants';

class Header extends React.Component {

    render() {

        const { user } = this.props;
        var home;

        if (user.role == userConstants.ROLE_ADMIN) {
            home = <li className="active"><Link to="/"><span className="app_font">Dashboard</span></Link></li>
        } else {
            home = <li className="active"><Link to="/customer"><span className="app_font">Dashboard</span></Link></li>
        }

        return (


                <nav className="navbar navbar-default navbar-fixed-top">
                    <div className="container-fluid" style={{ backgroundColor: "#FFFFFF" }}>
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#"><img src="src/assets/images/logo.png" alt="logo" style={{ width: "90px" }}></img></a>
                        </div>
                        <ul className="nav navbar-nav">
                            {home}

                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <p className="navbar-text">Signed in as<b> {user.firstName}_{user.lastName} </b></p>
                            <li><Link to="/login"><span className="glyphicon glyphicon-log-in"></span><span className="app_font"> Logout</span></Link></li>
                            <li></li>
                            <p>
                            </p>
                        </ul>
                    </div>
                </nav>


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
