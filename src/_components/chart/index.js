import React, { Component } from 'react';
let config = {
  "bar": {
    "theme": "light",
    "type": "serial",
    "startDuration": 2,
    "titles": [{
      "text": "My Chart Title"
    }],
    "dataProvider": [{
      "packet_loss": 1,
      "percentage": 0,
      "color": "#FF0F00"
    }, {
      "packet_loss": 2.5,
      "percentage": 0,
      "color": "#0D8ECF"
    }, {
      "packet_loss": 2.6,
      "percentage": 0,
      "color": "#04D215"
    }],
    "valueAxes": [{
      "position": "left",
      "title": "Packet Loss",
      "labelFunction": function(value){
        return value +"%";
      }
    }],
    "depth3D": 20,
    "angle": 30,
    "graphs": [{
      "balloonText": "[[category]]: <b>[[value]]%</b>",
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
      "labelFunction": function(value){
        if(value == 1 || value == 2.5) {
          return "<" + value +"%";
        } else {
          return ">" + 2.5 + "%";
        }
        
      }
    },
    "export": {
      "enabled": true
    }

  }
};


export default config;
