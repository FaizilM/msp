import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './App.css';
import Inventory from '../_components/admin/Inventory';
import Sites from '../_components/admin/Sites';
import PacketLoss from '../_components/admin/PacketLoss';
import LinkCapacity from '../_components/admin/LinkCapacity';
import { userActions } from '../_actions';

import {Header} from '../_components/Header';
import { Container, Row, Col } from 'reactstrap';

import config from '../_components/chart/index';

class AdminDashboard extends React.Component {

    render() {

        const { user, users } = this.props;

        const configValue = config.bar;
        console.log("ADMIN DASHBOARD", configValue)


        return (
            <div>
            <Header user = { user } />
            <Container>
              <Row className="well">
                <h2>Dashboard</h2>

                </Row>

        <Row className="well">
        <Col xs="6" md="6">
              <Inventory />
        </Col>
          <Col xs="6" md="6">
          <Sites />
          </Col>
</Row>
<Row className="well">
          <Col xs="6" md="6">
         <LinkCapacity config={configValue}/>
          </Col>


          <Col xs="6" md="6">
           <PacketLoss config={configValue}/>
          </Col>

          </Row>

      </Container>

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
