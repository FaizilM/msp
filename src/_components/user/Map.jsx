import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';
import { Container, Row, Col } from 'reactstrap';
import metricsData from '../../metricsData.json';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';
import { getValueByTime, getKPIDataByPercentage } from '../../_helpers/shared'

//Get All KPI details for sites
let getKPIDetails = (links, timeFilterBy) => {

    let response = {};
    let totalUtilization = 0;
    let totalLatency = 0;
    let totalJitter = 0;
    let totalPacketLoss = 0;
    for(let [Key, link] of Object.entries(links[0])) {
        if(Key && link) {
            totalUtilization = totalUtilization + link.utilization
            totalLatency = totalLatency + link.latency
            totalJitter = totalJitter + link.jitter
            totalPacketLoss = totalPacketLoss + link.packet_loss
        }
    }

    response["totalUtilization"] = Math.round(getKPIDataByPercentage(totalUtilization, timeFilterBy));
    response["totalLatency"] = Math.round(getValueByTime(totalLatency, timeFilterBy));
    response["totalJitter"] = Math.round(getValueByTime(totalJitter, timeFilterBy))
    response["totalPacketLoss"] = Math.round(getKPIDataByPercentage(totalPacketLoss, timeFilterBy));
    return response;
    
}   

let populateMapSites = (config, user, timeFilterBy) => {

    var targetSVG = "M3.5,13.277C3.5,6.22,9.22,0.5,16.276,0.5C23.333,0.5,29.053,6.22,29.053,13.277C29.053,14.54,28.867,15.759,28.526,16.914C26.707,24.271,16.219,32.5,16.219,32.5C16.219,32.5,4.37,23.209,3.673,15.542C3.673,15.542,3.704,15.536,3.704,15.536C3.572,14.804,3.5,14.049,3.5,13.277C3.5,13.277,3.5,13.277,3.5,13.277M16.102,16.123C18.989,16.123,21.329,13.782,21.329,10.895C21.329,8.008,18.989,5.668,16.102,5.668C13.216,5.668,10.876,8.008,10.876,10.895C10.876,13.782,13.216,16.123,16.102,16.123C16.102,16.123,16.102,16.123,16.102,16.123";
    
    let data = {};
    data["customers"] = metricsData

    let sites = jsonQuery('customers[username=' + user + '].sites', {
        data: data
    }).value

    for (let [Key, Value] of Object.entries(config)) {

        if (Key == "dataProvider") {

            for (let [siteIndex, site] of Object.entries(sites)) {
                let color = site.no_app_route ? "red" : "green"
                if ((timeFilterBy.toString() === 'MONTH' || timeFilterBy.toString() === 'YEAR') && parseInt(siteIndex) === 0) {
                    color = "yellow"
                }

                let allSites = {}
                allSites["allSites"] = sites;
                let links = jsonQuery('allSites[name=' + site.name + '].links', {
                    data: allSites
                }).value

                let kpiDetails = getKPIDetails(links, timeFilterBy);

                Value.images.push({
                    "label": site.name,
                    "svgPath": targetSVG,
                    "zoomLevel": 2,
                    "scale": 1.0,
                    "title": "<b>" + site.name + "</b>"+
                                "<br> Utilization :"+kpiDetails.totalUtilization+" %<br>" +
                                "Latency : "+kpiDetails.totalLatency+" ms <br>"+
                                "Jitter : "+kpiDetails.totalJitter+" ms <br>"+
                                "Packet Loss : "+kpiDetails.totalPacketLoss+" %",
                    "latitude": site.latitude,
                    "longitude": site.longitude,
                    "color": color
                })
            }

        }
    }
}

