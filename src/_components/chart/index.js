import React, { Component } from 'react';
let config = {
  bar: {
    "type": "serial",
    "depth3D": 20,
    "angle": 60,
    "legend": {
      "horizontalGap": 1000,
      "useGraphSettings": true,
      "markerSize": 10
    },
    "dataProvider": [{
      "packet_loss": "<1%",
      "percentage": 20,
      "color": "red"
    }, {
      "packet_loss": "<2.5%",
      "percentage": 40,
      "color": "blue"
    }, {
      "packet_loss": ">2.5%",
      "percentage": 80,
      "color": "green"
    }],
    "valueAxes": [{
      "stackType": "regular",
      // "axisAlpha": 0,
      // "gridAlpha": 0
    }],
    "graphs": [{
      "balloonText": "<b>[[title]]</b><br><span style='font-size:14px'>[[category]]: <b>[[value]]</b></span>",
      "fillAlphas": 0.7,
      "labelText": "[[value]]",
      "lineAlpha": 0.3,
      "title": "PacketLoss",
      "type": "column",
      "lineColorField": "color",
      "fillColorsField": "color",
      "valueField": "percentage"
    }],
    "plotAreaFillAlphas": 0.3,
    "categoryField": "packet_loss",
    "categoryAxis": {
      "gridPosition": "start",
      "axisAlpha": '20px',
      "gridAlpha": '20px',
      "position": "left"
    },
    "export": {
      "enabled": true
    }
  }
};


export default config;
