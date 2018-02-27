import React from 'react';
import { Chart } from '../';
import metricsData from '../../metricsData.json';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';
import { userConstants } from '../../_constants';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';
import { getKPIDataByPercentage } from '../../_helpers/shared';

let latencyRatioData = (filter, user, type) => {
  let metrics = [];
  if (userConstants.ROLE_ADMIN == user.role) {
    metrics = metricsData;
  } else if (user.role == userConstants.ROLE_USER) {
    let data = {};
    data["customers"] = metricsData;
    data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
      data: data
    }).value;

    metrics.push(data["customers"]);
  }

  let latency = [0, 0, 0];
  let totalSite = 0;
  let latencySite = 0;
  let totalLink = 0;
  let latencyData = {};
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
  if (metrics.length > 0) {
    for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {
      let sites = metricsDataValue.sites;


      for (let site = 0; site < sites.length; site++) {
        let links = sites[site].links;
        if (filter == undefined || type == 'dashboard') {
          for (let link = 0; link < links.length; link++) {
            let linkLatency = links[link];
            for (let [linkKey, linkValue] of Object.entries(linkLatency)) {
              latencySite += linkValue.latency;
              totalLink++;
            }
          }
          if (latencySite > 0 && latencySite / totalLink <= 30) {
            latency[2] += 1;
          } else if (latencySite > 0 && latencySite / totalLink <= 50) {
            latency[1] += 1;
          } else if (latencySite > 0 && latencySite / totalLink > 150) {
            latency[0] += 1;
          }
          totalLink = 0;
          totalSite++;
          latencySite = 0;
        } else {
          if ((siteGroup != undefined && sites[site].sitesgroup == siteGroup) || siteGroup == undefined) {
           
            if ((siteName != undefined && sites[site].name == siteName) || siteName == undefined) {
              for (let link = 0; link < links.length; link++) {

                let linkLosses;
                if (linkName != undefined && linkName != "") {
                  linkLosses = links[link];
                } else {
                  linkLosses = links[link];
                }
                if ((linkName != undefined && linkLosses[linkName] != undefined) || (linkName == undefined)) {

                  for (let [linkKey, linkValue] of Object.entries(linkLosses)) {
                    if ((linkName != undefined && linkName == linkKey) || linkName == undefined) {
                      if (latencyData[linkKey] == undefined) {
                        latencyData[linkKey] = linkValue.latency;
                      } else {
                        latencyData[linkKey] = (latencyData[linkKey] + linkValue.latency) / 2;
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
    if (filter == undefined) {
      latency[0] = parseInt((latency[0] / totalSite) * 100);
      latency[1] = parseInt((latency[1] / totalSite) * 100);
      latency[2] = parseInt((latency[2] / totalSite) * 100);
      return latency;
    } else if (type == "dashboard") {
      let duration = "HOUR"
      if (filter != undefined && filter.duration != undefined) {
        duration = filter.duration;
      }
      latency[0] = getKPIDataByPercentage(parseInt((latency[0] / totalSite) * 100), duration);
      latency[1] = getKPIDataByPercentage(parseInt((latency[1] / totalSite) * 100), duration);
      latency[2] = getKPIDataByPercentage(parseInt((latency[2] / totalSite) * 100), duration);
      return latency;
    } else {
      return latencyData;
    }
  }
};

class LatencyRatio extends React.Component {

  render() {
    let config = {
      "bar": {
        "theme": "light",
        "type": "serial",
        "startDuration": 0,
        "legend": {
          "horizontalGap": 70,
          "markerSize": 10,
          "data": [
          ]
        },
        "dataProvider": [],
        "valueAxes": [{
          "position": "left",
          "minimum": 0
        }],
        "depth3D": 20,
        "angle": 30,
        "graphs": [{
          "balloonText": "Milli Second: <b>[[value]]ms</b>",
          "fillColorsField": "color",
          "precision": 0,
          "fillAlphas": 1,
          "lineAlpha": 0.1,
          "type": "column",
          "fixedColumnWidth": 50,
          "valueField": "percentage"
          // "labelFunction":
        }],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "rotate": true,
        "categoryField": "name",
        "categoryAxis": {
          "gridPosition": "start"
        }
      }
    };
    let configValue = config.bar;
    let user = this.props.authentication.user;
    let type = this.props.type;
    const latencyRatio = latencyRatioData(this.props.filter, user, type);

    if (this.props.filter == undefined || type == "dashboard") {
      for (let [latencyKey, latencyValue] of Object.entries(configValue)) {
        if (latencyKey == "valueAxes") {
          let label = [];
          let labelData = latencyValue[0];
          labelData["labelFunction"] = function (value) {
            return value / 100;
          };
          labelData["maximum"] = 100;
          label.push(labelData);
          latencyValue = label;
        }
        if (latencyKey == "dataProvider") {
          for (let data = 0; data < latencyValue.length; data++) {
            latencyValue[data].percentage = latencyRatio[data];
          }
          latencyValue.push({
            "latency_ratio": 150,
            "percentage": 0,
            "color": color.ORANGE_COLOR
          }, {
              "latency_ratio": 50,
              "percentage": 0,
              "color": color.YELLOW_COLOR
            }, {
              "latency_ratio": 30,
              "percentage": 0,
              "color": color.GREEN_COLOR
            })
          for (let data = 0; data < latencyValue.length; data++) {
            latencyValue[data].percentage = latencyRatio[data];
          }
        }
        if (latencyKey == "categoryField") {
          configValue.categoryField = "latency_ratio";
        }
        if (latencyKey == "categoryAxis") {
          let labelData = latencyValue;
          labelData["labelFunction"] = function (value) {
            if (value == 30 || value == 50) {
              return "<" + value + "ms";
            } else {
              return ">" + value + "ms";
            }
          }
        }
        if (latencyKey == "legend") {
          latencyValue.data.push(
            { "title": "<30ms", "color": color.GREEN_COLOR },
            { "title": "<50ms", "color": color.YELLOW_COLOR },
            { "title": ">150ms", "color": color.ORANGE_COLOR }
          );
        }
      }
      configValue.graphs[0].precision = 0;
      configValue.graphs[0].balloonText = "Percentage: <b>[[value]]%</b>";
    } else {
      let colorcode = { "broadband": color.GREEN_COLOR, "mpls": color.YELLOW_COLOR, "t1_lines": color.ORANGE_COLOR, "4G": color.BLUE_COLOR };
      for (let [key, value] of Object.entries(configValue)) {
        if (key == "dataProvider") {
          let index = 0;
          for (let [latencyKey, latencyValue] of Object.entries(latencyRatio)) {
            let jsonlatencyData = { "name": latencyKey, "percentage": latencyValue, "color": colorcode[latencyKey] }
            value.push(jsonlatencyData);
          }
        }
        if (key == "legend") {
          let index = 0;

          for (let [latencyKey, latencyValue] of Object.entries(latencyRatio)) {
            let jsonlatencyData = { "title": latencyKey, "color": colorcode[latencyKey] }
            value.data.push(jsonlatencyData);
          }
        }
      }
    }

    let pickChart = () => {

      if (latencyRatio != undefined) {
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
            <h3>Latency Ratio</h3>
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

const connectedLatencyRatio = connect(mapStateToProps)(LatencyRatio);
export { connectedLatencyRatio as LatencyRatio };
