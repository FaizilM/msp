import React, { Component } from 'react';
import './App.css';
import AmCharts from "@amcharts/amcharts3-react";



class PacketLoss extends Component {

  render() {

    const config = {
      "type": "serial",
      "depth3D": 20,
      "angle": 60,
      "legend": {
        "horizontalGap": 1000,
        "useGraphSettings": true,
        "markerSize": 10
      },
      "dataProvider": [{
        "year": 2003,
        "europe": 2.5,
        "namerica": 2.5,
        "asia": 2.1,
        "lamerica": 1.2,
        "meast": 0.2,
        "africa": 0.1
      }, {
        "year": 2004,
        "europe": 2.6,
        "namerica": 2.7,
        "asia": 2.2,
        "lamerica": 1.3,
        "meast": 0.3,
        "africa": 0.1
      }, {
        "year": 2005,
        "europe": 2.8,
        "namerica": 2.9,
        "asia": 2.4,
        "lamerica": 1.4,
        "meast": 0.3,
        "africa": 0.1
      }],
      "valueAxes": [{
        "stackType": "regular",
        // "axisAlpha": 0,
        // "gridAlpha": 0
      }],
      "graphs": [{
        "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
        "fillAlphas": 0.1,
        "labelText": "[[value]]",
        "lineAlpha": 0.3,
        "title": "Europe",
        "type": "column",
        "color": "#000000",
        "valueField": "europe"
      }],
      "plotAreaFillAlphas": 0.3,
      "categoryField": "year",
      "categoryAxis": {
        "gridPosition": "start",
        "axisAlpha": '20px',
        "gridAlpha": '20px',
        "position": "left"
      },
      "export": {
        "enabled": true
      }
    };

    return (

        <div name="testing1" className="element1" style={{width:'100%', height:'40%'}} >
          <div style={{ width: "50%", height: "100%", display: "inline-block" }}>
            <AmCharts.React options={config} style={{ width: "50%", height: "350px" }} />
          </div>
          <div style={{ width: "50%", height: "100%", display: "inline-block" }}>
            <AmCharts.React options={config} style={{ width: "50%", height: "350px" }} />
          </div>
        </div>

    );
  }
}

export default PacketLoss;
