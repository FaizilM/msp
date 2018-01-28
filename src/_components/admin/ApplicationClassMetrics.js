import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import Chart from '../chart/chart';
import { color } from '../../_constants';
import { indexOf } from 'lodash';

let customerClassMetrics = () => {
    let classMetrics = [];
    let customerClassMetricsData = [];
    if (metricsData != null && metricsData != undefined) {
        for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData)) {
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
                "theme": "light",
                "type": "serial",
                "startDuration": 0,
                "legend": {
                    "markerSize": 10,
                    "horizontalGap": 70,
                    "data": [
                        { "title": "<4.5ms", "color": color.GREEN_COLOR },
                        { "title": "<7.5ms", "color": color.YELLOW_COLOR },
                        { "title": ">7.5ms", "color": color.ORANGE_COLOR }
                    ]
                },
                "dataProvider": [],
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
                "rotate": false,
                "categoryField": "name",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0.2
                }

            }
        };
        let configValue = config.bar;
        const customerClass = customerClassMetrics();
        for (let [key, value] of Object.entries(configValue)) {
            if (key == "dataProvider") {
                for (let [customerClassKey, customerClassValue] of Object.entries(customerClass)) {
                    let metricsData = [];
                    let data = [];
                    data={"name":customerClassKey};
                    for (let [classKey, classValue] of Object.entries(customerClassValue)) {
                       data[classKey] = classValue;
                    }
                    value.push(data);
                }
            }
        }

        return (
            <Chart config={configValue} />
        );
    }
}

export default ApplicationClassMetrics;
