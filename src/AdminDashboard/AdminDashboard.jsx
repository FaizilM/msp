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
import { userActions } from '../_actions';
import { Link, Events } from 'react-scroll';
import { Header } from '../_components/Header';
import { Container, Row, Col } from 'reactstrap';
import {Tabs, TabList,DragTabList,Tab, DragTab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bootstrap';


class AdminDashboard extends React.Component {


    constructor(props) {
      super(props)

      this.state = { tabIndex: 0 };
    }

    handleSelect(key) {
        this.setState({tabIndex:key})
        console.log(this.state)
    }
    render() {

        const { user, users } = this.props;


        return (
            <div style={{ backgroundColor: "#F3F2F2" }}>

                <div className="app_container">
                    <Row className="well">
                        <Col xs="12" sm="12" md="12" lg="12" xl="12">
                        </Col>
                    </Row>


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
                         </Panel>
                         <Panel>
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
                         </Panel>
                      </PanelList>
                    </Tabs>





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
