import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';
import { Container, Row, Col } from 'reactstrap';
import metricsData from '../../metricsData.json';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';

class TroubleShoot extends React.Component {

    render() {

        let user = this.props.authentication.user.username

        return (
        <Row>
          <Col xs="12" sm="12" md="12" lg="12" xl="12">
            <div className="panel panel-default">
                <i className=""></i>
                <div className="panel-heading">
                    <h3>Touble Shoot</h3>
                </div>
                <div className="panel-body">
                  <div className="list-group">
                </div>
              </div>
            </div>
          </Col>
        </Row>
        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;

    return {
        authentication
    };
}

const connectedTroubleShoot = connect(mapStateToProps)(TroubleShoot);
export { connectedTroubleShoot as TroubleShoot };
