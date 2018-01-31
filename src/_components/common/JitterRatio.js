import React from 'react';
import { Chart } from '../';
import metricsData from '../../metricsData.json';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';


let jitterRatioData = (filter, customer) => {
  let metrics = [];
  if (customer == undefined) {
    metrics = metricsData;
  } else {
    metrics.push(metricsData[0]);
  }
  let jitter = [0, 0, 0];
  let totalSite = 0;
  let jitterSite = 0;
  let totalLink = 0;
  let jitterData = {};
  let siteName;
  let siteGroup;
  let linkName;
  let applicationName;
  if (filter != undefined) {
    if (filter.siteName != "" && filter.siteName != undefined && filter.siteName != "All Sites") {
      siteName = filter.siteName;
    }
    if (filter.linkName != "" && filter.linkName != undefined && filter.linkName != "All Links") {
      linkName = filter.linkName;
    }
    if (filter.applicationName != "" && filter.applicationName != undefined && filter.applicationName != "All Applications") {
      applicationName = filter.applicationName;
    }
    if (filter.siteGroup != "" && filter.siteGroup != undefined && filter.siteGroup != "All Site Group") {
      siteGroup = filter.siteGroup;
    }
  }
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
      let links = sites[site].links;
      if (customer == undefined) {
        for (let link = 0; link < links.length; link++) {
          let linkJitter = links[link];
          for (let [linkKey, linkValue] of Object.entries(linkJitter)) {
            jitterSite += linkValue.jitter;
            totalLink++;
          }
        }
        if (jitterSite > 0 && jitterSite / totalLink <= 4.5) {
          jitter[0] += 1;
        } else if (jitterSite > 0 && jitterSite / totalLink <= 7.5) {
          jitter[1] += 1;
        } else if (jitterSite > 0 && jitterSite / totalLink > 22) {
          jitter[2] += 1;
        }
        totalLink = 0;
        totalSite++;
        jitterSite = 0;
      } else {
        if ((siteGroup != undefined && sites[site].sitesgroup == siteGroup) || siteGroup == undefined) {
          if ((siteName != undefined && sites[site].name == siteName) || siteName == undefined) {

            for (let link = 0; link < links.length; link++) {
              let linkLosses = links[link];
              if ((linkName != undefined && linkLosses[linkName] != undefined) || (linkName == undefined)) {

                for (let [linkKey, linkValue] of Object.entries(linkLosses)) {
                  if (jitterData[linkKey] == undefined) {
                    jitterData[linkKey] = linkValue.jitter;
                  } else {
                    jitterData[linkKey] = (jitterData[linkKey] + linkValue.jitter) / 2;
                  }

                }
              }
            }
          }
        }
      }

    }
  }

  if (customer == undefined) {
    jitter[0] = parseInt((jitter[0] / totalSite) * 100);
    jitter[1] = parseInt((jitter[1] / totalSite) * 100);
    jitter[2] = parseInt((jitter[2] / totalSite) * 100);

    return jitter;
  } else {
    return jitterData;
  }

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
          "horizontalGap": 70,
          "data": [

          ]
        },
        "dataProvider": [],
        "valueAxes": [{
          "position": "left",
          "minimum": 0,
          "autoGridCount": false,
          "gridCount": 5,
          "gridAlpha": 0.2,
          "step": 10,
        }],
        "depth3D": 20,
        "angle": 30,
        "graphs": [{
          "balloonText": "Milli Second: <b>[[value]]ms</b>",
          "fillColorsField": "color",
          "fillAlphas": 1,
          "precision": 1,
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
        "categoryField": "name",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0.2
        }

      }
    };

    let configValue = config.bar;
    const jitterRatio = jitterRatioData(this.props.filter, this.props.customer);

    if (this.props.customer == undefined) {
      for (let [jitterKey, jitterValue] of Object.entries(configValue)) {
        if (jitterKey == "valueAxes") {
          let label = [];
          let labelData = jitterValue[0];
          labelData["labelFunction"] = function (value) {
            return value + "%";
          };
          labelData["maximum"] = 100;
          label.push(labelData);
          jitterValue = label;
        }
        if (jitterKey == "dataProvider") {
          for (let data = 0; data < jitterValue.length; data++) {
            jitterValue[data].percentage = jitterRatio[data];
          }
          jitterValue.push({
            "jitter_ratio": 4.5,
            "percentage": 0,
            "color": color.GREEN_COLOR
          }, {
              "jitter_ratio": 7.5,
              "percentage": 0,
              "color": color.YELLOW_COLOR
            }, {
              "jitter_ratio": 22,
              "percentage": 0,
              "color": color.ORANGE_COLOR
            })
          for (let data = 0; data < jitterValue.length; data++) {
            jitterValue[data].percentage = jitterRatio[data];
          }
        }
        if (jitterKey == "categoryField") {
          configValue.categoryField = "jitter_ratio";
        }
        if (jitterKey == "categoryAxis") {
          let labelData = jitterValue;
          labelData["labelFunction"] = function (value) {
            if (value == 4.5 || value == 7.5) {
              return "<" + value + "ms";
            } else {
              return ">" + value + "ms";
            }

          }
        }

        if (jitterKey == "legend") {
          jitterValue.data.push(
            { "title": "<4.5ms", "color": color.GREEN_COLOR },
            { "title": "<7.5ms", "color": color.YELLOW_COLOR },
            { "title": ">22ms", "color": color.ORANGE_COLOR }
          );
        }

      }
      configValue.graphs[0].precision = 0;
      configValue.graphs[0].balloonText = "Percentage: <b>[[value]]%</b>";
    } else {
      let colorcode = [color.GREEN_COLOR, color.YELLOW_COLOR, color.ORANGE_COLOR, color.BLUE_COLOR]
      for (let [key, value] of Object.entries(configValue)) {
        if (key == "dataProvider") {
          let index = 0;
          for (let [jitterKey, jitterValue] of Object.entries(jitterRatio)) {
            let jsonjitterData = { "name": jitterKey, "percentage": jitterValue, "color": colorcode[index++] }
            value.push(jsonjitterData);
          }
        }
        if (key == "legend") {
          let index = 0;

          for (let [jitterKey, jitterValue] of Object.entries(jitterRatio)) {
            let jsonjitterData = { "title": jitterKey, "color": colorcode[index++] }
            value.data.push(jsonjitterData);
          }
        }
      }
    }


    return (
      <Col xs="12" sm="12" md="6" lg="6" xl="6">
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className=""></i>
            <h3>Jitter Ratio</h3>
          </div>
          <div className="panel-body">
            <div className="list-group">
              <div>
                <Chart config={configValue} />
              </div>
            </div>
          </div>
        </div>
      </Col>
    );
  }
}

export { JitterRatio };
