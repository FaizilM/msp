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

let latencyRatioData = () => {
    let latency = [0, 0, 0];
    let totalSite = 0;
    let latencySite = 0;
   
    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsDatas)) {
      let sites = metricsDataValue.sites;  
      for (let site = 0; site < sites.length; site++) {
        let links = sites[site].links;
        for (let link = 0; link < links.length; link++) {
          let linkLatency = links[link];
          for (let [linkKey, linkValue] of Object.entries(linkLatency)) {
            latencySite += linkValue.latency;
          }
          
          if (latencySite <= 30) {
            latency[0] += 1;
          } else if (latencySite <= 50) {
            latency[1] += 1;
          } else {
            latency[2] += 1;
          }
          totalSite++;
          latencySite = 0;
          }
      }
    }
    latency[0] = parseInt((latency[0] / totalSite) * 100);
    latency[1] = parseInt((latency[1] / totalSite) * 100);
    latency[2] = parseInt((latency[2] / totalSite) * 100);
  
  return latency;
  };

class LatencyRatio extends React.Component {

    render() {
        let config = {
            "bar": {
              "theme": "light",
              "type": "serial",
              "startDuration": 2,
              "dataProvider": [{
                "latency_ratio": 150,
                "percentage": 0,
                "color": "#FF0F00"
              }, {
                "latency_ratio": 50,
                "percentage": 0,
                "color": "#0D8ECF"
              }, {
                "latency_ratio": 30,
                "percentage": 0,
                "color": "#04D215"
              }],
              "valueAxes": [{
                "position": "left",
                "title": "Percentage",
                "labelFunction": function(value){
                     return value/100;
                }
              }],
              "depth3D": 20,
              "angle": 30,
              "graphs": [{
                "balloonText": "Percentage: <b>[[value]]%</b>",
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
              "categoryField": "latency_ratio",
              "categoryAxis": {
                "gridPosition": "start",
                "title":"Latency Ratio",
                "labelFunction": function(value){
                    console.log(value);
                    
                  if(value == 30 || value == 50) {
                    return "<" + value +"ms";
                  } else {
                    return ">" + 150 + "ms";
                  }
                  
                }
              },
              "export": {
                "enabled": true
              }
          
            }
          };
        let configValue = config.bar;

    const latencyRatio = latencyRatioData();
    console.log(latencyRatio);
    
    for (let [Key, Value] of Object.entries(configValue)) {
      if (Key == "dataProvider") {
        for (let data = 0; data < Value.length; data++) {
          Value[data].percentage = latencyRatio[data];
        }
      }

    }    

        return (

            <div>
                <Chart config={configValue} />
            </div>


        );
    }
}


export default LatencyRatio;
