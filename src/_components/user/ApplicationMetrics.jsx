import React, { Component } from 'react';
import { Container, Row, Col, select } from 'reactstrap';
import { connect } from 'react-redux';
import AmCharts from '@amcharts/amcharts3-react';

function generateChartData() {

    var chartData = [];
    // current date
    var firstDate = new Date();
    console.log(firstDate)
    // now set 500 minutes back
    firstDate.setMinutes(firstDate.getDate() - 500);

    // and generate 500 data items
 
    var inOctets = 160;
    var packetLoss = 125;
    var outOctets = 8754;
    var jitter = 150
    var latency = 25;
    for (var i = 0; i < 500; i++) {
        var newDate = new Date(firstDate);
        // each time we add one minute
        newDate.setMinutes(newDate.getMinutes() + i);
        // some random number
        
        inOctets += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
        packetLoss += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
        outOctets += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
        jitter += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
        latency += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);        

        // add data item to the array
        chartData.push({
            date: newDate,
            inOctets: (inOctets < 0) ? 0 : inOctets,
            packetLoss: (packetLoss < 0) ? 0 : packetLoss,
            latency: (latency < 0) ? 0 : latency,
            jitter: (jitter < 0) ? 0 : jitter,
            outOctets: (outOctets < 0) ? 0 : outOctets
        });
    }
    console.log(chartData);
    return chartData;
}

class ApplicationMetrics extends React.Component {
    constructor() {
        super();

    }

    render() {

        var chartData = generateChartData();

        var config = {
            "type": "serial",
            "theme": "light",
            "marginRight": 80,
            "dataProvider": chartData,
            "legend": {
                "useGraphSettings": true
            },
            "valueAxes": [{
                "id":"v1",
                "axisColor": "#FF6600",
                "axisThickness": 2,
                "axisAlpha": 1,
                "position": "left"
            }, {
                "id":"v2",
                "axisColor": "#FCD202",
                "axisThickness": 2,
                "axisAlpha": 1,
                "offset": 50,
                "position": "right"
            }, {
                "id":"v3",
                "axisColor": "#B0DE09",
                "axisThickness": 2,
                "gridAlpha": 0,
                "offset": 50,
                "axisAlpha": 1,
                "position": "left"
            },
            {
                "id":"v4",
                "axisColor": "#c93a4f",
                "axisThickness": 2,
                "gridAlpha": 0,
                "offset": 100,
                "axisAlpha": 1,
                "position": "left"
            },{
                "id":"v5",
                "axisColor": "#4286f4",
                "axisThickness": 2,
                "axisAlpha": 1,
                "position": "right"
            }],
            "graphs": [{
                "valueAxis": "v1",
                "lineColor": "#FF6600",
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "In Octets",
                "valueField": "inOctets",
                "fillAlphas": 0
            }, {
                "valueAxis": "v2",
                "lineColor": "#FCD202",
                "bullet": "square",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Out Octets",
                "valueField": "outOctets",
                "fillAlphas": 0
            }, {
                "valueAxis": "v3",
                "lineColor": "#B0DE09",
                "bullet": "triangleUp",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Packet Loss",
                "valueField": "packetLoss",
                "fillAlphas": 0
            },
            {
                "valueAxis": "v4",
                "lineColor": "#c93a4f",
                "bullet": "diamond",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Jitter",
                "balloonText":"[[value]] ms ",
                "valueField": "jitter",
                "fillAlphas": 0
            },
            {
                "valueAxis": "v5",
                "lineColor": "#4286f4",
                "bullet": "bubble",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "title": "Latency",
                "balloonText":"[[value]] ms ",
                "valueField": "latency",
                "fillAlphas": 0
            }],
            "chartScrollbar": {
                "graph": "g1",
                "scrollbarHeight": 80,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount": true,
                "color": "#AAAAAA"
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
                "cursorPosition": "mouse"
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true
            }

        }

        return (
            <div>
                <AmCharts.React options={config} style={{ width: "100%", height: "350px" }} />
            </div>
        );
    }
}


export { ApplicationMetrics };