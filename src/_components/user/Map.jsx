import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';
import { Container, Row, Col } from 'reactstrap';

class Map extends React.Component {

  render() {


  var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

var starSVG = "M20,7.244 L12.809,6.627 L10,0 L7.191,6.627 L0,7.244 L5.455,11.971 L3.82,19 L10,15.272 L16.18,19 L14.545,11.971 L20,7.244 L20,7.244 Z M10,13.396 L6.237,15.666 L7.233,11.385 L3.91,8.507 L8.29,8.131 L10,4.095 L11.71,8.131 L16.09,8.507 L12.768,11.385 L13.764,15.666 L10,13.396 L10,13.396 Z";

var config = {
  "type": "map",

  "theme": "none",
  "map": "worldLow",

  "imagesSettings": {
    "rollOverColor": "#089282",
    "rollOverScale": 3,
    "selectedScale": 3,
    "selectedColor": "#089282",
    "color": "#13564e",
    "labelRollOverColor":"#006666"
  },

  "areasSettings": {
    "unlistedAreasColor": "#15A892",
      outlineThickness:0.1,

  },

  "dataProvider": {
    "map": "worldLow",


    "images": [ {

          "label": "Paris",
          "svgPath": targetSVG,
          "zoomLevel": 2,
          "scale": 1.0,
          "title": "Paris",
          "latitude": 48.8567,
          "longitude": 2.3510,

        }, {
          "label": "Toronto",
          "svgPath": targetSVG,
          "zoomLevel": 2,
          "scale": 1.0,
          "title": "Toronto",
          "latitude": 43.8163,
          "longitude": -79.4287
        }, {
          "label": "Los Angeles",
          "svgPath": targetSVG,
          "zoomLevel": 2,
          "scale": 1.0,
          "title": "Los Angeles",
          "latitude": 34.3,
          "longitude": -118.15
        }, {
          "label": "Havana",
          "svgPath": targetSVG,
          "zoomLevel": 2,
          "scale": 1.0,
          "title": "Havana",
          "latitude": 23,
          "longitude": -82
        },
        {
          "label": "India",
          "svgPath": targetSVG,
          "zoomLevel": 2,
          "scale": 1.0,
          "title": "Site : India </br> Latency : 25ms   Normal : 587 </br> Jitter : 3.75ms  No.of Links : 4  No.of CPE : 2 ",
          "latitude": 11.0168,
          "longitude": 76.9558,

        }]
  },
  "linesSettings": {
  "arc": -0.7, // this makes lines curved. Use value from -1 to 1
  "arrow": "middle",
  "color": "#585869",
  "alpha": 0.6,
  "arrowAlpha": 1,
  "arrowSize": 4
  },

  "listeners": [{
    "event": "clickMapObject",
    "method": function(event) {

        console.log("event.mapObject", event.mapObject)
        if(event.mapObject && event.mapObject.lines) {

            var object =  {
                "latitudes": [event.mapObject.latitude, 23],
                "longitudes": [event.mapObject.longitude, -82]
            }
            var object1 =  {
                "latitudes": [event.mapObject.latitude, 34.3],
                "longitudes": [event.mapObject.longitude, -118.15]
            }
            event.mapObject.lines.push(object);
            event.mapObject.lines.push(object1);
            event.mapObject.validate();
        }

    }
  }]
}

    return (
    <Col xs="12" sm="12" md="12" lg="12" xl="12">
        <div className="panel panel-default">
            <div className="panel-heading">
                <i className=""></i> <h3>Sites</h3>
            </div>
            <div className="panel-body">
                <div className="list-group">
                <div style={{ width: "100%", height: "450px", backgroundColor: "lightblue" }} >
                  <AmCharts.React options={config} style={{ width: "100%", height: "350px" }} />
                </div>

                </div>
            </div>
        </div>
    </Col>

    );
  }
}


export { Map };
