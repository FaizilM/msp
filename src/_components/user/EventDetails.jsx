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
                   <Link to="/customer">
                        <button className= "btn btn-primary" type="button">
                            Back
                      </button>
                    </Link>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                       <i className=""></i>
                       <h3>Event Details</h3>
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
                                <table className="table table-striped table-bordered view_page_table">
                                   <tbody>
                                      <tr>
                                         <td>Source Site  </td>
                                         <td>San Francisco</td>
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
