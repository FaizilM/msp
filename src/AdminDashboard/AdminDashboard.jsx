import React from 'react';
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
import ApplicationClassMetrics from '../_components/admin/ApplicationClassMetrics';
import Bandwidth from '../_components/admin/Bandwidth';
import { userActions } from '../_actions';
import { Link, Events } from 'react-scroll';
import { Header } from '../_components/Header';
import { Container, Row, Col } from 'reactstrap';


class AdminDashboard extends React.Component {

    render() {

        const { user, users } = this.props;
        return (
            <div style={{ backgroundColor: "#F3F2F2" }}>

                <div className="app_container">
                    <Row className="well">
                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                            <h3 className="page-header" style={{ textAlign: 'left' }}>Dashboard</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md="6" lg="6" xl="6">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <i className=""></i>
                                    <h3>Inventory</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="list-group">
                                        <Inventory />
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs="12" sm="12" md="6" lg="6" xl="6">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <i className=""></i>
                                    <h3>Sites</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="list-group">
                                        <Sites />
                                    </div>

                                    <button className="btn btn-primary btn-block" style={{ width: "50%", marginLeft: "25%", marginTop: "8.5%" }}>
                                        <a href="#customerData" style={{ color: "white" }}><label>View All Sites</label></a>
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                      <SiteAvailability />
                        <LatencyRatio />

                    </Row>

                    <Row>
                    <JitterRatio />
                          <PacketLoss />

                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <i className=""></i>
                                    <h3>Link Capacity Utilization</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="list-group">
                                        <LinkCapacity />
                                    </div>
                                </div>
                            </div>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <i className=""></i>
                                    <h3>Customer Metrics Dashboard</h3>
                                </div>
                                <div className="panel-body">
                                    <div className="list-group" id="customer_metrics_table">
                                        <CustomerMetricsDashboard />
                                    </div>
                                </div>
                            </div>

                        </Col>
                    </Row>
                   
                </div>
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
