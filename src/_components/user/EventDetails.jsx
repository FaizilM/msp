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
            let route = "is_no_route";
            console.log("route data", routeData);

            for (let [routeDataKey, routeDataValue] of Object.entries(routeData)) {
              if (routeDataKey == "route_change") {
                for (let index = 0; index < routeDataValue.length; index++) {
                  deviceRouteData = {};
                  for (let [key, value] of Object.entries(routeDataValue[index])) {
                    deviceRouteData[key] = value;
                    
                    if ((key == "utilization" || key == "latency"
                      || key == "jitter" || key == "packet_loss") && deviceData[key] != undefined) {
                        console.log("def", key, value);
                        if (value > 0) {
                        deviceData[key] = (deviceData[key] + value);
                      } else {
                        deviceData[key] = value;
                      }
                    } else if((key == "utilization" || key == "latency"
                    || key == "jitter" || key == "packet_loss") && deviceData[key] == undefined) {
                     console.log("undef", key, value);
                     
                      deviceData[key] = value;
                    }
                  }
                  arrayDeviceRoute.push(deviceRouteData);
                }
              } else {
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
      "utilization",
      "packet_loss",
      "jitter",
      "latency"


    ];
    let routeDetailsCol =  [
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
      "tx_count",
      "registered_protocols",
      "uptime",
      "last_packet",
      "bit",
      "poll_bit",
      "multiplier_bit",
      "my_discr",
      "min_tx_interval",
      "min_echo_interval"
      
    ];
    let routeDetailsHead =  [
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
      "Tx Count",
      "Registered Protocols",
      "Uptime",
      "Last Packet",
      "I Hear You bit",
      "Poll Bit",
      "Multiplier",
      "My Discr",
      "Min tx interval",
      "Min echo interval"
    
  ];
    let tHead = [

      "Source Site",
      "Destination Site",
      "Source IP",
      "Destination IP",
      "Link",
      "Utilization (%)",
      "Packet Loss (%)",
      "Jitter (ms)",
      "Latency (ms)"

    ];

    let routeCol = [

      "component_name",
      "src_ip",
      "dst_ip",
      "timestamp",
      "protocol",
      "policy",
      "SLA_latency",
      "utilization",
      "latency",
      "jitter",
      "packet_loss",
      "status"

    ];

    let routeHead = [

      "Component Name",
      "Source IP",
      "Destination IP",
      "Timestamp",
      "Protocol",
      "Policy",
      "SLA Latency (ms)",
      "Utilization (%)",
      "Latency (ms)",
      "Jitter (ms)",
      "Packet Loss (%)",
      "Status"


    ];
    let user = this.props.authentication.user;

    let eventDetails = getEventDetails(user, this.props.match.params.route_type);
    let eventHeaderData = [];
    let rowEventData = [];
    let index = 0;
    let routeHeaderData = [];
    let rowRouteData = [];
    let routeData = [];
    let routeDetails = [];
    console.log("routeDetails data",eventDetails[2][0]);
    for (let index = 0; index < col.length; index++) {
      routeDetails.push(<tr key={col[index]}><td style={{ "fontWeight": "bold" }}>{routeDetailsHead[index]}</td><td >{eventDetails[2][0][routeDetailsCol[index]]}</td></tr>);
    }

    for (let index = 0; index < col.length; index++) {
      rowEventData.push(<tr key={col[index]}><td style={{ "fontWeight": "bold" }}>{tHead[index]}</td><td >{eventDetails[0][col[index]]}</td></tr>);
    }
    for (let index = 0; index < routeCol.length; index++) {
      routeHeaderData.push(<th className="appdetailsTH" key={routeCol[index]}>{routeHead[index]}</th>)
    }
    routeData.push(<tr key={0}>{routeHeaderData}</tr>)

    for (let i = 0; i < eventDetails[1].length; i++) {
      rowRouteData = [];

      for (let index = 0; index < routeCol.length; index++) {
        if (eventDetails[1][i][routeCol[index]] == "DOWN") {
          rowRouteData.push(<td style={{ "color": color.ORANGE_COLOR }} key={index}>{eventDetails[1][i][routeCol[index]]}</td>);
        } else if (eventDetails[1][i][routeCol[index]] == "UP") {
          rowRouteData.push(<td style={{ "color": color.GREEN_COLOR }} key={index}>{eventDetails[1][i][routeCol[index]]}</td>);
        } else {
          rowRouteData.push(<td key={index}>{eventDetails[1][i][routeCol[index]]}</td>);
        }
      }
      routeData.push(<tr key={i + 1}>{rowRouteData}</tr>)
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
            <div className="panel-body">
              <div className="list-group">
                <table className="table table-striped table-bordered view_page_table">
                  <tbody>
                    {rowEventData}
                    
                  </tbody>
                </table>
                <table className="table table-striped table-bordered view_page_table">
                  <tbody>
                    {routeDetails}
                    
                  </tbody>
                </table>
                <Link to="/trouble_shoot">
                  <button className="btn btn-danger btn-lg pull-right" type="button">TroubleShoot</button>
                </Link>
                <Tabs customStyle={customStyle}>
                  <TabList>
                    <Tab>Route Change</Tab>
                  </TabList>
                  <PanelList>
                    <Panel>
                      <Row>
                        <table className="table table-striped table-bordered">
                          <tbody>
                            {routeData}
                            
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


function mapStateToProps(state) {
  const { authentication } = state;

  return {
    authentication
  };
}

const connectedEventDetails = connect(mapStateToProps)(EventDetails);
export { connectedEventDetails as EventDetails };
