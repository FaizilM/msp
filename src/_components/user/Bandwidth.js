import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { Chart } from '../';
import { color } from '../../_constants';
import { indexOf } from 'lodash';
import { Container, Row, Col, select } from 'reactstrap';
import { userConstants } from '../../_constants';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';

let bandwidthData = (filter, user) => {
    let metrics = [];
    let applicationSite = [];
    let applicationCustomer = [];
    let bandwidth = 0;
    let applicationSize = 0;
    let applicationSiteSize = 0;
    let siteName;
    let siteGroup;
    let linkName;
    let applicationName;

    if (userConstants.ROLE_ADMIN == user.role) {
        metrics = metricsData;
    } else if (user.role == userConstants.ROLE_USER) {
        let data = {};
        data["customers"] = metricsData
        data["customers"] = jsonQuery('customers[username=' + user.username + '].sites', {
            data: data
        }).value;
        metrics.push(data["customers"]);
    }
    if (filter != undefined) {
        if (filter.siteName != "" && filter.siteName != undefined && filter.siteName != "All Sites") {
          siteName = filter.siteName;
          data["sites"] = data["customers"];
          data["sites"] = jsonQuery('sites[name=' + filter.siteName + ']', {
            data: data
        }).value;
        } else {

        }
        if (filter.linkName != "" && filter.linkName != undefined && filter.linkName != "All Links") {
          linkName = filter.linkName;
        }
        if (filter.applicationName != "" && filter.applicationName != undefined && filter.applicationName != "All Applications") {
          applicationName = filter.applicationName;
        }
        if (filter.siteGroup != "" && filter.siteGroup != undefined && filter.siteGroup != "All Site Group") {
          siteGroup = filter.siteGroup;
        }
      }
    if (metricsData != null && metricsData != undefined) {

        // for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {
        //     let count = 0;

        //     if (metricsDataValue.sites != null && metricsDataValue.sites != undefined) {
        //         let sites = metricsDataValue.sites;

        //         for (let site = 0; site < sites.length; site++) {
        //             let application = sites[site].application;

        //             if (application != null && application != undefined) {

        //                 for (let [applicationKey, applicationValue] of Object.entries(application)) {

        //                     if (applicationValue != null && applicationValue != undefined) {

        //                         for (let [applicationDataKey, applicationDataValue] of Object.entries(applicationValue)) {

        //                             if (applicationDataValue != null && applicationDataValue != undefined) {

        //                                 for (let [classKey, classValue] of Object.entries(applicationDataValue)) {

        //                                     if (classValue != null && classValue != undefined) {

        //                                         for (let [classDataKey, classDataValue] of Object.entries(classValue)) {

        //                                             if ((classDataValue != null && classDataValue != undefined) && (classDataValue != null && classDataValue != undefined)) {

        //                                                 if (classDataKey != null && classDataKey != undefined) {

        //                                                     if (classDataKey == "bandwidth") {
        //                                                         bandwidth += classDataValue;
        //                                                         applicationSize++;
        //                                                     }
        //                                                 }
        //                                             }
        //                                         }
        //                                     }
        //                                 }
        //                             }
        //                         }
        //                     }
        //                 }
        //             }

        //             bandwidth = bandwidth / applicationSize;
        //             applicationSize = 0;

        //             if (applicationSite[sites[site].name] == undefined) {
        //                 applicationSite[sites[site].name] = bandwidth;
        //             } else {
        //                 applicationSite[sites[site].name] = (applicationSite[sites[site].name] + bandwidth) / 2;
        //             }
        //         }
        //     }
        // }
    }

    return applicationSite;
}

class Bandwidth extends Component {

    render() {

        let config = {
            "bar": {
                "theme": "light",
                "type": "serial",
                "startDuration": 0,
                "legend": {
                    "markerSize": 10,
                    "horizontalGap": 70,
                    "data": [
                        { "title": "Bandwidth", "color": color.BLUE_COLOR }
                    ]
                },
                "dataProvider": [],
                "valueAxes": [{
                    "position": "left",
                    "minimum": 0,
                    "maximum": 100,
                    "autoGridCount": false,
                    "gridCount": 5,
                    "gridAlpha": 0.2,
                    "step": 10
                }],
                "depth3D": 20,
                "angle": 30,
                "graphs": [{
                    "balloonText": "Percentage: <b>[[value]]%</b>",
                    "fillColorsField": "color",
                    "fillAlphas": 1,
                    "precision": 0,
                    "lineAlpha": 0.1,
                    "type": "column",
                    "fixedColumnWidth": 50,
                    "valueField": "bandwidth"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "rotate": true,
                "categoryField": "name",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0.2
                }

            }
        };

        let configValue = config.bar;
        let user = this.props.authentication.user;
        for (let [key, value] of Object.entries(configValue)) {

            if (key == "dataProvider") {

                for (let [bandwidthKey, bandwidthValue] of Object.entries(bandwidthData(this.props.filter, user))) {
                    let jsonBandwidthData = { "name": bandwidthKey, "bandwidth": bandwidthValue }
                    value.push(jsonBandwidthData);
                }
            }

        }

        return (

            <Col xs="12" sm="12" md="6" lg="6" xl="6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <i className=""></i>
                        <h3> Bandwidth </h3>
                    </div>
                    <div className="panel-body">
                        <div className="list-group">
                            <div>
                                <Chart config={configValue} />
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        );

    }
}


function mapStateToProps(state) {
    const { authentication } = state;

    return {
        authentication
    };
}

const connectedBandwidth = connect(mapStateToProps)(Bandwidth);
export { connectedBandwidth as Bandwidth };
