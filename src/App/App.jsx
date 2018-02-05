import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute, Header } from '../_components';
import { AdminDashboard } from '../_components/admin/AdminDashboard';
import { UserDashboard } from '../_components/user/UserDashboard';
import { EventDetails } from '../_components/user/EventDetails';
import { LoginPage } from '../LoginPage';
import CustomerMetrics from '../_components/admin/CustomerMetrics';
import { userConstants } from '../_constants';
import { TroubleShoot } from '../_components/user/TroubleShoot';

class App extends React.Component {

    constructor(props) {
        super(props);

        const { dispatch } = this.props;

        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });
    }

    render() {

        const { alert } = this.props;
        return (
            <div>

                <Router history={history}>

                    <div className="app_container">

                        {
                            (this.props.authentication && this.props.authentication.user && this.props.authentication.user.role) ?
                                <Header user={this.props.authentication.user} /> : ""
                        }
                        {
                            this.props.authentication && this.props.authentication.user && (this.props.authentication.user.role == userConstants.ROLE_ADMIN) ?
                                <PrivateRoute path="/customer_metrics" component={CustomerMetrics} /> : ""
                        }

                        <div className="page_wrapper container">
                        <PrivateRoute exact path="/" component={AdminDashboard} />
                        <PrivateRoute path="/customer" component={UserDashboard} />
                        <PrivateRoute path="/event_details/:route_type" component={EventDetails} />
                        <PrivateRoute path="/trouble_shoot" component={TroubleShoot} />
                        <Route path="/login" component={LoginPage} />
                        </div>
                    </div>
                </Router>

            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert, authentication } = state;

    return {
        alert,
        authentication
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
