import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { color } from '../../_constants';
import { indexOf } from 'lodash';
import { Container, Row, Col, select } from 'reactstrap';
import { Tabs, TabList, DragTabList, Tab, DragTab, PanelList, Panel, ExtraButton } from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bootstrap';
import { Route, Redirect, Link } from 'react-router-dom';
import { userConstants } from '../../_constants';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';

let getEventDetails = (user, routeType) => {
  let customerMetricsData = [];
  if (user.role == userConstants.ROLE_ADMIN) {
    customerMetricsData.push(metricsData);
  } else if (user.role == userConstants.ROLE_USER) {
    let data = {};
    data["customers"] = metricsData
    data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
      data: data
    }).value;
    customerMetricsData.push(data["customers"]);
  }

  let tableMetricsData = [];
  if (customerMetricsData != null && customerMetricsData != undefined) {

    for (let [metricsDataKey, metricsDataValue] of Object.entries(customerMetricsData)) {
      let count = 0;
      if (metricsDataValue.sites != null && metricsDataValue.sites != undefined) {
        let sites = metricsDataValue.sites;

        for (let site = 0; site < 1; site++) {
          let devices = sites[site].devices;
          let routeDetails = sites[site].route_details;

          let routeData = undefined;
          let deviceData = {};
          for (let device = 0; device < devices.length; device++) {
            for (let [deviceKey, deviceValue] of Object.entries(devices[device])) {
              for (let cpe = 0; cpe < 1; cpe++) {

                for (let [cpeKey, cpeValue] of Object.entries(deviceValue[cpe])) {

                  for (let application = 0; application < cpeValue.length; application++) {

                    for (let [applicationKey, applicationValue] of Object.entries(cpeValue[application])) {
                      if (routeData == undefined) {
                        deviceData["source"] = sites[site].name;
                        if (routeType) {
                          if (applicationValue[routeType]) {
                            routeData = applicationValue;
                          }
                        } else {
                          if (applicationValue[routeType].length > 1 && applicationValue[route] != true) {
                            routeData = applicationValue;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            let deviceRouteData = {};
            let arrayDeviceRoute = [];

            for (let [routeDataKey, routeDataValue] of Object.entries(routeData)) {
              if (routeDataKey == "route_change") {
                for (let index = 0; index < routeDataValue.length; index++) {
                  deviceRouteData = {};
                  for (let [key, value] of Object.entries(routeDataValue[index])) {
                    deviceRouteData[key] = value;

                    if ((key == "utilization" || key == "latency"
                      || key == "jitter" || key == "packet_loss") && deviceData[key] != undefined) {

                      if (deviceData[key] > 0 && value > 0) {
                        deviceData[key] = (deviceData[key] + value) / 2;
                      } else if (value != 0) {
                        deviceData[key] = value;
                      }
                    } else if ((key == "utilization" || key == "latency"
                      || key == "jitter" || key == "packet_loss") && deviceData[key] == undefined) {
                      deviceData[key] = value;
                    }

                  }
                  arrayDeviceRoute.push(deviceRouteData);
                }
              } else {
                console.log("else", routeDataKey, routeDataValue);

                deviceData[routeDataKey] = routeDataValue;
              }
            }
            let device = [];

            device.push(deviceData);
            device.push(arrayDeviceRoute);
            device.push(routeDetails);


            return device;
          }

        }
      }

    }
  }
}

class EventDetails extends React.Component {

  render() {


    let col = [

      "source",
      "destination",
      "source_ip",
      "destination_ip",
      "link",
      "time",
      "utilization",
      "packet_loss",
      "jitter",
      "latency",
      "SLA_latency",
      "policy",
      "alternate_path",
      "link_taken",
      "protocol",


    ];
    let routeDetailsCol = [
      "CPE-VES",
      "local_diag",
      "demand_mode",
      "poll_mode",
      "min_txInt",
      "min_rxInt",
      "transmit_multiplier",
      "received_min_rxInt",
      "received_multiplier",
      "holdown",
      "hello",
      "rx_count",
      "rx_interval",
      "rx_last",
      "tx_count",
      "tx_interval",
      "tx_last",
      "registered_protocols",
      "uptime",
      "last_packet",
      "version",
      "diagnostic",
      "bit",
      "demand_bit",
      "poll_bit",
      "final_bit",
      "multiplier_bit",
      "length",
      "my_discr",
      "your_discr",
      "min_tx_interval",
      "min_rx_interval",
      "min_echo_interval"

    ];
    let routeDetailsHead = [
      "CPE-VES",
      "Local Diag",
      "Demand Mode",
      "Poll Bit",
      "MinTxInt",
      "MinRxInt",
      "Multiplier",
      "Received MinRxInt",
      "Received Multiplier",
      "Holdown (hits)",
      "Hello (hits)",
      "Rx Count",
      "Rx Interval (ms) min/max/avg",
      "Rx last",
      "Tx Interval (ms) min/max/avg",
      "Tx last",
      "Tx Count",
      "Registered Protocols",
      "Uptime",
      "Last Packet",
      "Version",
      "Diagnostic",
      "I Hear You bit",
      "Demand Bit",
      "Poll Bit",
      "Final Bit",
      "Multiplier",
      "Length",
      "My Discr",
      "Your Discr",
      "Min tx interval",
      "Min rx interval",
      "Min echo interval"

    ];
    let tHead = [

      "Source Site",
      "Destination Site",
      "Source IP",
      "Destination IP",
      "Link",
      "Time",
      "Utilization (%)",
      "Packet Loss (%)",
      "Jitter (ms)",
      "Latency (ms)",
      "SLA Latency",
      "Policy",
      "Alternate Path",
      "Link Taken",
      "Protocol"

    ];

    let user = this.props.authentication.user;
    let eventDetails = getEventDetails(user, this.props.match.params.route_type);
    let eventHeaderData = [];
    let rowEventData1 = [];
    let index = 0;
    let rowEventData2 = [];
    let routeHeaderData = [];
    let rowRouteData = [];
    let routeData = [];
    let routeDetails = [];
    let routeDetails1 = [];
    for (let index = 0; index < routeDetailsCol.length; index++) {

      if (index < 16) {
        routeDetails.push(<tr key={routeDetailsCol[index]}>

          <td style={{ "fontWeight": "bold" }}>{routeDetailsHead[index]}</td>
          <td >{eventDetails[2][0][routeDetailsCol[index]]}</td>
        </tr>);
      } else {
        routeDetails1.push(<tr key={routeDetailsCol[index]}>

          <td style={{ "fontWeight": "bold" }}>{routeDetailsHead[index]}</td>
          <td >{eventDetails[2][0][routeDetailsCol[index]]}</td>
        </tr>);
      }

    }

    for (let index = 0; index < col.length; index++) {

      if (index < 8) {
        rowEventData1.push(<tr key={col[index]}><td style={{ "fontWeight": "bold" }}>{tHead[index]}</td><td >{eventDetails[0][col[index]]}</td></tr>);
      } else {
        rowEventData2.push(<tr key={col[index]}><td style={{ "fontWeight": "bold" }}>{tHead[index]}</td><td >{eventDetails[0][col[index]]}</td></tr>);
      }

    }




    return (
      <Row>
        <Col xs="12" sm="12" md="12" lg="12" xl="12">
          <div className="panel panel-default">
            <i className=""></i>
            <div className="panel-heading">
              <div>
                <div className="inline_block">
                  <h3>Event Details</h3>
                </div>
                <div className="inline_block pull-right">
                  <Link to="/customer">
                    <button className="btn btn-primary" type="button">Back</button>
                  </Link>
                </div>
              </div>
            </div>
            <Row>
              <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <div className="panel-body">
                  <div className="list-group">
                    <Col xs="6" sm="6" md="6" lg="6" xl="6">
                      <table className="table table-striped table-bordered view_page_table">
                        <tbody>
                          {rowEventData1}
                        </tbody>
                      </table>
                    </Col>
                    <Col xs="6" sm="6" md="6" lg="6" xl="6">
                      <table className="table table-striped table-bordered view_page_table">
                        <tbody>
                          {rowEventData2}
                        </tbody>
                      </table>
                    </Col>
                    {(eventDetails && eventDetails.length > 1 && eventDetails[0].is_no_route) ? <Col xs="6" sm="6" md="6" lg="6" xl="6"><Link to="/trouble_shoot">
                      <button className="btn btn-danger btn-lg pull-right" type="button">TroubleShoot</button>
                    </Link></Col> : ""}
                  </div>
                </div>
              </Col>
            </Row>


          </div>
        </Col>


        <Col xs="12" sm="12" md="12" lg="12" xl="12">
          <div className="panel panel-default">
            <div className="panel-heading">
              <i className=""></i>
              <h3>Session Details</h3>
            </div>
            <div className="panel-body">
              <div className="list-group">
                <div className="list-group">
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <table className="table table-striped table-bordered view_page_table">
                      <tbody>
                        {routeDetails}
                      </tbody>
                    </table>
                  </Col>
                  <Col xs="6" sm="6" md="6" lg="6" xl="6">
                    <table className="table table-striped table-bordered view_page_table">
                      <tbody>
                        {routeDetails1}
                      </tbody>
                    </table>
                  </Col>
                </div>
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

const connectedEventDetails = connect(mapStateToProps)(EventDetails);
export { connectedEventDetails as EventDetails };
