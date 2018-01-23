import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import Inventory from '../_components/admin/Inventory';
import Sites from '../_components/admin/Sites';
import PacketLoss from '../_components/admin/PacketLoss';
import LinkCapacity from '../_components/admin/LinkCapacity';
import { userActions } from '../_actions';
import { Grid, Row, Col, Input, Button } from 'react-bootstrap';
import {Header} from '../_components/Header';

class AdminDashboard extends React.Component {

    render() {

        const { user, users } = this.props;
        return (
            <div>
            <Header user = { user } />

                <h1>Dashboard</h1>
                <div style={{ width: '100%', height: '60%', marginRight: '5%', marginTop: '3%' }}>
                    <div style={{ width: '45%', height: '100%', display: 'inline-block', float: 'left' }}>
                        <Inventory />
                    </div>
                    <Sites />
                </div>
                <LinkCapacity />
                <div>
                    <PacketLoss />
                </div>
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
