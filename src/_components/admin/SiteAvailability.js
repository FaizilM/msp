import React from 'react';
import Chart from '../chart/chart';
import metricsDatas from '../../metricsData.json';

let siteAvailabilityData = () => {
  let totalSite = 0;
  let availability = [0, 0, 0];
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsDatas)) {
    totalSite += metricsDataValue.sites.length;
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
      if (sites[site].app_route_policy == true) {
          availability[0] += 1;
      }
      
      if (sites[site].app_route_change == true) {
        availability[1] += 1;
    }
    if (sites[site].no_app_route == true) {
      availability[2] += 1;
  }
      console.log(availability);

    }
  }
 
console.log(availability);
  return availability;
};

class SiteAvailability extends React.Component {

  render() {
    let config = {
      "bar": {
        "theme": "light",
        "type": "serial",
        "startDuration": 2,
        "dataProvider": [{
          "availability": 99.9,
          "percentage": 0,
          "color": "#04D215"
        }, {
          "availability": 98,
          "percentage": 0,
          "color": "#0D8ECF"
        }, {
          "availability": 96,
          "percentage": 0,
          "color": "#FF0F00"
        }],
        "valueAxes": [{
          "position": "left",
          "title": "Percentage",
         
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
        "categoryField": "availability",
        "categoryAxis": {
          "gridPosition": "start",
          "title": "Site Availability",
          "labelFunction": function (value) {
            return "<" + value + "%";
          }
        }

      }
    };
    let configValue = config.bar;

    const availability = siteAvailabilityData();

    for (let [Key, Value] of Object.entries(configValue)) {
      if (Key == "dataProvider") {
        for (let data = 0; data < Value.length; data++) {
          Value[data].percentage = availability[data];
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
