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
import { color } from '../../_constants';


let jitterRatioData = () => {
    let jitter = [0, 0, 0];
    let totalSite = 0;
    let jitterSite = 0;

    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsDatas)) {
      let sites = metricsDataValue.sites;
      for (let site = 0; site < sites.length; site++) {
        let links = sites[site].links;
        for (let link = 0; link < links.length; link++) {
          let linkJitter = links[link];
          for (let [linkKey, linkValue] of Object.entries(linkJitter)) {
            jitterSite += linkValue.jitter;
          }

          if (jitterSite <= 4.5) {
            jitter[0] += 1;
          } else if (jitterSite <= 7.5) {
            jitter[1] += 1;
          } else {
            jitter[2] += 1;
          }
          totalSite++;
          jitterSite = 0;
          }
      }
    }
    jitter[0] = parseInt((jitter[0] / totalSite) * 100);
    jitter[1] = parseInt((jitter[1] / totalSite) * 100);
    jitter[2] = parseInt((jitter[2] / totalSite) * 100);

  return jitter;
  };

class JitterRatio extends React.Component {

    render() {
        let config = {
            "bar": {
              "theme": "light",
              "type": "serial",
              "startDuration": 2,
              "dataProvider": [{
                "jitter_ratio": 4.5,
                "percentage": 0,
                "color": "#FF0F00"
              }, {
                "jitter_ratio": 7.5,
                "percentage": 0,
                "color": "#0D8ECF"
              }, {
                "jitter_ratio": 7.6,
                "percentage": 0,
                "color": color.GREEN_COLOR
              }],
              "valueAxes": [{
                "position": "left",
                "title": "Percentage",
                "labelFunction": function(value){
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
                "type": "column",
                "valueField": "percentage"
              }],
              "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
              },
              "rotate": false,
              "categoryField": "jitter_ratio",
              "categoryAxis": {
                "gridPosition": "start",
                "title":"Jitter Ratio",
                "labelFunction": function(value){
                  if(value == 4.5 || value == 7.5) {
                    return "<" + value +"ms";
                  } else {
                    return ">" + 22 + "ms";
                  }

                }
              }

            }
          };
        let configValue = config.bar;

    const jitterRatio = jitterRatioData();

    for (let [Key, Value] of Object.entries(configValue)) {
      if (Key == "dataProvider") {
        for (let data = 0; data < Value.length; data++) {
          Value[data].percentage = jitterRatio[data];
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


export default JitterRatio;
