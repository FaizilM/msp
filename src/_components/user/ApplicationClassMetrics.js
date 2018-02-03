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

let customerClassMetrics = (filter, user) => {
    let metrics = [];
    let classMetrics = [];
    let customerClassMetricsData = [];

    if (userConstants.ROLE_ADMIN == user.role) {
        metrics = metricsData;
      } else if (user.role == userConstants.ROLE_USER) {
        let data = {};
        data["customers"] = metricsData
        data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
          data: data
        }).value;
        metrics.push(data["customers"]);
      }
      
    if (metricsData != null && metricsData != undefined) {

        for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {
            let count = 0;

            if (metricsDataValue.sites != null && metricsDataValue.sites != undefined) {
                let sites = metricsDataValue.sites;

                for (let site = 0; site < 1; site++) {
                    let application = sites[site].application;

                    if (application != null && application != undefined) {

                        for (let [applicationKey, applicationValue] of Object.entries(application)) {

                            if (applicationValue != null && applicationValue != undefined) {

                                for (let [applicationDataKey, applicationDataValue] of Object.entries(applicationValue)) {

                                    if (applicationDataValue != null && applicationDataValue != undefined && applicationDataKey != null && applicationDataKey != undefined) {

                                        if (classMetrics[applicationDataKey] == undefined) {
                                            classMetrics[applicationDataKey] = [];
                                        }

                                        let valueMetrics = [];

                                        for (let [metricsKey, metricsValue] of Object.entries(applicationDataValue)) {

                                            for (let [key, value] of Object.entries(metricsValue)) {

                                                if (classMetrics[applicationDataKey][key] == undefined) {
                                                    classMetrics[applicationDataKey][key] = value;
                                                } else {
                                                    classMetrics[applicationDataKey][key] += value;
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
        }
    }
    return classMetrics;
}

class ApplicationClassMetrics extends Component {

    render() {

        let config = {
            "bar": {
                "type": "serial",
                "theme": "light",

                "legend": {
                    "horizontalGap": 10,
                    "useGraphSettings": true,
                    "markerSize": 10
                },
                "dataProvider": [],
                "valueAxes": [{
                    "stackType": "regular",
                    "axisAlpha": 0.5,
                    "gridAlpha": 0.2
                }],
                "depth3D": 20,
                "angle": 30,
                "graphs": [{
                    "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                    "fillAlphas": 0.8,
                    "labelText": "[[value]]",
                    "precision": 0,
                    "lineAlpha": 0.3,
                    "title": "Bandwidth",
                    "type": "column",
                    "color": "#000000",
                    "valueField": "bandwidth"
                }, {
                    "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                    "fillAlphas": 0.8,
                    "labelText": "[[value]]",
                    "lineAlpha": 0.3,
                    "title": "Route Change",
                    "type": "column",
                    "color": "#000000",
                    "valueField": "route_change"
                }, {
                    "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
                    "fillAlphas": 0.8,
                    "labelText": "[[value]]",
                    "lineAlpha": 0.3,
                    "title": "Route Fail",
                    "type": "column",
                    "color": "#000000",
                    "valueField": "route_fail"
                }],
                "rotate": false,
                "categoryField": "name",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0.2,
                    "axisAlpha": 0.2,
                    "position": "left"
                },
                "export": {
                    "enabled": false
                }
            }
        };

        let configValue = config.bar;
        let user = this.props.authentication.user;
        const customerClass = customerClassMetrics(this.props.filter, user);

        for (let [key, value] of Object.entries(configValue)) {

            if (key == "dataProvider") {

                for (let [customerClassKey, customerClassValue] of Object.entries(customerClass)) {
                    let metricsData = [];
                    let data = [];
                    data = { "name": customerClassKey };

                    for (let [classKey, classValue] of Object.entries(customerClassValue)) {
                        data[classKey] = classValue;
                    }

                    value.push(data);
                }
            }
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
  
  const connectedApplicationClassMetrics = connect(mapStateToProps)(ApplicationClassMetrics);
  export { connectedApplicationClassMetrics as ApplicationClassMetrics };
  
