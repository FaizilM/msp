import React from 'react';
import { Chart } from '../';
import metricsData from '../../metricsData.json';
import { indexOf } from 'lodash';
import '../../assets/css/App.css';
import { color } from '../../_constants';
import { Container, Row, Col, select } from 'reactstrap';
import { userConstants } from '../../_constants';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';

let linkCapacityData = (filter, user) => {
    let metrics = [];

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

    let capacity = [];
    let totalSite = [];
    let key = [];
    let i = 0;
    let utilization = {};
    let packetLossLink = 0;
    let totalLink = 0;
    let siteName;
    let siteGroup;
    let linkName;
    let applicationName;

    if (filter != undefined) {

        if (filter.siteName != "" && filter.siteName != undefined && filter.siteName != "All Sites") {
            siteName = filter.siteName;
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

    for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {

        let sites = metricsDataValue.sites;

        for (let site = 0; site < sites.length; site++) {
            let links = sites[site].links;

            if (filter == undefined) {

                for (let link = 0; link < links.length; link++) {
                    let linkCapacity = links[link];

                    for (let [linkKey, linkValue] of Object.entries(linkCapacity)) {

                        if (indexOf(key, linkKey) == -1) {
                            key.push(linkKey);
                        }

                        let index = indexOf(key, linkKey);

                        if (capacity[index] == undefined) {
                            capacity.splice(index, 0, linkValue.utilization);
                            totalSite.splice(index, 0, 1);
                        } else {
                            capacity[index] = capacity[index] + linkValue.utilization;
                            totalSite[index] += 1;
                        }
                    }
                }
            } else {

                if ((siteGroup != undefined && sites[site].sitesgroup == siteGroup) || siteGroup == undefined) {

                    if ((siteName != undefined && sites[site].name == siteName) || siteName == undefined) {

                        for (let link = 0; link < links.length; link++) {
                            let linkLosses = links[link];

                            if ((linkName != undefined && linkLosses[linkName] != undefined) || (linkName == undefined)) {

                                for (let [linkKey, linkValue] of Object.entries(linkLosses)) {

                                    if (utilization[linkKey] == undefined) {
                                        utilization[linkKey] = linkValue.utilization;
                                    } else {
                                        utilization[linkKey] = (utilization[linkKey] + linkValue.utilization) / 2;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (filter == undefined) {

        for (let index = 0; index < capacity.length; index++) {
            capacity[index] = capacity[index] / totalSite[index];
        }
        return capacity;
    } else {
        return utilization;
    }
};

class LinkCapacity extends React.Component {

    render() {

        let config = {
            "bar": {
                "theme": "light",
                "type": "serial",
                "startDuration": 0,
                "legend": {
                    "horizontalGap": 300,
                    "markerSize": 10,
                    "data": [
                    ]
                },
                "dataProvider": [],
                "valueAxes": [{
                    "position": "left",
                    "minimum": 0,
                    "autoGridCount": false,
                    "gridCount": 5,
                    "gridAlpha": 0.2,
                    "step": 10
                }],
                "depth3D": 22,
                "angle": 30,
                "graphs": [{
                    "balloonText": "[[category]]: <b>[[value]]%</b>",
                    "fillColorsField": "color",
                    "fillAlphas": 1,
                    "lineAlpha": 0.1,
                    "precision": 0,
                    "type": "column",
                    "fixedColumnWidth": 50,
                    "valueField": "percentage"
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "rotate": true,
                "categoryField": "name",
                "offset": 0.9,
                "gridAlpha": 0.2,
                "categoryAxis": {
                    "gridPosition": "start",
                    "fillAlpha": 0.05
                }
            }
        };

        let configValue = config.bar;
        let user = this.props.authentication.user;
        const linkCapacity = linkCapacityData(this.props.filter, user);

        if (this.props.filter == undefined) {

            for (let [linkCapacityKey, linkCapacityValue] of Object.entries(configValue)) {

                if (linkCapacityKey == "valueAxes") {
                    let label = [];
                    let labelData = linkCapacityValue[0];
                    labelData["labelFunction"] = function (value) {
                        return value + "%";
                    };
                    labelData["maximum"] = 100;
                    label.push(labelData);
                    linkCapacityValue = label;
                }

                if (linkCapacityKey == "dataProvider") {
                    linkCapacityValue.push({
                        "link_capacity": "Broadband",
                        "capacity": "18Gbps",
                        "percentage": 0,
                        "color": color.BLUE_COLOR
                    }, {
                            "link_capacity": "MPLS",
                            "capacity": "45Gbps",
                            "percentage": 0,
                            "color": color.BLUE_COLOR
                        }, {
                            "link_capacity": "T1 Lines",
                            "capacity": "4Gbps",
                            "percentage": 0,
                            "color": color.BLUE_COLOR
                        },
                        {
                            "link_capacity": "4G/LTE",
                            "capacity": "29Gbps",
                            "percentage": 0,
                            "color": color.BLUE_COLOR
                        });

                    for (let data = 0; data < linkCapacityValue.length; data++) {
                        linkCapacityValue[data].percentage = linkCapacity[data];
                    }
                }

                if (linkCapacityKey == "categoryField") {
                    configValue.categoryField = "link_capacity";
                }

                if (linkCapacityKey == "legend") {
                    configValue.legend.horizontalGap = 300;
                    linkCapacityValue.data.push(
                        { "title": "Utilization", "color": color.BLUE_COLOR }
                    );
                }
            }
            configValue.graphs[0].precision = 0;
            configValue.graphs[0].balloonText = "Percentage: <b>[[value]]%</b>";
        } else {
            let colorcode = [color.GREEN_COLOR, color.YELLOW_COLOR, color.ORANGE_COLOR, color.BLUE_COLOR]

            for (let [key, value] of Object.entries(configValue)) {

                if (key == "dataProvider") {
                    let index = 0;

                    for (let [linkCapacityKey, linkCapacityValue] of Object.entries(linkCapacity)) {
                        let jsonlinkCapacityData = { "name": linkCapacityKey, "percentage": linkCapacityValue, "color": color[index++] }
                        value.push(jsonlinkCapacityData);
                    }
                }

                if (key == "legend") {
                    let index = 0;

                    for (let [linkCapacityKey, linkCapacityValue] of Object.entries(linkCapacity)) {
                        let jsonlinkCapacityData = { "title": linkCapacityKey, "color": colorcode[index++] }
                        value.data.push(jsonlinkCapacityData);
                    }
                }
            }
        };
         
    let pickChart = () => {

        if (linkCapacity.length != undefined || linkCapacity.broadband != undefined) {
          return <Chart config={configValue} />
        } else {
          return < h1 > No Site Available </h1>
        }
  
      };

        return (
            <Col xs="12" sm="12" md="6" lg="6" xl="6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <i className=""></i>
                        <h3> Link Capacity Utilization</h3>
                    </div>
                    <div className="panel-body">
                        <div className="list-group">
                            <div>
                            {pickChart()}
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
  
  const connectedLinkCapacity = connect(mapStateToProps)(LinkCapacity);
  export { connectedLinkCapacity as LinkCapacity };
  
