import React from 'react';
import { connect } from 'react-redux';
import '../../assets/css/App.css';
import { Inventory, Sites, PacketLoss, LinkCapacity, LatencyRatio, JitterRatio, SiteAvailability, CustomerMetrics, MPLSLinkUtilization } from '../';
import { userActions } from '../../_actions';
import { Link, Events } from 'react-scroll';
import { Header } from '../Header';
import { Container, Row, Col } from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap'


class AdminDashboard extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            key: 1,
            duration:"HOUR"
        };

        this.gotoCustomerMetrics = this.gotoCustomerMetrics.bind(this);
        this.setDuration = this.setDuration.bind(this);
    }

    gotoCustomerMetrics(key) {
        this.setState({ key: key });
    }
    setDuration(duration) {
        this.setState({ duration: duration });
    }


    render() {
        const { user, users } = this.props;
        return (

            <Tabs activeKey={this.state.key}
                onSelect={this.gotoCustomerMetrics}
                id="controlled-tab-example">
                <Tab eventKey={1} title="Dashboard">
                    <Row>
                        <Inventory />
                        <Col xs="12" sm="12" md="6" lg="6" xl="6">
                            <Sites clickevent={this.gotoCustomerMetrics} duration={this.setDuration}/>
                        </Col>
                    </Row>
                    <Row>
                        <CustomerMetrics id="customerData" currentTimeFrame={this.state.duration}/>
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
                        <MPLSLinkUtilization />
                    </Row>
                </Tab>
                {/* <Tab eventKey={2} title="Customer Metrics">
                    <Row>
                        <CustomerMetrics />
                    </Row>
                </Tab> */}
            </Tabs>

        );
    }
}

function mapStateToProps(state) {

    const { users, authentication, tabChange } = state;
    const { user } = authentication;
    return {
        user,
        users,
        tabChange
    };

}

const connectedAdminDashboard = connect(mapStateToProps)(AdminDashboard);
export { connectedAdminDashboard as AdminDashboard };
