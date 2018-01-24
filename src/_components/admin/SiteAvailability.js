import React from 'react';
import Chart from '../chart/chart';
import metricsDatas from '../../metricsData.json';

let siteAvailabilityData = () => {
  let totalSite = 0;
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsDatas)) {
    totalSite += metricsDataValue.sites.length;    
  }

  return 0;
};

class SiteAvailability extends React.Component {

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
          "labelFunction": function (value) {
            return value / 100;
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
        "rotate": false,
        "categoryField": "latency_ratio",
        "categoryAxis": {
          "gridPosition": "start",
          "title": "Site Availability",
          "labelFunction": function (value) {

            if (value == 30 || value == 50) {
              return "<" + value + "ms";
            } else {
              return ">" + 150 + "ms";
            }

          }
        }

      }
    };
    let configValue = config.bar;

    const latencyRatio = siteAvailabilityData();

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


export default SiteAvailability;
