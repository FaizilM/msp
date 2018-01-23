import React, { Component } from 'react';
import './App.css';
import AmCharts from "@amcharts/amcharts3-react";
import '../chart/chart';
import config from '../chart/index';
import metricsDatas from '../../metricsData.json'

let packetLossData = () => {
  let loss = [0, 0, 0];
  let totalSite = 0;
  let packetLossSite = 0;
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsDatas)) {
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
      let links = sites[site].links;
      for (let link = 0; link < links.length; link++) {
        let linkLosses = links[link];
        for (let [linkKey, linkValue] of Object.entries(linkLosses)) {
          packetLossSite += linkValue.packet_loss;
        }

        if (packetLossSite <= 1) {
          loss[0] += 1;
        } else if (packetLossSite <= 2.5) {
          loss[1] += 1;
        } else {
          loss[2] += 1;
        }
        totalSite++;
        packetLossSite = 0;
        }
    }
  }

  loss[0] = parseInt((loss[0] / totalSite) * 100);
  loss[1] = parseInt((loss[1] / totalSite) * 100);
  loss[2] = parseInt((loss[2] / totalSite) * 100);

return loss;
}


class PacketLoss extends Component {

  render() {
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

      <div name="testing1" className="element1" >
        <div>
          <AmCharts.React options={configValue} style={{ height: "350px" }} />
        </div>
      </div>

    );
  }
}

export default PacketLoss;
