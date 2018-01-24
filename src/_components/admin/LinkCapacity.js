import React from 'react';
// import the core library.
import ReactEchartsCore from 'echarts-for-react/lib/core';
// then import echarts modules those you have used manually.
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ReactBootstrap from 'react-bootstrap';
import Chart from '../chart/chart';
import metricsDatas from '../../metricsData.json';
class LinkCapacity extends React.Component {

    render() {
        let config = {
            "bar": {
              "theme": "light",
              "type": "serial",
              "startDuration": 2,
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
                "title": "Link Capacity",
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
        let configValue = config.bar;
        return (

            <div>
                <Chart config={configValue} />
            </div>


        );
    }
}


export default LinkCapacity;
