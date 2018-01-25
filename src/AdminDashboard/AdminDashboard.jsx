import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../assets/css/App.css';
import Inventory from '../_components/admin/Inventory';
import Sites from '../_components/admin/Sites';
import PacketLoss from '../_components/admin/PacketLoss';
import LinkCapacity from '../_components/admin/LinkCapacity';
import LatencyRatio from '../_components/admin/LatencyRatio';
import JitterRatio from '../_components/admin/JitterRatio';
import SiteAvailability from '../_components/admin/SiteAvailability';
import CustomerMetricsDashboard from '../_components/admin/CustomerMetricsDashboard';
import { userActions } from '../_actions';

import { Header } from '../_components/Header';
import { Container, Row, Col } from 'reactstrap';


class AdminDashboard extends React.Component {

    render() {

        const { user, users } = this.props;
        return (
        <div>

          <Container>
            <Row>
            <Col xs="12" md="12">
              <h3 className="page-header" style={{textAlign:'center'}}>Service Overview Across all Enterprise Customers</h3>
            </Col>
            </Row>
            <Row>
               <Col xs="6" md="6">
               <div className="panel panel-default">
                  <div className="panel-heading">
                     <i className="fa fa-bell fa-fw"></i>
                     <h3>Inventory</h3>
                  </div>
                  <div className="panel-body">
                     <div className="list-group">
                        <Inventory />
                     </div>
                  </div>
               </div>
               </Col>
               <Col xs="6" md="6">
               <div className="panel panel-default">
                  <div className="panel-heading">
                     <i className="fa fa-bell fa-fw"></i>
                     <h3>Sites</h3>
                  </div>
                  <div className="panel-body">
                     <div className="list-group">
                        <Sites />
                     </div>
                  </div>
               </div>
               </Col>
            </Row>
            <Row>
            <Col xs="6" md="6">
            <div className="panel panel-default">
               <div className="panel-heading">
                  <i className="fa fa-bell fa-fw"></i>
                  <h3>Link Capacity Utilization</h3>
               </div>
               <div className="panel-body">
                  <div className="list-group">
                      <LinkCapacity />
                  </div>
               </div>
            </div>
             </Col>
             <Col xs="6" md="6">
            <div className="panel panel-default">
               <div className="panel-heading">
                  <i className="fa fa-bell fa-fw"></i>
                  <h3>Packet Loss</h3>
               </div>
               <div className="panel-body">
                  <div className="list-group">
                      <PacketLoss />
                  </div>
               </div>
            </div>
             </Col>
            </Row>

            <Row>
            <Col xs="6" md="6">
            <div className="panel panel-default">
               <div className="panel-heading">
                  <i className="fa fa-bell fa-fw"></i>
                  <h3>Latency Ratio</h3>
               </div>
               <div className="panel-body">
                  <div className="list-group">
                      <LatencyRatio />
                  </div>
               </div>
            </div>
             </Col>
             <Col xs="6" md="6">
            <div className="panel panel-default">
               <div className="panel-heading">
                  <i className="fa fa-bell fa-fw"></i>
                  <h3>Jitter Ratio</h3>
               </div>
               <div className="panel-body">
                  <div className="list-group">
                    <JitterRatio />
                  </div>
               </div>
            </div>
             </Col>
            </Row>
            <Row>
            <Col xs="6" md="6">
            <div className="panel panel-default">
               <div className="panel-heading">
                  <i className="fa fa-bell fa-fw"></i>
                  <h3>Site Availability</h3>
               </div>
               <div className="panel-body">
                  <div className="list-group">
                      <SiteAvailability />
                  </div>
               </div>
            </div>
             </Col>
             <Col xs="6" md="6">
            <div className="panel panel-default">
               <div className="panel-heading">
                  <i className="fa fa-bell fa-fw"></i>
                  <h3></h3>
               </div>
               <div className="panel-body">
                  <div className="list-group">

                  </div>
               </div>
            </div>
             </Col>
            </Row>
            <CustomerMetricsDashboard/>

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
