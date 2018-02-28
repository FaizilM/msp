import React from 'react';
import { Chart } from '../';

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

class EventMetrics extends React.Component {

    render() {

        let option = {
            "type": "serial",
            "theme": "light",
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "mouseWheelZoomEnabled": true,
            "dataDateFormat": "YYYY-MM-DD",
            "valueAxes": [{
                "id": "v1",
                "axisAlpha": 0,
                "position": "left",
                "ignoreAxisWidth": true
            }],
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "graphs": [{
                "id": "g1",
                "balloon": {
                    "drop": true,
                    "adjustBorderColor": false,
                    "color": "#ffffff"
                },
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "bulletSize": 5,
                "hideBulletsCount": 50,
                "lineThickness": 2,
                "title": "red line",
                "useLineColorForBulletBorder": true,
                "valueField": "value",
                "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
            }],
            "chartScrollbar": {
                "graph": "g1",
                "oppositeAxis": false,
                "offset": 30,
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
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha": 1,
                "cursorColor": "#258cbb",
                "limitToGraph": "g1",
                "valueLineAlpha": 0.2,
                "valueZoomable": true
            },
            "valueScrollbar": {
                "oppositeAxis": false,
                "offset": 50,
                "scrollbarHeight": 10
            },
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "dashLength": 1,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            },
            "dataProvider": [{
                "date": "2012-07-27",
                "value": 13
            }, {
                "date": "2012-07-28",
                "value": 11
            }, {
                "date": "2012-07-29",
                "value": 15
            }, {
                "date": "2012-07-30",
                "value": 16
            }, {
                "date": "2012-07-31",
                "value": 18
            }]
        
    };

    return(

            <Chart config = { option } />
        );
}
}

export { EventMetrics };