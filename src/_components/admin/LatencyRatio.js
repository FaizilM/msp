import React from 'react';
import Chart from '../chart/chart';
import metricsData from '../../metricsData.json';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';


let latencyRatioData = (filter, customer) => {
  let metrics = [];
  if (customer == undefined) {
    metrics = metricsData;
  } else {
    metrics.push(metricsData[0]);
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
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
      let links = sites[site].links;
      if (customer == undefined) {
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
        } else {
          latency[0] += 1;
        }
        totalLink = 0;
        totalSite++;
        latencySite = 0;

      } else {
        if ((siteGroup != undefined && sites[site].sitesgroup == siteGroup) || siteGroup == undefined) {
          if ((siteName != undefined && sites[site].name == siteName) || siteName == undefined) {

            for (let link = 0; link < links.length; link++) {
              let linkLosses = links[link];
              if ((linkName != undefined && linkLosses[linkName] != undefined) || (linkName == undefined)) {

                for (let [linkKey, linkValue] of Object.entries(linkLosses)) {
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
  if (customer == undefined) {
    latency[0] = parseInt((latency[0] / totalSite) * 100);
    latency[1] = parseInt((latency[1] / totalSite) * 100);
    latency[2] = parseInt((latency[2] / totalSite) * 100);

    return latency;
  } else {
    return latencyData;
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
          "balloonText": "Percentage: <b>[[value]]%</b>",
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

    const latencyRatio = latencyRatioData(this.props.filter, this.props.customer);

    if (this.props.customer == undefined) {
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
              return ">" + 150 + "ms";
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
    } else {
      let colorcode = [color.GREEN_COLOR, color.YELLOW_COLOR, color.ORANGE_COLOR, color.BLUE_COLOR]
      for (let [key, value] of Object.entries(configValue)) {
        if (key == "dataProvider") {
          let index = 0;
          for (let [latencyKey, latencyValue] of Object.entries(latencyRatio)) {
            let jsonlatencyData = { "name": latencyKey, "percentage": latencyValue, "color": colorcode[index++] }
            value.push(jsonlatencyData);
          }
        }
        if (key == "legend") {
          let index = 0;

          for (let [latencyKey, latencyValue] of Object.entries(latencyRatio)) {
            let jsonlatencyData = { "title": latencyKey, "color": colorcode[index++] }
            value.data.push(jsonlatencyData);
          }
        }

      }
    }


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
                <Chart config={configValue} />
              </div>
            </div>
          </div>
        </div>
      </Col>



    );
  }
}


export default LatencyRatio;
