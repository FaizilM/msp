import React, { Component } from 'react';
import '../../assets/css/App.css';
import metricsData from '../../metricsData.json';
import { indexOf, replace } from 'lodash';
import { Container, Row, Col } from 'reactstrap';
import SortableTbl from 'react-sort-search-table'
import ImageLoader from 'react-imageloader';

class SLAMetrics extends Component {

    render() {

        return (
            <Col xs="12" sm="12" md="12" lg="6" xl="6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <i className=""></i>
                        <h3>SLA Metrics</h3>
                    </div>
                    <div className="table-responsive">
                        <table className="inventory table">
                            <tbody>
                                <tr key="SLA Metrics">
                                    <td>SLA Metrics</td>
                                    <td>5</td>
                                </tr>
                                <tr key="MTTR(Hours)">
                                    <td>MTTR(Hours)</td>
                                    <td>2</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </Col>

        );
    }
};

export { SLAMetrics };
