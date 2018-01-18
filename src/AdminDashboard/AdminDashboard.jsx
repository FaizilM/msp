import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';

class AdminDashboard extends React.Component {

    render() {

        const { user, users } = this.props;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1>Hi {user.firstName} - { user.lastName}!</h1>
                <p>You're logged in with ADMIN DASHBOARD!!</p>


                <p>
                    <Link to="/login">Logout</Link>
                </p>
            </div>
        );
    }
}

function mapStateToProps(state) {

  const { users, authentication } = state;
  const { user } = authentication;
  return {
      user,
      users
  };

}

const connectedAdminDashboard = connect(mapStateToProps)(AdminDashboard);
export { connectedAdminDashboard as AdminDashboard };
