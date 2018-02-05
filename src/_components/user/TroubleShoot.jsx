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

let getEventDetails = (user) => {
    let customerMetricsData = [];
    let routeType = "is_no_route";
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
                                                }
                                            }


                                        }
                                    }
                                }
                            }
                        }
                        console.log("rouete ", routeData);

                        let deviceRouteData = {};
                        let arrayDeviceRoute = [];
                        for (let [routeDataKey, routeDataValue] of Object.entries(routeData)) {
                            if (routeDataKey == "route_change") {
                                for (let index = 0; index < routeDataValue.length; index++) {
                                    deviceRouteData = {};
                                    for (let [key, value] of Object.entries(routeDataValue[index])) {
                                        deviceRouteData[key] = value;
                                    }
                                    arrayDeviceRoute.push(deviceRouteData);
                                }
                            }
                        }
                        let device = [];
                        device.push(arrayDeviceRoute);
                        return device;
                    }

                }
            }

        }
    }
}




let avgCol = [

    "component_name",
    "src_ip",
    "dst_ip",
    "utilization",
    "jitter",
    "packet_loss"


];

let avgHead = [

    "Component Name",
    "Source IP",
    "Destination IP",
    "Utilization (%)",
    "Jitter (ms)",
    "Packet Loss (%)",
];

let routeCol = [

    "component_name",
    "src_ip",
    "dst_ip",
    "timestamp",
    "protocol",
    "policy",
    // "utilization",
    // "jitter",
    // "packet_loss",
    "status",
    "mpls_label",
    "TTL",
    "label_stack",
    "latency",
    "latency2",
    "latency3"

];

let routeHead = [

    "Component Name",
    "Source IP",
    "Destination IP",
    "Timestamp",
    "Protocol",
    "Policy",
    // "Utilization (%)",
    // "Jitter (ms)",
    // "Packet Loss (%)",
    "Status",
    "MPLS Label",
    "TTL",
    "Label Stack",
    "Latency1",
    "Latency2",
    "Latency3"


];
class TroubleShoot extends React.Component {

    render() {

        let user = this.props.authentication.user;
        let eventDetails = getEventDetails(user, this.props.match.params.route_type);
        let routeHeaderData = [];
        let rowRouteData = [];
        let routeData = [];
        let avgData = [];

        /**
         * Table for average data , for route details.
         */
        for (let index = 0; index < avgCol.length; index++) {
            routeHeaderData.push(<th className="appdetailsTH" key={avgCol[index]}>{avgHead[index]}</th>)
        }
        avgData.push(<tr key={0}>{routeHeaderData}</tr>)

        for (let i = 0; i < eventDetails[0].length; i++) {
            rowRouteData = [];

            for (let index = 0; index < avgCol.length; index++) {
                if (eventDetails[0][i][avgCol[index]] == "DOWN") {
                    rowRouteData.push(<td style={{ "color": color.ORANGE_COLOR }} key={index}>{eventDetails[0][i][avgCol[index]]}</td>);
                } else if (eventDetails[0][i][avgCol[index]] == "UP") {
                    rowRouteData.push(<td style={{ "color": color.GREEN_COLOR }} key={index}>{eventDetails[0][i][avgCol[index]]}</td>);
                } else {
                    rowRouteData.push(<td key={index}>{eventDetails[0][i][avgCol[index]]}</td>);
                }
            }
            avgData.push(<tr key={i + 1}>{rowRouteData}</tr>);
        }

        //To reset for the bnext table
        routeHeaderData = [];
        rowRouteData = [];

        for (let index = 0; index < routeCol.length; index++) {
            routeHeaderData.push(<th className="appdetailsTH" key={routeCol[index]}>{routeHead[index]}</th>)
        }
        routeData.push(<tr key={0}>{routeHeaderData}</tr>)

        for (let i = 0; i < eventDetails[0].length; i++) {
            rowRouteData = [];

            for (let index = 0; index < routeCol.length; index++) {
                if (eventDetails[0][i][routeCol[index]] == "DOWN") {
                    rowRouteData.push(<td style={{ "color": color.ORANGE_COLOR }} key={index}>{eventDetails[0][i][routeCol[index]]}</td>);
                } else if (eventDetails[0][i][routeCol[index]] == "UP") {
                    rowRouteData.push(<td style={{ "color": color.GREEN_COLOR }} key={index}>{eventDetails[0][i][routeCol[index]]}</td>);
                } else {
                    rowRouteData.push(<td key={index}>{eventDetails[0][i][routeCol[index]]}</td>);
                }
            }
            routeData.push(<tr key={i + 1}>{rowRouteData}</tr>);
        }
        return (
            <Row>
                 <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <div className="panel panel-default">
                        <i className=""></i>
                        <div className="panel-heading">
                            <h3> Topology</h3>
                        </div>

                        <div className="panel-body">
                            <div className="list-group">
                                <div>
                                    <img className="topologyImg" src="src/assets/images/topology-final.png" alt="topology" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <div className="panel panel-default">
                        <i className=""></i>
                        <div className="panel-heading">
                            <h3>Route Details</h3>
                        </div>

                        <div className="panel-body">
                            <div className="list-group">
                                <table className="table table-striped table-bordered">
                                    <tbody>
                                        {routeData}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <div className="panel panel-default">
                        <i className=""></i>
                        <div className="panel-heading">
                            <h3>Average Details</h3>
                        </div>
                        <div className="panel-body">
                            <div className="list-group">
                                <table className="table table-striped table-bordered">
                                    <tbody>
                                        {avgData}
                                    </tbody>
                                </table>
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
