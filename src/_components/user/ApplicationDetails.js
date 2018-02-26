import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { color } from '../../_constants';
import { indexOf } from 'lodash';
import { Container, Row, Col, select } from 'reactstrap';
import SortableTbl from 'react-sort-search-table';
import { userConstants } from '../../_constants';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';
import { Route, Redirect, Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Dialog } from './../common/Dialog';
import { Filter } from '../';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};


let getApplicationDetails = (user) => {
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
    let sourceSite;
    if (customerMetricsData != null && customerMetricsData != undefined) {

        for (let [metricsDataKey, metricsDataValue] of Object.entries(customerMetricsData)) {
            let count = 0;
            if (metricsDataValue.sites != null && metricsDataValue.sites != undefined) {
                let sites = metricsDataValue.sites;
                for (let site = 0; site < 1; site++) {
                    sourceSite = sites[site].name;
                    let devices = sites[site].devices;
                    for (let device = 0; device < devices.length; device++) {
                        for (let [deviceKey, deviceValue] of Object.entries(devices[device])) {
                            for (let cpe = 0; cpe < 1; cpe++) {

                                for (let [cpeKey, cpeValue] of Object.entries(deviceValue[cpe])) {
                                    for (let application = 0; application < cpeValue.length; application++) {
                                        for (let [applicationKey, applicationValue] of Object.entries(cpeValue[application])) {
                                            let deviceData = {};
                                            deviceData["is_no_route"] = 0;
                                            for (let [key, value] of Object.entries(applicationValue)) {
                                                deviceData["CPE"] = deviceKey;
                                                deviceData["application"] = applicationKey;
                                                if (key == "is_no_route") {
                                                    if (value) {
                                                        deviceData["is_no_route"] = 1;
                                                    }
                                                } else if (key == "route_change") {
                                                    if (value.length > 1) {
                                                        deviceData["route_change"] = value.length;
                                                    } else {
                                                        deviceData["route_change"] = value.length - 1;
                                                    }
                                                    for (let [k, v] of Object.entries(value)) {
                                                        for (let [routeChangeKey, routeChangeValue] of Object.entries(v)) {

                                                            if ((routeChangeKey == "utilization" || routeChangeKey == "latency"
                                                                || routeChangeKey == "jitter" || routeChangeKey == "packet_loss") && deviceData[routeChangeKey] != undefined) {

                                                                if (deviceData[routeChangeKey] > 0 && routeChangeValue > 0) {

                                                                    deviceData[routeChangeKey] = (deviceData[routeChangeKey] + routeChangeValue) / 2;
                                                                } else {
                                                                    deviceData[routeChangeKey] = routeChangeValue;
                                                                }
                                                            } else {
                                                                deviceData[routeChangeKey] = routeChangeValue;
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    deviceData[key] = value;
                                                }
                                            }
                                            tableMetricsData.push(deviceData);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
    }

    return [tableMetricsData, sourceSite];
};


let col = [

    "application",
    "destination",
    "CPE",
    "link",
    "octets",
    "packets",
    "route_change",
    "is_no_route"
];
let tHead = [

    "Application",
    "Destination Site",
    "CPE",
    "Link",
    "Octets (K)",
    "Packets (K)",
    "Route Change",
    "No Route"
];

let eventCol = [

    "event",
    "application",
    "destination",
    "CPE",
    "link",
    "utilization",
    "latency",
    "jitter",
    "packet_loss"

];

let eventHead = [

    "Event",
    "Application",
    "Destination Site",
    "CPE",
    "Link",
    "Link Utilization (%)",
    "Latency (ms)",
    "Jitter (ms)",
    "Packet Loss (%)",
    "Action"
];

class ApplicationDetails extends React.Component {
    constructor() {
        super();

        this.state = {
            modalIsOpen: false
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {
        console.log("Prent close model ")
        this.setState({ modalIsOpen: false });
    }

    render() {
        let user = this.props.authentication.user;
        let applicationDetail = getApplicationDetails(user);
        let applicationDetails = applicationDetail[0];
        let index = 0;
        let tableData = [];
        let headerData = [];
        let eventHeaderData = [];
        let eventData = [];
        let event = 1;
        let routeEvent;
        let site = [];
        let siteOption = [];
        siteOption.push(<option key={"source"}>{applicationDetail[1]}</option>);
        eventHeaderData.push(<th key={0}>ID</th>)
        for (let index = 0; index < eventHead.length; index++) {
            eventHeaderData.push(<th key={index + 1}>{eventHead[index]}</th>);
        }
        eventData.push(<tr className="appdetailsTH" key={"eventHeader"}>{eventHeaderData}</tr>)

        headerData.push(<th key={0}>ID</th>)
        for (let index = 0; index < tHead.length; index++) {
            headerData.push(<th key={index + 1}>{tHead[index]}</th>);
        }
        tableData.push(<tr className="appdetailsTH" key={"header"}>{headerData}</tr>)
        for (let applicationIndex = 0; applicationIndex < applicationDetails.length; applicationIndex++) {
            let rowData = [];
            let rowEventData = [];
            if (site.indexOf(applicationDetails[applicationIndex]["destination"]) == -1) {
                site.push(applicationDetails[applicationIndex]["destination"]);
                siteOption.push(<option key={applicationIndex}>{applicationDetails[applicationIndex]["destination"]}</option>);
            }
            rowData.push(<td key={"id"}>{applicationIndex + 1}</td>);
            for (let index = 0; index < col.length; index++) {
                rowData.push(<td key={col[index]}>{applicationDetails[applicationIndex][col[index]]}</td>);
            }

            if (applicationDetails[applicationIndex].is_no_route == true || applicationDetails[applicationIndex].route_change > 0) {
                rowEventData.push(<td key={"id"}>{event}</td>);
                event++;
                for (let index = 0; index < eventCol.length; index++) {
                    if (eventCol[index] == "event") {
                        if (applicationDetails[applicationIndex].is_no_route == true) {
                            routeEvent = "is_no_route";
                            rowEventData.push(<td key={eventCol[index]}>{"No Route"}</td>);
                        } else {
                            routeEvent = "route_change";
                            rowEventData.push(<td key={eventCol[index]}>{"Route Change"}</td>);
                        }
                    } else {
                        rowEventData.push(<td key={eventCol[index]}>{applicationDetails[applicationIndex][eventCol[index]]}</td>);
                    }
                }

                rowEventData.push(<td key={"button"}>
                    <button className="btn btn-primary" type="button" onClick={this.openModal}>
                        More
                      </button>
                </td>);


            }
            eventData.push(<tr key={applicationIndex}>{rowEventData}</tr>);
            tableData.push(<tr key={applicationIndex}>{rowData}</tr>);
        }
        if (event == 1) {
            eventData = [];
            eventHeaderData = [];
        }


        return (
            <div>
                <Col xs="12>" sm="12" md="12" lg="12" xl="12">

                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <Row>
                                <Col xs="7" sm="7" md="7" lg="8" xl="8">

                                    <h3> Application Routing Details : {applicationDetail[1]} </h3>
                                </Col>

                                <Col xs="2" sm="2" md="2" lg="1" xl="1">
                                    <div>
                                        <h5 style={{ marginTop: "10px" }}> Source Site </h5>
                                    </div>
                                </Col>

                                <Col xs="3" sm="4" md="3" lg="3" xl="3">
                                    <div className="form-group">
                                        <select className="form-control">
                                            {siteOption}
                                        </select>
                                    </div>
                                </Col>
                            </Row>
                        </div>


                        <div className="panel-body">
                            <div className="list-group">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            {tableData}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <i className=""></i>
                            <h3> Event Details </h3>
                        </div>
                        <div className="panel-body">
                            <div className="list-group">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            {eventData}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Dialog isOpen={this.state.modalIsOpen} closeModal={this.closeModal} />
            </div>
        );

    }
}


function mapStateToProps(state) {
    const { authentication } = state;

    return {
        authentication
    };
}


const connectedApplicationDetails = connect(mapStateToProps)(ApplicationDetails);
export { connectedApplicationDetails as ApplicationDetails };
