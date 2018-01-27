import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import Chart from '../chart/chart';
import { color } from '../../_constants';

let packetLossData = () => {
  let loss = [0, 0, 0];
  let totalSite = 0;
  let packetLossLink = 0;
  let totalLink = 0;
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData)) {
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
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

    }
  }
  
  loss[0] = parseInt((loss[0] / totalSite) * 100);
  loss[1] = parseInt((loss[1] / totalSite) * 100);
  loss[2] = parseInt((loss[2] / totalSite) * 100);


  return loss;
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
          "data": [
            { "title": "<1%", "color": color.GREEN_COLOR },
            { "title": "<2.5%", "color": color.YELLOW_COLOR },
            { "title": ">2.5%", "color": color.ORANGE_COLOR }
          ]
        },
        "dataProvider": [{
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
        "categoryField": "packet_loss",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0.2,
          "labelFunction": function (value) {
            if (value == 1 || value == 2.5) {
              return "<" + value + "%";
            } else {
              return ">" + 2.5 + "%";
            }

          }
        }

      }
    };
    const configValue = config.bar;
    const packetLoss = packetLossData();
    for (let [packetLossKey, packetLossValue] of Object.entries(configValue)) {
      if (packetLossKey == "dataProvider") {
        for (let data = 0; data < packetLossValue.length; data++) {
          packetLossValue[data].percentage = packetLoss[data];
        }
      }

    }

    return (
      <Chart config={configValue} />
    );
  }
}

export default PacketLoss;
