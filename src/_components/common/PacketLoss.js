import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import { Chart } from '../';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';


let packetLossData = (filter, customer) => {
  let metrics = [];
  if (customer == undefined) {
    metrics = metricsData;
  } else {
    metrics.push(metricsData[0]);
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

        let links = sites[site].links;

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
              let linkLosses = links[link];

              if ((linkName != undefined && linkLosses[linkName] != undefined) || (linkName == undefined)) {

                for (let [linkKey, linkValue] of Object.entries(linkLosses)) {

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

  if (customer == undefined) {
    loss[0] = parseInt((loss[0] / totalSite) * 100);
    loss[1] = parseInt((loss[1] / totalSite) * 100);
    loss[2] = parseInt((loss[2] / totalSite) * 100);
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
    const packetLoss = packetLossData(this.props.filter, this.props.customer);

    if (this.props.customer == undefined) {

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
    } else {
      let colorcode = [color.GREEN_COLOR, color.YELLOW_COLOR, color.ORANGE_COLOR, color.BLUE_COLOR]
      for (let [key, value] of Object.entries(configValue)) {

        if (key == "dataProvider") {
          let index = 0;
          for (let [packetLossKey, packetLossValue] of Object.entries(packetLoss)) {
            let jsonPacketlossData = { "name": packetLossKey, "percentage": packetLossValue, "color": colorcode[index++] }
            value.push(jsonPacketlossData);
          }
        }

        if (key == "legend") {
          let index = 0;

          for (let [packetLossKey, packetLossValue] of Object.entries(packetLoss)) {
            let jsonPacketlossData = { "title": packetLossKey, "color": colorcode[index++] }
            value.data.push(jsonPacketlossData);
          }
        }

      }
    }

    return (
      <Col xs="12" sm="12" md="6" lg="6" xl="6">
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className=""></i>
            <h3>Packet Loss</h3>
          </div>
          <div className="panel-body">
            <div className="list-group">
              <Chart config={configValue} />
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

export { PacketLoss };