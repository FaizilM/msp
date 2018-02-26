import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../_actions';
import { Header } from '../'
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';
import { Container, Row, Col } from 'reactstrap';
import { ApplicationDetails, Sites, Filter, Map, BussinessImpactEvent, PacketLoss, LatencyRatio, JitterRatio, SiteAvailability } from '../';
import { Tabs, Tab } from 'react-bootstrap'


class UserDashboard extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      key: 1
    };

    this.gotoCustomerMetrics = this.gotoCustomerMetrics.bind(this);
  }

  gotoCustomerMetrics(key) {
    this.setState({ key: key });
  }

  componentDidMount() {
    this.props.dispatch(userActions.getAll());
  }

  componentWillMount() {

      let keys = 1;
      if(this.props.match.params && this.props.match.params.tab_id) {
          keys =  this.props.match.params.tab_id.match(/\d+/g);
          keys = parseInt(keys[0])
      }

      this.setState({ key: keys});
  }

  handleDeleteUser(id) {
    return (e) => this.props.dispatch(userActions.delete(id));
  }

  render() {

    const { user, users } = this.props;

    return (
      <Tabs activeKey={this.state.key}
        onSelect={this.gotoCustomerMetrics}
        id="controlled-tab-example">
        <Tab eventKey={1} title="Dashboard">
          <Row>
            <Map />
          </Row>
           <Row>
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
              <Filter />
            </Col>
          </Row>
          
        </Tab>
        <Tab eventKey={2} title="Visualization">
          <Row>
            <Filter type = {"visualization"}/>
          </Row>
        </Tab>
        <Tab eventKey={3} title="Application Details">
          <Row>
            <ApplicationDetails gotoCustomerMetrics={this.gotoCustomerMetrics}/>
          </Row>
        </Tab>
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
