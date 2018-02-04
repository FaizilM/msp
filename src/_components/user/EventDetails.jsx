import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { color } from '../../_constants';
import { indexOf } from 'lodash';
import { Container, Row, Col, select } from 'reactstrap';
import { Tabs, TabList, DragTabList, Tab, DragTab, PanelList, Panel, ExtraButton } from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bootstrap';
import { Route, Redirect, Link } from 'react-router-dom';

class EventDetails extends React.Component {
    render() {

        return (
            <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                       <i className=""></i>
                       <h3>Event Details</h3>
                       <div class="pull-right">
                       <Link to="/customer">
               <button className= "btn btn-primary" type="button">
                   Back
             </button>
           </Link>
                            </div>
                    </div>
                    <div className="panel-body">
                       <div className="list-group">
                          <table className="table table-striped table-bordered view_page_table">
                             <tbody>
                                <tr>
                                   <td>Source Site  </td>
                                   <td>San Francisco</td>
                                </tr>
                                <tr>
                                   <td>Destination Site  </td>
                                   <td>Boston</td>
                                </tr>
                                <tr>
                                  <td>Source IP  </td>
                                  <td>10.25.12.35</td>
                                </tr>
                                <tr>
                                  <td>Destination IP  </td>
                                  <td>10.25.12.75</td>
                                </tr>
                                <tr>
                                  <td>Latency  </td>
                                  <td>25ms</td>
                                </tr>
                                <tr>
                                  <td>Jitter  </td>
                                  <td>255ms</td>
                                </tr>
                                <tr>
                                  <td>Link  </td>
                                  <td>MPLS</td>
                                </tr>
                             </tbody>
                          </table>
                          <Tabs customStyle={customStyle}>
                            <TabList>
                              <Tab>Route Changes</Tab>
                            </TabList>
                            <PanelList>
                              <Panel>
                                <Row>
                                <table className="table table-striped table-bordered">
                                <thead>
                                      <tr>
                                        <th>Component Name</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Status</th>
                                        <th>Protocol</th>
                                        <th>latency</th>
                                        <th>Timstamp</th>
                                        <th>Details</th>
                                      </tr>
                                    </thead>
                                   <tbody>
                                      <tr>
                                        <th>App-Route</th>
                                        <th>198.25.64.25</th>
                                        <th>198.25.36.27</th>
                                        <th>UP</th>
                                        <th>ipsec</th>
                                        <th>15ms</th>
                                        <th>1489606442000</th>
                                        <th>host-name=vhub1</th>
                                      </tr>
                                    </tbody>
                                </table>
                                </Row>
                              </Panel>
                            </PanelList>
                          </Tabs>
                       </div>
                    </div>
                  </div>
                  </Col>
              </Row>
        );

    }
}

export { EventDetails };
