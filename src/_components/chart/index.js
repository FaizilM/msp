import React, { Component } from 'react';
let config = {
  bar3D: {
    "theme": "light",
    "type": "serial",
    "startDuration": 2,
    "titles": [{
      "text": "My Chart Title"
    }],
    "dataProvider": [{
      "packet_loss": "<1%",
      "percentage": 20,
      "color": "#FF0F00"
    }, {
      "packet_loss": "<2.5%",
      "percentage": 40,
      "color": "#0D8ECF"
    }, {
      "packet_loss": ">2.5%",
      "percentage": 80,
      "color": "#04D215"
    }],
    "valueAxes": [{
      "position": "left",
      "title": "Packet Loss"
    }],
    "graphs": [{
      "balloonText": "[[category]]: <b>[[value]]</b>",
      "fillColorsField": "color",
      "fillAlphas": 1,
      "lineAlpha": 0.1,
      "type": "column",
      "valueField": "percentage"
    }],
    "depth3D": 20,
    "angle": 30,
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": false
    },
    "categoryField": "packet_loss",
    "categoryAxis": {
      "gridPosition": "start",
      "labelRotation": 90
    },
    "export": {
      "enabled": true
    }

  },
  "bar": {
    "theme": "light",
    "type": "serial",
    "startDuration": 2,
    "titles": [{
      "text": "My Chart Title"
    }],
    "dataProvider": [{
      "packet_loss": "<1%",
      "percentage": 20,
      "color": "#FF0F00"
    }, {
      "packet_loss": "<2.5%",
      "percentage": 40,
      "color": "#0D8ECF"
    }, {
      "packet_loss": ">2.5%",
      "percentage": 80,
      "color": "#04D215"
    }],
    "valueAxes": [{
      "position": "left",
      "title": "Packet Loss"
    }],
    "graphs": [{
      "balloonText": "[[category]]: <b>[[value]]</b>",
      "fillColorsField": "color",
      "fillAlphas": 1,
      "lineAlpha": 0.1,
      "type": "column",
      "valueField": "percentage"
      // "labelFunction": 
    }],
    "chartCursor": {
      "categoryBalloonEnabled": false,
      "cursorAlpha": 0,
      "zoomable": false
    },
    "rotate": true,
    "categoryField": "packet_loss",
    "categoryAxis": {
      "gridPosition": "start",
      "labelRotation": 90,
    },
    "export": {
      "enabled": true
    }

  }
};


export default config;
