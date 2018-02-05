import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import { Header } from '../'
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';
import { Container, Row, Col } from 'reactstrap';
import { Sites, Filter, Map, BussinessImpactEvent, PacketLoss, LatencyRatio, JitterRatio, SiteAvailability } from '../';
import { Tabs, TabList, DragTabList, Tab, DragTab, PanelList, Panel, ExtraButton } from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bootstrap';

class UserDashboard extends React.Component {

  componentDidMount() {
    this.props.dispatch(userActions.getAll());
  }

  handleDeleteUser(id) {
    return (e) => this.props.dispatch(userActions.delete(id));
  }

  render() {

    const { user, users } = this.props;

    return (
      <Tabs customStyle={customStyle}>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Filter</Tab>
        </TabList>
        <PanelList>
          <Panel>
            <Row>
              <Map />
            </Row>
            <Row>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <Sites />
              </Col>
            </Row>
            <Row>
              <JitterRatio />
              <SiteAvailability />
            </Row>
            <Row>
              <LatencyRatio />
              <PacketLoss />
            </Row>
          </Panel>
          <Panel>
            <Row>
              <Filter />
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

const connectedUserDashboard = connect(mapStateToProps)(UserDashboard);
export { connectedUserDashboard as UserDashboard };
