import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import  AmCharts  from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';

class Map extends React.Component {

    render() {


        /**
     * SVG path for target icon
     */
    var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";


    /**
     * Create the map
     */
        var config =  {
        "type": "map",
        "theme": "light",

        "titles": [{
          "text": "Your Sites"
          }, ],
        "dataProvider": {
        "map": "worldLow",

    "lines": [ {
      "latitudes": [ 48.8567, 43.8163, 34.3, 23 , 48.8567, 11.0168],
      "longitudes": [ 2.3510, -79.4287, -118.15, -82 , 2.3510, 76.9558]
    },
    {
      "latitudes": [43.8163,23 ],
      "longitudes": [ -79.4287, -82 ]
    },
    {
      "latitudes": [11.0168,23 ],
      "longitudes": [ 76.9558, -82 ]
    }
    ],
    "images": [ {
      "label": "Paris",
      "svgPath": targetSVG,
      "title": "Paris",
      "latitude": 48.8567,
      "longitude": 2.3510
    }, {
    "label": "Toronto",
      "svgPath": targetSVG,
      "title": "Toronto",
      "latitude": 43.8163,
      "longitude": -79.4287
    }, {
    "label": "Los Angeles",
      "svgPath": targetSVG,
      "title": "Los Angeles",
      "latitude": 34.3,
      "longitude": -118.15
    }, {
    "label": "Havana",
      "svgPath": targetSVG,
      "title": "Havana",
      "latitude": 23,
      "longitude": -82
    },
    {

    "label": "India",
      "svgPath": targetSVG,
      "title": "Site : India </br> Latency : 25ms   Normal : 587 </br> Jitter : 3.75ms  No.of Links : 4  No.of CPE : 2 ",
      "latitude": 11.0168,
      "longitude": 76.9558
    },]
  },
  "zoomControl": {
      "gridHeight": 100,
      "draggerAlpha": 1,
      "gridAlpha": 10,
      "zoomControlEnabled": true
    },
    "balloon": {
        "drop": true
      },
      "backgroundZoomsToTop": true,
        "linesAboveImages": true,
  "linesSettings": {
  "arc": -0.85,
  "alpha": 0.5,
  },
  "areasSettings": {
    "unlistedAreasColor": "#FFCC00",
    "autoZoom": true,
    "selectedColor": "#CC0000",
    "balloonText": "",

  },
  "imagesSettings": {
   "color": "#585869",
   "rollOverColor": "red",
   "selectedColor": "#585869",
   "pauseDuration": 0.2,
   "animationDuration": 4,
   "adjustAnimationSpeed": true
 },
  "export": {
    "enabled": true
  }
        }

return (
            <div style={{ width: "100%", height: "450px", backgroundColor:"lightblue" }} >
              <AmCharts.React options={config} style={{ width: "100%", height: "350px" }} />
            </div>
        );
    }
}


export { Map };
