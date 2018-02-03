import React from 'react';
import { connect } from 'react-redux';
import '../../assets/css/App.css';
import {Inventory, Sites, PacketLoss, LinkCapacity, LatencyRatio, JitterRatio, SiteAvailability, CustomerMetrics} from '../';
import { userActions } from '../../_actions';
import { Link, Events } from 'react-scroll';
import { Header } from '../Header';
import { Container, Row, Col } from 'reactstrap';
import { Tabs, TabList, DragTabList, Tab, DragTab, PanelList, Panel, ExtraButton } from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bootstrap';


class AdminDashboard extends React.Component {

    constructor(props) {
        super(props)

        this.state = { tabIndex: 0 };
    }

    handleSelect(key) {
        this.setState({ tabIndex: key })
        console.log(this.state)
    }

    render() {

        const { user, users } = this.props;

        return (
                    <Tabs customStyle={customStyle} defaultIndex={this.state.tabIndex}>
                        <TabList>
                            <Tab>Dashboard</Tab>
                            <Tab>Customer Metrics Dashboard</Tab>
                        </TabList>
                        <PanelList>
                            <Panel>
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

                                                <button className="btn btn-primary btn-block" style={{ width: "50%", marginLeft: "25%" }}>
                                                    <a onClick={() => this.handleSelect(1)} style={{ color: "white" }}><label>View All Sites</label></a>
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
                                    <LinkCapacity />
                                </Row>
                            </Panel>
                            <Panel>
                                <Row>
                                    <CustomerMetrics />
                                </Row>
                            </Panel>
                        </PanelList>
                    </Tabs>
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
