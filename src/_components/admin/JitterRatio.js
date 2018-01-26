import React from 'react';
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
        "startDuration": 0,
        "legend": {
          "markerSize": 10,
          "horizontalGap":70,
          "data": [
            { "title": "<4.5ms", "color": color.GREEN_COLOR },
            { "title": "<7.5ms", "color": color.YELLOW_COLOR },
            { "title": ">7.5ms", "color": color.ORANGE_COLOR }
          ]
        },
        "dataProvider": [{
          "jitter_ratio": 4.5,
          "percentage": 0,
          "color": color.GREEN_COLOR
        }, {
          "jitter_ratio": 7.5,
          "percentage": 0,
          "color": color.YELLOW_COLOR
        }, {
          "jitter_ratio": 7.6,
          "percentage": 0,
          "color": color.ORANGE_COLOR
        }],
        "valueAxes": [{
          "position": "left",
          "minimum":0,
          "maximum":100,
          "autoGridCount":false,
          "gridCount":5,
          "gridAlpha":0.2,
          "step":10,
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
          "precision":0,
          "lineAlpha": 0.1,
          "type": "column",
          "fixedColumnWidth": 50,
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
          "gridAlpha":0.2,
          "labelFunction": function (value) {
            if (value == 4.5 || value == 7.5) {
              return "<" + value + "ms";
            } else {
              return ">" + 7.5 + "ms";
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
