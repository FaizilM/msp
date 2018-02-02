import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { color } from '../../_constants';
import { indexOf } from 'lodash';
import { Container, Row, Col, select } from 'reactstrap';
import SortableTbl from 'react-sort-search-table';

let getApplicationDetails = () => {
    let customerMetricsData = [];
    customerMetricsData.push(metricsData[0]);
    let tableMetricsData = [];
    if (customerMetricsData != null && customerMetricsData != undefined) {

        for (let [metricsDataKey, metricsDataValue] of Object.entries(customerMetricsData)) {
            let count = 0;
            if (metricsDataValue.sites != null && metricsDataValue.sites != undefined) {
                let sites = metricsDataValue.sites;

                for (let site = 0; site < 1; site++) {
                    let devices = sites[site].devices;
                    for (let device = 0; device < devices.length; device++) {
                        for (let [deviceKey, deviceValue] of Object.entries(devices[device])) {
                            for (let cpe = 0; cpe < 1; cpe++) {

                                for (let [cpeKey, cpeValue] of Object.entries(deviceValue[cpe])) {
                                    for (let application = 0; application < cpeValue.length; application++) {
                                        for (let [applicationKey, applicationValue] of Object.entries(cpeValue[application])) {
                                            let deviceData = {};
                                            for (let [key, value] of Object.entries(applicationValue)) {
                                                deviceData["CPE"] = deviceKey;
                                                deviceData["application"] = applicationKey;
                                                deviceData[key] = value;
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
    return tableMetricsData;
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

class ApplicationDetails extends React.Component {

    render() {
        let applicationDetails = getApplicationDetails();
        let index = 0;
        let tableData = [];
        let headerData = [];
        for (let index = 0; index < tHead.length; index++) {
            headerData.push(<th>{tHead[index]}</th>)
        }
        tableData.push(<tr key={"header"}>{headerData}</tr>)
        for (let applicationIndex = 0; applicationIndex < applicationDetails.length; applicationIndex++) {
            let rowData = [];
            for (let index = 0; index < col.length; index++) {
                rowData.push(<td key={tHead[index]}>{applicationDetails[applicationIndex][col[index]]}</td>);
            }

            tableData.push(<tr key={applicationIndex}>{rowData}</tr>);

        }


        return (
            <Col xs="12" sm="12" md="6" lg="6" xl="6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <i className=""></i>
                        <h3> Application Class Metrics </h3>
                    </div>
                    <div className="panel-body">
                        <div className="list-group">
                            <div className="table-responsive">
                                <table className="table">
                                    <tbody>
                                        {tableData}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Col >

        );

    }
}

export { ApplicationDetails };