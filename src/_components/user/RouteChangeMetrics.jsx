import React from 'react';
import { Chart } from '../';
import { color } from '../../_constants';

function generateChartData() {

    var chartData = [];
    // current date
    var firstDate = new Date();
    var randomTime = new Date();
    console.log("first", firstDate);
    // now set 500 minutes back
    firstDate.setMinutes(firstDate.getDate() - 500);
    randomTime.setMinutes(randomTime.getDate() - 200);

    // and generate 500 data items

    var utilization = 25;
    for (var i = 0; i < 500; i++) {
        var newDate = new Date(firstDate);
        console.log("new Data");

        // each time we add one minute
        newDate.setMinutes(newDate.getMinutes() + i);
        // some random number
        if (i > 190 && i < 200) {
            utilization = 2;
        } else {
            utilization += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
            if (utilization <= 0) {
                utilization = 1;
            }
        }
        if (i < 200) {
            // add data item to the array
            chartData.push({
                date: newDate,
                lineColor: color.BLUE_COLOR,
                utilization: utilization,
                name: 'mpls'
            });
        } else {
            // add data item to the array
            chartData.push({
                date: newDate,
                lineColor: 'red',
                utilization: utilization,
                name: 'default'
            });
        }
    }

    return chartData;
}

class RouteChangeMetrics extends React.Component {

    render() {
        var chartData = generateChartData();
        let option = {
            "type": "serial",
            "theme": "light",
            "marginRight": 80,
            "dataProvider": chartData,
            "legend": {
                "horizontalGap": 70,
                "markerSize": 10,
                "data": [
                    { "title": "MPLS", "color": color.BLUE_COLOR },
                    { "title": "Default", "color": 'red' }
                ]
            },
            "valueAxes": [{
                "id": "v1",
                "minimum": 0,
                "axisColor": "#FF6600",
                "axisThickness": 2,
                "axisAlpha": 1,
                "position": "left"
            }],
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "graphs": [{
                "valueAxis": "v1",
                "lineColor": "#FF6600",
                "bullet": "round",
                "bulletBorderThickness": 1,
                "hideBulletsCount": 30,
                "lineColorField": "lineColor",
                "title": "Utilization",
                "valueField": "utilization",
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
            "valueScrollbar": {
                "oppositeAxis": false,
                "offset": 50,
                "scrollbarHeight": 10
            },
            "chartCursor": {
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha": 1,
                "cursorColor": "#258cbb",
                "limitToGraph": "g1",
                "valueLineAlpha": 0.2,
                "valueZoomable": true
            },
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "mm",
                "parseDates": true
            }

        };

        return (

            <Chart config={option} />
        );
    }
}

export { RouteChangeMetrics };