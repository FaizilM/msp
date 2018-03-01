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
import { getValueByTime } from '../../_helpers/shared';
import { getKPIDataByPercentage } from '../../_helpers/shared';

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


let getApplicationDetails = (user, filter) => {
    let metrics = [];
    let data = {};
    let applicationDetails = [];
    let eventDetails = [];
    let appDetails = [];
    if (user.role == userConstants.ROLE_ADMIN) {
        metrics.push(metricsData);
    } else if (user.role == userConstants.ROLE_USER) {
        data = {};
        data["customers"] = metricsData
        data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
            data: data
        }).value;
        metrics.push(data["customers"]);
    }
    let tableMetricsData = [];
    let sourceSite;
    if (metrics != null && metrics != undefined) {


        let source = filter.sourceSite;
        let query;
        if (filter.duration == "MONTH" || filter.duration == "YEAR") {
            metrics[0]["sites"][0]["devices"][0]["CPE"][0]["applications_details"][0]["mpls"]["event"] = "Route Change";
            metrics[0]["sites"][0]["devices"][0]["CPE"][0]["applications_details"][0]["broadband"]["event"] = "Route Change";
        }
        data = {};
        data["deviceData"] = metrics;

        if (source == undefined || source == "" || source == "All Source") {
            query = "deviceData[sites].devices";
        } else {
            query = 'deviceData[sites][**][name=' + source + '].devices'
        }
        data["deviceData"] = jsonQuery(query, {
            data: data
        }).value;
        metrics = [];
        metrics = data["deviceData"]
        let cpedata = {};
        for (let index = 0; index < metrics.length; index++) {
            for (let [key, value] of Object.entries(metrics[index])) {
                cpedata[key] = value;
            }
        }
        metrics = [];
        metrics.push(cpedata);
        let deviceQuery;
        let cpe = filter.cpeValue;
        if (cpe == undefined || cpe == "" || cpe == "All CPE") {
            deviceQuery = 'deviceList[**][0][**].applications_details';
        } else {
            deviceQuery = 'deviceList[**][0][' + cpe + '].applications_details';
        }

        data = {};
        data["deviceList"] = metrics;
        data["deviceList"] = jsonQuery(deviceQuery, {
            data: data
        }).value;
        metrics = [];
        if (cpe == undefined || cpe == "" || cpe == "All CPE") {
            metrics = data["deviceList"];
        } else {
            metrics = data["deviceList"];
        }

        let link = filter.linkName;
        deviceQuery = {};
        let deviceData = [];
        for (let index = 0; index < metrics.length; index++) {
            data = {};
            data["appFamily"] = metrics[index];
            if (link == undefined || link == "" || link == "All Links") {
                deviceQuery = 'appFamily[**]'
            } else {
                deviceQuery = 'appFamily[' + link + ']'
            }

            data["appFamily"] = jsonQuery(deviceQuery, {
                data: data
            }).value;
            if (link == undefined || link == "" || link == "All Links") {
                for (let i = 0; i < data["appFamily"].length; i++) {
                    deviceData.push(data["appFamily"][i]);
                }
            } else {
                deviceData.push(data["appFamily"]);
            }

        }

        let appFamilies = filter.appFamilies;
        deviceQuery = {};
        data = {};
        data["applicationData"] = deviceData;
        if (appFamilies == undefined || appFamilies == "" || appFamilies == "All Application Family") {
            deviceQuery = 'applicationData'
        } else {
            deviceQuery = 'applicationData[app_family=' + appFamilies + ']';
        }

        data["applicationData"] = jsonQuery(deviceQuery, {
            data: data
        }).value;
        metrics = [];

        if (appFamilies == undefined || appFamilies == "" || appFamilies == "All Application Family") {
            metrics = data["applicationData"];
        } else {
            metrics.push("appFamily", data["applicationData"]);
        }
        let destination = filter.destinationSite;
        for (let index = 0; index < metrics.length; index++) {
            let sitename;
            if (destination == undefined || destination == "" || destination == "All Sites") {
                applicationDetails.push(metrics[index]);
            } else {
                if (metrics[index]["destination"] == destination) {
                    applicationDetails.push(metrics[index]);
                }
            }
        }


        appDetails = [];
        eventDetails = [];
        let application = filter.application;
        for (let index = 0; index < applicationDetails.length; index++) {
            let sitename;
            if (application == undefined || application == "" || application == "All Applications") {
                appDetails.push(applicationDetails[index]);
                if (applicationDetails[index]["event"] != "app_route" &&
                    ((applicationDetails[index]["event"] == "Route Change" &&
                        filter.duration == "MONTH" || filter.duration == "YEAR") ||
                        (applicationDetails[index]["event"] == "No Route"))) {
                    eventDetails.push(applicationDetails[index]);
                }
            } else {
                if (applicationDetails[index]["application"] == application) {
                    appDetails.push(applicationDetails[index]);
                    if (applicationDetails[index]["event"] != "app_route" &&
                        ((applicationDetails[index]["event"] == "Route Change" &&
                            filter.duration == "MONTH" || filter.duration == "YEAR") ||
                            (applicationDetails[index]["event"] == "No Route"))) {
                        eventDetails.push(applicationDetails[index]);
                    }
                }
            }
        }
    }
    return [appDetails, eventDetails];
};
let col = [
    "app_family",
    "application",
    "direction",
    "sla_class",
    "dscp_value",
    "octets",
    "packets",
    "mean_latency",
    "mean_jitter",
    "avg_packet_loss"
];

let head = [
    "Application Family",
    "Application",
    "Direction",
    "SLA class",
    "DSCP value",
    "Octets(k)",
    "Packets(k)",
    "Mean Latency(ms)",
    "Mean Jitter(ms)",
    "Average Packet Loss(%)",
    "Plot"
];

let eventCol = [
    "event",
    "timestamp",
    "app_family",
    "application",
    "sla_class",
    "dscp_value",
    "utilization",
    "jitter",
    "latency",
    "packet_loss"
];

let eventHead = [
    "Event",
    "Timestamp",
    "Application Family",
    "Application",
    "SLA class",
    "DSCP value",
    "Link Utilization(%)",
    "Jitter(ms)",
    "Latency(ms)",
    "Packet Loss(%)",
    "Plot"
];



class ApplicationDetails extends React.Component {
    constructor() {
        super();

        this.state = {
            modalIsOpen: false,
            eventType: ""
        };


        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal(e) {
        this.setState({ modalIsOpen: true, eventType: e.target.id });
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
    }

    closeModal() {

        this.setState({ modalIsOpen: false });
    }

    render() {
        let user = this.props.authentication.user;
        let filter = this.props.filter;
        let applicationDetails = getApplicationDetails(user, filter);
        let applicationDetail = applicationDetails[0];
        let eventDetails = applicationDetails[1];
        let siteOption = [];
        let appDetailsData = [];
        let headerData = [];
        let eventData = [];
        let headerEvent = [];
        let checkEventData = [];
        let checkAppData = [];

        for (let index = 0; index < head.length; index++) {
            headerData.push(<th key={head[index]}>{head[index]}</th>);
        }
        appDetailsData.push(<tr className="appdetailsTH" key={"head"}>{headerData}</tr>);

        for (let i = 0; i < applicationDetail.length; i++) {
            let data = [];
            for (let index = 0; index < col.length; index++) {
                let timeFrameValue = applicationDetail[i][col[index]];
                if ((filter.duration != undefined && filter.duration != "") && (col[index] == "octets" || col[index] == "packets" ||
                    col[index] == "mean_latency" || col[index] == "mean_jitter")) {
                    timeFrameValue = getValueByTime(applicationDetail[i][col[index]], filter.duration);
                }
                if (col[index] == "avg_packet_loss") {
                    timeFrameValue = getKPIDataByPercentage(applicationDetail[i][col[index]], filter.duration);
                }
                data.push(<td key={col[index]}>{timeFrameValue}</td>);
            }
            if (applicationDetail.length > 0) {
                data.push(<td key={"button"}>
                    <button className="btn btn-primary" type="button" id={"app_route"} onClick={this.openModal}>
                        More
              </button>
                </td>);
                appDetailsData.push(<tr key={"applicationDetail" + i}>{data}</tr>);
            }
        }
        if (applicationDetail.length == 0) {
            checkAppData.push(
                <h3 style={{ "fontWeight": "bold", "textAlign": "center" }} key={"noData"}> No Data Available </h3>
            );
        }

        for (let index = 0; index < eventHead.length; index++) {
            headerEvent.push(<th key={eventHead[index]}>{eventHead[index]}</th>);
        }
        eventData.push(<tr className="appdetailsTH" key={"head"}>{headerEvent}</tr>);
        for (let i = 0; i < eventDetails.length; i++) {
            let data = [];
            for (let index = 0; index < eventCol.length; index++) {
                let timeFrameValue = eventDetails[i][eventCol[index]];
                if ((filter.duration != undefined && filter.duration != "") && (
                    eventCol[index] == "utilization" ||
                    eventCol[index] == "packet_loss")) {
                    timeFrameValue = getKPIDataByPercentage(applicationDetail[i][col[index]], filter.duration);
                    if (timeFrameValue > 100) {
                        timeFrameValue = 95;
                    }
                }
                if ((filter.duration != undefined && filter.duration != "") && (
                    eventCol[index] == "jitter" ||
                    eventCol[index] == "latency")) {
                    timeFrameValue = getValueByTime(applicationDetail[i][col[index]], filter.duration);
                }
                if (eventCol[index] == "timestamp" && eventDetails[i]["event"] == "No Route") {
                    let firstDate = new Date();
                    // now set 500 minutes back
                    firstDate.setMinutes(firstDate.getDate() - 200);
                    eventDetails[i][eventCol[index]] = firstDate + "";
                }
                if (eventCol[index] == "timestamp" && eventDetails[i]["event"] == "Route Change") {
                    let firstDate = new Date();
                    // now set 500 minutes back
                    firstDate.setMinutes(firstDate.getDate() - 300);
                    eventDetails[i][eventCol[index]] = firstDate + "";
                }
                data.push(<td key={timeFrameValue}>{timeFrameValue}</td>);
            }
            if (eventDetails.length > 0) {
                data.push(<td key={"button"}>
                    <button className="btn btn-primary" type="button" id={eventDetails[i]["event"]} onClick={this.openModal}>
                        More
              </button>
                </td>);
                eventData.push(<tr key={"eventDetails" + i}>{data}</tr>);
            }

        }
        if (eventDetails.length == 0) {
            checkEventData.push(
                <h3 style={{ "fontWeight": "bold", "textAlign": "center" }} key={"noData"}> No Data Available </h3>
            );
        }

        return (
            <div>
                <Col xs="12>" sm="12" md="12" lg="12" xl="12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4> Application Routing Details </h4>
                        </div>
                        <div className="panel-body">
                            <div className="list-group">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            {appDetailsData}
                                        </tbody>
                                    </table>
                                    {checkAppData}
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs="12>" sm="12" md="12" lg="12" xl="12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4> Routing Details </h4>
                        </div>
                        <div className="panel-body">
                            <div className="list-group">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            {eventData}
                                        </tbody>
                                    </table>
                                    {checkEventData}

                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
                <Dialog isOpen={this.state.modalIsOpen} closeModal={this.closeModal} eventType={this.state.eventType} />
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
