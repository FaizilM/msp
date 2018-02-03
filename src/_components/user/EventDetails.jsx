import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { color } from '../../_constants';
import { indexOf } from 'lodash';
import { Container, Row, Col, select } from 'reactstrap';

class EventDetails extends React.Component {
    render() {

        return (
            <Row>
            <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <i className=""></i> <h3>Event Detaisls</h3>
                    </div>
                    <div className="panel-body">
                        <div className="list-group">
                            <div>
                              Event Details
                            </div>

                        </div>
                    </div>
                </div>
            </Col>
            </Row>

        );

    }
}

export { EventDetails };
