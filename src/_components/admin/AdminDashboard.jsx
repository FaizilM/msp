import React from 'react';
import { connect } from 'react-redux';
import '../../assets/css/App.css';
import { Inventory, Sites, PacketLoss, LinkCapacity, LatencyRatio, JitterRatio, SiteAvailability, CustomerMetrics, MPLSLinkUtilization } from '../';
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
        this.handleSelect =this.handleSelect.bind();
    }

    handleSelect() {
        this.setState({ tabIndex: 1 })
    }
    
    
    render() {
        const { user, users } = this.props;
        return (
            <Tabs customStyle={customStyle} defaultIndex={this.state.tabIndex}>
                <TabList>
                    <Tab handleSelect = {this.handleSelect}>Dashboard</Tab>
                    <Tab>Customer Metrics Dashboard</Tab>
                </TabList>
                <PanelList>
                    <Panel>
                        <Row>
                            <Inventory />
                            <Sites />
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
