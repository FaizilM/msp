import React from 'react';
import Chart from '../chart/chart';
import metricsDatas from '../../metricsData.json';
import { color } from '../../_constants';

let siteAvailabilityData = () => {
  let totalSite = 0;
  let availability = [0, 0, 0];
  let count =0;
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsDatas)) {
    totalSite += metricsDataValue.sites.length;
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
      if (sites[site].app_route_policy == true) {
        count++;
        availability[0] += 1;
      }

      if (sites[site].app_route_change == true) {
        count++;
        availability[1] += 1;
      }
      if (sites[site].no_app_route == true) {
        count++;
        availability[2] += 1;
      }
    }
  }
  return availability;
};

class SiteAvailability extends React.Component {

  render() {
    let config = {
      "bar": {
        "theme": "light",
        "type": "serial",
        "startDuration": 0,
        "legend": {
          "horizontalGap":70,
          "markerSize": 10,
          "data": [
            { "title": ">99.9%", "color": color.GREEN_COLOR },
            { "title": ">98%", "color": color.YELLOW_COLOR },
            { "title": ">96%", "color": color.ORANGE_COLOR }
          ]
        },
        "dataProvider": [{
          "availability": 99.9,
          "site": 0,
          "color": color.GREEN_COLOR
        }, {
          "availability": 98,
          "site": 0,
          "color": color.YELLOW_COLOR
        }, {
          "availability": 96,
          "site": 0,
          "color": color.ORANGE_COLOR
        }],
        "valueAxes": [{
          "position": "left",
          "minimum":0,
          "maximum":0
        }],
        "depth3D": 20,
        "angle": 30,
        "graphs": [{
          "balloonText": "Site: <b>[[value]]</b>",
          "fillColorsField": "color",
          "fillAlphas": 1,
          "lineAlpha": 0.1,
          "precision":0,
          "type": "column",
          "fixedColumnWidth": 50,
          "valueField": "site"
        }],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "rotate": false,
        "categoryField": "availability",
        "categoryAxis": {
          "gridPosition": "start",
          "labelFunction": function (value) {
            return ">" + value + "%";
          }
        }

      }
    };
    let configValue = config.bar;
   
    const availability = siteAvailabilityData();
    let totalSite = 0;
    for (let [Key, Value] of Object.entries(configValue)) {
      if (Key == "dataProvider") {
        for (let data = 0; data < Value.length; data++) {
          Value[data].site = availability[data];
          totalSite += availability[data];
        }
      }
    }
    configValue.valueAxes[0].maximum = totalSite;
    return (

      <div>
        <Chart config={configValue} />
      </div>


    );
  }
}


export default SiteAvailability;
