import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { Chart } from '../';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';
import { userConstants } from '../../_constants';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';
import { getKPIData } from '../../_helpers/shared';


let packetLossData = (filter, user, type) => {
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

  let loss = [0, 0, 0];
  let totalSite = 0;
  let packetLossLink = 0;
  let totalLink = 0;
  let packetLoss = {};
  let siteName;
  let siteGroup;
  let linkName;
  let applicationName;
  let sourceSite;

  if (filter != undefined) {
    if (filter.siteName != "" && filter.siteName != undefined && filter.siteName != "All Sites") {
      siteName = filter.siteName;
    }
    if (filter.sourceSite != "" && filter.sourceSite != undefined && filter.sourceSite != "All Source") {
      sourceSite = filter.sourceSite;
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
      if (filter == undefined || type == "dashboard") {
        links = sites[site].links;

        for (let link = 0; link < links.length; link++) {
          let linkLosses = links[link];

          for (let [linkKey, linkValue] of Object.entries(linkLosses)) {
            packetLossLink += linkValue.packet_loss;
            totalLink++;
          }
        }

        if (packetLossLink > 0 && packetLossLink / totalLink <= 1) {
          loss[0] += 1;
        } else if (packetLossLink > 0 && packetLossLink / totalLink <= 2.5) {
          loss[1] += 1;
        } else {
          loss[2] += 1;
        }
        totalLink = 0;
        totalSite++;
        packetLossLink = 0;

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
                    if (packetLoss[linkKey] == undefined) {
                      packetLoss[linkKey] = linkValue.packet_loss;
                    } else {

                      if (linkValue.packet_loss > 0) {
                        packetLoss[linkKey] = (packetLoss[linkKey] + linkValue.packet_loss) / 2;
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

  if (filter == undefined) {
    loss[0] = parseInt((loss[0] / totalSite) * 100);
    loss[1] = parseInt((loss[1] / totalSite) * 100);
    loss[2] = parseInt((loss[2] / totalSite) * 100);

    return loss;
  } else if (type == "dashboard") {

    let duration = "HOUR"
    if(filter != undefined && filter.duration != undefined) {
      duration = filter.duration;
    }
    loss[0] = getKPIData(parseInt((loss[0] / totalSite) * 100), duration);
    loss[1] = getKPIData(parseInt((loss[1] / totalSite) * 100), duration);
    loss[2] = getKPIData(parseInt((loss[2] / totalSite) * 100), duration);
    return loss;
  } else {
    return packetLoss;
  }
}


class PacketLoss extends Component {

  render() {
    let config = {
      "bar": {
        "theme": "light",
        "type": "serial",
        "startDuration": 0,
        "legend": {
          "horizontalGap": 70,
          "markerSize": 10,
          "data": []
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
        "depth3D": 20,
        "angle": 30,
        "graphs": [{
          "balloonText": "Percentage: <b>[[value]]</b>",
          "fillColorsField": "color",
          "fillAlphas": 1,
          "lineAlpha": 0.1,
          "precision": 1,
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
        "categoryField": "name",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0.2
        }

      }
    };
    const configValue = config.bar;
    let user = this.props.authentication.user;
    let type = this.props.type;
    const packetLoss = packetLossData(this.props.filter, user, type);
    if (this.props.filter == undefined || type == 'dashboard') {

      for (let [packetLossKey, packetLossValue] of Object.entries(configValue)) {

        if (packetLossKey == "valueAxes") {
          let label = [];
          let labelData = packetLossValue[0];
          labelData["labelFunction"] = function (value) {
            return value + "%";
          };
          labelData["maximum"] = 100;
          label.push(labelData);
          packetLossValue = label;
        }

        if (packetLossKey == "dataProvider") {
          packetLossValue.push({
            "packet_loss": 1,
            "percentage": 0,
            "color": color.GREEN_COLOR
          }, {
              "packet_loss": 2.5,
              "percentage": 0,
              "color": color.YELLOW_COLOR
            }, {
              "packet_loss": 2.6,
              "percentage": 0,
              "color": color.ORANGE_COLOR
            })
          for (let data = 0; data < packetLossValue.length; data++) {

            packetLossValue[data].percentage = packetLoss[data];
          }
        }

        if (packetLossKey == "categoryField") {
          configValue.categoryField = "packet_loss";
        }

        if (packetLossKey == "categoryAxis") {
          let labelData = packetLossValue;
          labelData["labelFunction"] = function (value) {
            if (value == 1 || value == 2.5) {
              return "<" + value + "%";
            } else {
              return ">" + 2.5 + "%";
            }
          };
        }

        if (packetLossKey == "legend") {
          packetLossValue.data.push(
            { "title": "<1%", "color": color.GREEN_COLOR },
            { "title": "<2.5%", "color": color.YELLOW_COLOR },
            { "title": ">2.5%", "color": color.ORANGE_COLOR }
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
          for (let [packetLossKey, packetLossValue] of Object.entries(packetLoss)) {
            let jsonPacketlossData = { "name": packetLossKey, "percentage": packetLossValue, "color": colorcode[packetLossKey] }
            value.push(jsonPacketlossData);
          }
        }

        if (key == "legend") {
          let index = 0;

          for (let [packetLossKey, packetLossValue] of Object.entries(packetLoss)) {
            let jsonPacketlossData = { "title": packetLossKey, "color": colorcode[packetLossKey] }
            value.data.push(jsonPacketlossData);
          }
        }
      }

    }

    let pickChart = () => {

      if (packetLoss != undefined) {
        return <Chart config={configValue} />
      } else {
        return < h1 > No Site Available </h1>
      }

    };


    return (
      <Col xs="12" sm="12" md="6" lg="6" xl="6" >
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className=""></i>
            <h3>Packet Loss</h3>
          </div>
          <div className="panel-body">
            <div className="list-group">
              {pickChart()}
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

const connectedPacketLoss = connect(mapStateToProps)(PacketLoss);
export { connectedPacketLoss as PacketLoss };
