import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import Chart from '../chart/chart';
import { color } from '../../_constants';
import { indexOf } from 'lodash';

let customerClassMetrics = () => {
    let applicationTypeKey = [];
    let applicationClassKey = [];
    let applicationSite = [];
    let applicationCustomer = [];

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
                                    if (applicationDataValue != null && applicationDataValue != undefined) {
                                        for (let [classKey, classValue] of Object.entries(applicationDataValue)) {
                                            if (classValue != null && classValue != undefined) {
                                                for (let [classDataKey, classDataValue] of Object.entries(classValue)) {
                                                    console.log(classDataKey, classDataValue);
                                                    
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                   // console.log(applicationTypeKey);
                    

                    for (let [key, value] of Object.entries(applicationTypeKey)) {
                        if (key != null && value != null && key != undefined && value != undefined)
                            if (indexOf(applicationSite[key], key) == -1) {
                                applicationSite[key] = value;
                            } else {
                                applicationSite[key] += value;
                            }

                    }
                }
            }
           
        }
    }
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
                "dataProvider": [{
                    "jitter_ratio": 4.5,
                    "percentage": 0,
                    "color": color.GREEN_COLOR
                }, {
                    "jitter_ratio": 7.5,
                    "percentage": 0,
                    "color": color.YELLOW_COLOR
                }, {
                    "jitter_ratio": 7.6,
                    "percentage": 0,
                    "color": color.ORANGE_COLOR
                }],
                "valueAxes": [{
                    "position": "left",
                    "minimum": 0,
                    "maximum": 100,
                    "autoGridCount": false,
                    "gridCount": 5,
                    "gridAlpha": 0.2,
                    "step": 10,
                    "labelFunction": function (value) {
                        return value + "%";
                    }
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
                    "valueField": "percentage"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "rotate": false,
                "categoryField": "jitter_ratio",
                "categoryAxis": {
                    "gridPosition": "start",
                    "gridAlpha": 0.2,
                    "labelFunction": function (value) {
                        if (value == 4.5 || value == 7.5) {
                            return "<" + value + "ms";
                        } else {
                            return ">" + 7.5 + "ms";
                        }

                    }
                }

            }
        };
        let configValue = config.bar;
        const customerClass = customerClassMetrics();


        return (
            <Chart config={configValue} />
        );
    }
}

export default ApplicationClassMetrics;
