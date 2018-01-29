import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import Chart from '../chart/chart';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';


let packetLossData = (filter) => {
  metricsData
  let metrics = [];
  metrics.push(metricsData[0]);

  let packetLoss = {};
  let totalSite = 0;
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
    if (filter.siteGroup != "" && filter.siteGroup != undefined && filter.applicationName != "All Sites Group") {
      siteGroup = filter.siteGroup;
    }
  }

  for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
      let links = sites[site].links;
      if ((siteGroup != undefined && sites[site].sitesgroup == siteGroup) || siteGroup == undefined) {
        if ((siteName != undefined && sites[site].name == siteName) || siteName == undefined) {
          for (let link = 0; link < links.length; link++) {
            let linkLosses = links[link];
            if ((linkName != undefined && linkLosses[linkName] != undefined) || (linkName == undefined)) {
              for (let [linkKey, linkValue] of Object.entries(linkLosses)) {
                if (packetLoss[linkKey] == undefined) {
                  packetLoss[linkKey] = linkValue.packet_loss;
                } else {
                  packetLoss[linkKey] = (packetLoss[linkKey] + linkValue.packet_loss) / 2;
                }
              }
            }
          }
        }
      }
    }
  }
  return packetLoss;
}


class PacketLossPerSite extends Component {

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
          "balloonText": "Percentage: <b>[[value]]%</b>",
          "fillColorsField": "color",
          "fillAlphas": 1,
          "lineAlpha": 0.1,
          "precision": 0,
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
        "rotate": false,
        "categoryField": "name",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0.2
        }

      }
    };
    const configValue = config.bar;

    const packetLoss = packetLossData(this.props.filter);
    let color = ['green', 'yellow', 'red', 'blue']
    for (let [key, value] of Object.entries(configValue)) {
      if (key == "dataProvider") {
        let index = 0;
        for (let [packetLossKey, packetLossValue] of Object.entries(packetLoss)) {
          let jsonPacketlossData = { "name": packetLossKey, "percentage": packetLossValue, "color": color[index++] }
          value.push(jsonPacketlossData);
          // packetLossValue[data].percentage = packetLoss[data];
        }
      }
      if (key == "legend") {
        let index = 0;
     
        for (let [packetLossKey, packetLossValue] of Object.entries(packetLoss)) {
          let jsonPacketlossData = { "title": packetLossKey, "color": color[index++] }
          console.log("json", jsonPacketlossData);

          value.data.push(jsonPacketlossData);
          // packetLossValue[data].percentage = packetLoss[data];
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

export default PacketLossPerSite;
