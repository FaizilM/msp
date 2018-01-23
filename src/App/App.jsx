import React from 'react';
import { Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { history } from '../_helpers';
import { alertActions } from '../_actions';
import { PrivateRoute} from '../_components';
import { AdminDashboard } from '../AdminDashboard';
import { HomePage } from '../HomePage';
import { LoginPage } from '../LoginPage';
import { RegisterPage } from '../RegisterPage';

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            console.log("APP constrtauctor ");


            dispatch(alertActions.clear());
        });
    }

    render() {
          const { alert } = this.props;

        return (
                  <div>

                        <Router history={history}>
                            <div>
                                <PrivateRoute exact path="/" component={AdminDashboard} />
                                <PrivateRoute path="/customer" component={HomePage} />
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                            </div>
                        </Router>
                    </div>

        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    const {authentication} = state.authentication

    return {
        alert,
        authentication
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };
