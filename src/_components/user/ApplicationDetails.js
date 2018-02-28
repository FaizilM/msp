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


let getApplicationDetails = (user, filter) => {
    console.log("filter", filter);
    let metrics = [];
    let data = {};
    let applicationDetails = [];
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

        data = {};
        data["deviceData"] = metrics;
        let query;
        let source = filter.sourceSite;

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
        let application = filter.application;
        for (let index = 0; index < applicationDetails.length; index++) {
            let sitename;
            if (application == undefined || application == "" || application == "All Applications") {
                appDetails.push(applicationDetails[index]);
            } else {
                if (applicationDetails[index]["application"] === application) {
                    appDetails.push(applicationDetails[index]);
                }
            }
        }
    }
    return appDetails;
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
    "Octets",
    "Packets",
    "Mean Latency",
    "Mean Jitter",
    "Average Packet Loss",
    "Plot"
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
        let filter = this.props.filter;
        let applicationDetail = getApplicationDetails(user, filter);
        let applicationDetails = applicationDetail[0];
        let siteOption = [];
        let tableData = [];
        let appDetailsData = [];
        let appDetails = [];

        let headerData = [];
        for (let index = 0; index < head.length; index++) {
            headerData.push(<th key={head[index]}>{head[index]}</th>);
        }
        appDetailsData.push(<tr className="appdetailsTH" key={"head"}>{headerData}</tr>);

        for (let i = 0; i < applicationDetail.length; i++) {
            let data = [];
            for (let index = 0; index < col.length; index++) {
                data.push(<td key={col[index]}>{applicationDetail[i][col[index]]}</td>);
            }
            if (applicationDetail.length > 0) {
                data.push(<td key={"button"}>
                    <button className="btn btn-primary" type="button" onClick={this.openModal}>
                        More
              </button>
                </td>);
                appDetailsData.push(<tr key={"applicationDetail" + i}>{data}</tr>);
            }

        }

        return (
            <div>
                <Col xs="12>" sm="12" md="12" lg="12" xl="12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h3> Application Routing Details </h3>
                        </div>
                        <div className="panel-body">
                            <div className="list-group">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <tbody>
                                            {appDetailsData}
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
