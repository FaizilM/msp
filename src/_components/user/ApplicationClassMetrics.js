import React, { Component } from 'react';
import metricsData from '../../metricsData.json'
import '../../assets/css/App.css';
import Chart from '../chart/chart';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';

let packetLossData = () => {

  if(metricsData != null && metricsData !=undefined) {
    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData)) {
        if(metricsDataValue.sites != null && metricsDataValue.sites != undefined) {
            let sites = metricsDataValue.sites;
            for (let site = 0; site < sites.length; site++) {
                // if(metricsDataValue.application != null && metricsDataValue.application != undefined) {
                //     let applications = sites[site].application;
                //    // console.log("=====>>>>>>>>>>>>>>Application", applications);

                // }
            }
        }
    }
  }
}


class ApplicationClassMetrics extends Component {

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
    const packetLoss = packetLossData();


    return (
      <Col xs="12" sm="12" md="6" lg="6" xl="6">

          <div className="panel panel-default">
              <div className="panel-heading">
                  <i className=""></i> <h4> Application Class Metrics </h4>
              </div>
              <div className="panel-body">
                  <div className="list-group">
                      <Chart config={configValue} />
                  </div>
              </div>
          </div>
      </Col>

    );
  }
}

export default ApplicationClassMetrics;
