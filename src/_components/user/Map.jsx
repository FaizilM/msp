import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';
import { Container, Row, Col } from 'reactstrap';
import metricsData from '../../metricsData.json';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';


let populateMapSites = (config, user) => {

    var targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";

    for (let [Key, Value] of Object.entries(config)) {

        if (Key == "dataProvider") {

            for (let [Key, metrics] of Object.entries(metricsData)) {

                if (metrics.username === user) {

                    for (let [Key, site] of Object.entries(metrics.sites)) {
                        let color = site.no_app_route ? "red" : "green"
                        Value.images.push({
                            "label": site.name,
                            "svgPath": targetSVG,
                            "zoomLevel": 2,
                            "scale": 1.0,
                            "title": site.name,
                            "latitude": site.latitude,
                            "longitude": site.longitude,
                            "color": color
                        }

                        )
                    }
                }
            }
        }
    }
}

let getLinkDetails = (routeType) => {
    let response = ""

    let lineObject = {}

    switch (routeType) {
        case "NO_ROUTE":
            lineObject = {
                "balloonText": "<b>Link </b>: MPLS-VES <br> <b>Event </b>: No Route",
                "color": "red",
                "arc": -0.54,
                "accessibleLabel": "No Route",
            }
            break;
        case "APP_ROUTE":
            lineObject = {
                "balloonText": "<b>Link </b>: Broad band <br> <b>Event </b>: App Route",
                "color": "#2d862d",
                "accessibleLabel": "Broad band",
            }
            break;
        default:
            lineObject = {
                "color": "#FFDE24", // change the color
                "accessibleLabel": "mpls",
                "balloonText": "<b>Link </b>: MPLS <br> <b>Event </b>:  Route Change",
                "arc": -0.1,
            }
    }
    return lineObject;
}

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.changeDuration = this.changeDuration.bind(this);
        this.state = {
            duration: "",
        }
    }

    changeDuration(selectedSite) {
        this.setState({ duration: selectedSite.target.value });
    }

    render() {

        let user = this.props.authentication.user.username

        var starSVG = "M20,7.244 L12.809,6.627 L10,0 L7.191,6.627 L0,7.244 L5.455,11.971 L3.82,19 L10,15.272 L16.18,19 L14.545,11.971 L20,7.244 L20,7.244 Z M10,13.396 L6.237,15.666 L7.233,11.385 L3.91,8.507 L8.29,8.131 L10,4.095 L11.71,8.131 L16.09,8.507 L12.768,11.385 L13.764,15.666 L10,13.396 L10,13.396 Z";
        var config = {
            "type": "map",
            "theme": "none",
            "map": "worldLow",
            "imagesSettings": {
                "rollOverColor": "#708090",
                "rollOverScale": 3,
                "selectedScale": 3,
                "selectedColor": "#708090",
                "color": "#13564e",
                "labelRollOverColor": "#006666"
            },
            "areasSettings": {
                "unlistedAreasColor": "#ffffff",
                outlineThickness: 0.1,

            },
            "dataProvider": {
                "map": "worldLow",
                "images": []
            },
            "linesSettings": {

                "arrow": "middle",
                "color": "#585869",
                "alpha": 0.6,
                "arrowAlpha": 1

            },
            "listeners": [{
                "event": "clickMapObject",
                "method": function (event) {

                    if (event.mapObject && event.mapObject.lines) {

                        let data = {};
                        data["customers"] = metricsData

                        let userDetails = jsonQuery('customers[username=' + user + ']', {
                            data: data
                        }).value

                        for (let [Key, site] of Object.entries(userDetails.sites)) {

                            if (site.name == event.mapObject.label) {

                                for (let [Key, links] of Object.entries(site.linkedWith)) {

                                    let linkObj = getLinkDetails(links.eventType);

                                    let lineObject = {
                                        "latitudes": [event.mapObject.latitude, links.latitude],
                                        "longitudes": [event.mapObject.longitude, links.longitude],
                                        "arrowColor": "#2d862d",
                                        "arrowSize": 9,
                                        "balloonText": linkObj.balloonText,
                                        "color": linkObj.color,
                                        "thickness": 3,
                                        "arrowAlpha": 2,
                                        "accessibleLabel": linkObj.accessibleLabel,
                                        "bringForwardOnHover": true
                                    }

                                    let lineObject2 = {
                                        "latitudes": [event.mapObject.latitude, links.latitude],
                                        "longitudes": [event.mapObject.longitude, links.longitude],
                                        "arrowColor": "#2d862d",
                                        "arrowSize": 9,
                                        "arrowAlpha": 2,
                                        "color": "#2d862d", // change the color
                                        "accessibleLabel": "mpls",
                                        "balloonText": "<b>Link </b>: MPLS <br> <b>Event </b>:  Route Change",
                                        "arc": -0.1,
                                        "thickness": 3,
                                        "bringForwardOnHover": true
                                    }

                                    event.mapObject.lines.push(lineObject2);

                                    event.mapObject.lines.push(lineObject);
                                }
                            }

                        }

                        event.mapObject.validate();
                    }
                }
            }]
        }

        //Populate sites in map
        populateMapSites(config, user);

        return (

            <Col xs="12" sm="12" md="12" lg="12" xl="12">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <Row>
                            <Col lg="4">
                                <h3>Sites</h3>
                            </Col>
                            <Col lg={{ size: 3 }} className="pull-right">
                                <div className="form-group">
                                    <select className="form-control" onChange={this.changeDuration}>
                                        <option>Hour</option>
                                        <option>Day</option>
                                        <option>Week</option>
                                        <option>Month</option>
                                        <option>Year</option>
                                    </select>
                                </div>
                            </Col>
                        </Row>

                    </div>
                    <div className="panel-body">
                        <div className="list-group">
                            <div style={{ width: "100%", height: "450px", backgroundColor: "#add8e6" }} >
                                <AmCharts.React options={config} style={{ width: "100%", height: "350px" }} />
                            </div>
                        </div>
                    </div>
                </div>
            </Col>

        );
    }
}

function mapStateToProps(state) {
    const { authentication } = state;

    return {
        authentication
    };
}

const connectedMap = connect(mapStateToProps)(Map);
export { connectedMap as Map };
