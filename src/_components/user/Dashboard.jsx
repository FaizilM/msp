import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';

import { Container, Row, Col } from 'reactstrap';

import { Map } from './Map'
import { BussinessImpactEvent } from './BussinessImpactEvent'

import Sites from '../admin/Sites';
import PacketLoss from '../admin/PacketLoss';
import LinkCapacity from '../admin/LinkCapacity';
import LatencyRatio from '../admin/LatencyRatio';
import JitterRatio from '../admin/JitterRatio';
import SiteAvailability from '../admin/SiteAvailability';

class Dashboard extends React.Component {

    render() {
        return (


            <Container>
            <Row className="well">
                <Col xs="12" md="12">
                </Col>
            </Row>
            <Row>
                <Col xs="12" md="12">
                    <h3 className="page-header" style={{ textAlign: 'center' }}>Service Overview </h3>
                </Col>
            </Row>

                <Row>
                    <Col xs="12" md="12">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <i className="fa fa-bell fa-fw"></i> <h3>Dashboard</h3>
                            </div>
                            <div className="panel-body">
                                <div className="list-group">
                                    <Map />

                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>

                    <Col xs="6" md="6">

                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <i className="fa fa-bell fa-fw"></i> <h4> Bussiness Impacting Events</h4>
                            </div>
                            <div className="panel-body">
                                <div className="list-group">
                                    <BussinessImpactEvent />
                                </div>
                            </div>
                        </div>
                        <Col xs="6" md="6">

                        </Col>

                    </Col>
                </Row>
                <Row>
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
            </Container>

        );
    }
}


export { Dashboard };