let getLinkDetails = (routeType, currentTimeFrame) => {
    let response = ""

    let lineObject = {}

    switch (routeType) {
        case "NO_ROUTE":
            lineObject = {
                "balloonText": "<b>Link </b>: MPLS-VES <br> Event: No Route<br> Latency : 52ms <br> Jitter : 5.5ms <br> Packet Loss : 100%",
                "color": "red",
                "arc": -0.54,
                "accessibleLabel": "No Route",
                "arrowColor":"red"
            }
            break;
        case "APP_ROUTE":
            lineObject = {
                "balloonText": "<b>Link </b>: Broad band <br>Event: App Route<br> Latency : 5ms <br> Jitter : 0.65ms <br> Packet Loss : 4%",
                "color": "#2d862d",
                "accessibleLabel": "Broad band",
                "arrowColor":"#2d862d"
            }
            break;
        default:
            lineObject = {
                "color": "#FFDE24", // change the color
                "accessibleLabel": "mpls",
                "balloonText": "<b>Link </b>: MPLS <br>Event:  Route Change<br> Latency : 18ms <br> Jitter : 1.65ms <br> Packet Loss : 14%",
                "arc": -0.1,
                "arrowColor":"#FFDE24"
                
            }
    }
    return lineObject;
}

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.changeDuration = this.changeDuration.bind(this);
        this.state = {
            duration: "HOUR",
        }
    }

    changeDuration(selectedSite) {
        this.setState({ duration: selectedSite.target.value });
    }

    render() {

        let user = this.props.authentication.user.username
        let doubleClicked = false;

        let currentTimeFrame = this.state.duration;
        var starSVG = "M20,7.244 L12.809,6.627 L10,0 L7.191,6.627 L0,7.244 L5.455,11.971 L3.82,19 L10,15.272 L16.18,19 L14.545,11.971 L20,7.244 L20,7.244 Z M10,13.396 L6.237,15.666 L7.233,11.385 L3.91,8.507 L8.29,8.131 L10,4.095 L11.71,8.131 L16.09,8.507 L12.768,11.385 L13.764,15.666 L10,13.396 L10,13.396 Z";
        var config = {
            "type": "map",
            "theme": "none",
            "map": "worldLow",
            "imagesSettings": {
                "rollOverColor": "#708090",
                "rollOverScale": 1,
                "selectedScale": 1,
                "selectedColor": "#708090",
                "color": "#13564e",
                "labelRollOverColor": "#006666"
            },
            "areasSettings": {
                "unlistedAreasColor": "#ffffff",
                "autoZoom": false

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
                        event.mapObject.lines = [];

                        let userDetails = jsonQuery('customers[username=' + user + ']', {
                            data: data
                        }).value

                        for (let [siteIndex, site] of Object.entries(userDetails.sites)) {

                            if (site.name == event.mapObject.label) {
                                
                                for (let [Key, links] of Object.entries(site.linkedWith)) {

                                    let linkObj = getLinkDetails(links.eventType, currentTimeFrame);
                                    let linkColor = "#2d862d" //Green By default
                                    let eventType = "App Route"

                                    let lineObject = {
                                        "latitudes": [event.mapObject.latitude, links.latitude],
                                        "longitudes": [event.mapObject.longitude, links.longitude],
                                        "arrowColor": linkObj.arrowColor,
                                        "arrowSize": 9,
                                        "balloonText": linkObj.balloonText,
                                        "color": linkObj.color,
                                        "thickness": 3,
                                        "arrowAlpha": 2,
                                        "accessibleLabel": linkObj.accessibleLabel,
                                        "bringForwardOnHover": true,
                                    }

                                    if (links.eventType === "NO_ROUTE") {
                                        lineObject["url"] = window.location.href + "/tab=3"
                                    }

                                    if ((currentTimeFrame.toString() === 'MONTH' || currentTimeFrame.toString() === 'YEAR') && parseInt(siteIndex) === 0) {
                                        linkColor = "yellow"
                                        eventType = "Route change"
                                    }   

                                    let lineObject2 = {
                                        "latitudes": [event.mapObject.latitude, links.latitude],
                                        "longitudes": [event.mapObject.longitude, links.longitude],
                                        "arrowColor": "#2d862d",
                                        "arrowSize": 9,
                                        "arrowAlpha": 2,
                                        "color": linkColor, // change the color
                                        "accessibleLabel": "mpls",
                                        "balloonText": "<b>Link </b>: MPLS <br>Event:  "+ eventType +"<br> Latency : 25 ms <br> Jitter : 3.65 ms <br> Packet Loss : 14 %",
                                        "arc": -0.1,
                                        "thickness": 3,
                                        "bringForwardOnHover": true
                                    }

                                    
                                    event.mapObject.lines.push(lineObject2);

                                    event.mapObject.lines.push(lineObject);
                          
                                }
                            }
                        }
                        //update the area's color
                        event.mapObject.update();
                    }
                }
            }]
        }

        //Populate sites in map
        populateMapSites(config, user, this.state.duration);

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
                                    <select className="form-control">
                                        <option>Geo Topology</option>
                                    </select>
                                </div>
                            </Col>
                            <Col lg={{ size: 3 }} className="pull-right">
                                <div className="form-group">
                                    <select className="form-control" onChange={this.changeDuration}>
                                        <option value="HOUR">1 Hour</option>
                                        <option value="DAY">1 Day</option>
                                        <option value="WEEK">1 Week</option>
                                        <option value="MONTH">1 Month</option>
                                        <option value="YEAR">1 Year</option>
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
