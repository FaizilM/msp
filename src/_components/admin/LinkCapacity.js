import React from 'react';
// import the core library.
import ReactEchartsCore from 'echarts-for-react/lib/core';
// then import echarts modules those you have used manually.
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ReactBootstrap from 'react-bootstrap';
import Chart from '../chart/chart';
import metricsData from '../../metricsData.json';
import { indexOf, replace } from 'lodash';


let linkCapacityData = () => {
    let capacity = [];
    let totalSite = [];
    let sitePerLink = [0, 0, 0, 0];
    let key = [];
    let i = 0;
    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData)) {
        let sites = metricsDataValue.sites;
        for (let site = 0; site < sites.length; site++) {
            let links = sites[site].links;
            for (let link = 0; link < links.length; link++) {
                let linkCapacity = links[link];
                for (let [linkKey, linkValue] of Object.entries(linkCapacity)) {
                    if (indexOf(key, linkKey) == -1) {
                        key.push(linkKey);
                    }
                    let index = indexOf(key, linkKey);
                   
                    if (capacity[index] == undefined) {
                        capacity.splice(index, 0, linkValue.utilization);
                        totalSite.splice(index, 0, 1);
                    } else {
                        capacity[index] = capacity[index] + linkValue.utilization;
                        totalSite[index] +=1;
                    }

                }
            }
        }

    }
    for(let index = 0; index < capacity.length; index++) {
        capacity[index] = capacity[index]/totalSite[index];
    }


    return capacity;
};
class LinkCapacity extends React.Component {

    render() {
        let config = {
            "bar": {
                "theme": "light",
                "type": "serial",
                "startDuration": 2,
                "dataProvider": [{
                    "link_capacity": "Broadband",
                    "capacity": "18Gbps",
                    "percentage": 0,
                    "color": "#0D8ECF"
                }, {
                    "link_capacity": "MPLS",
                    "capacity": "45Gbps",
                    "percentage": 0,
                    "color": "#0D8ECF"
                }, {
                    "link_capacity": "T1 Lines",
                    "capacity": "4Gbps",
                    "percentage": 0,
                    "color": "#0D8ECF"
                },
                {
                    "link_capacity": "4G/LTE",
                    "capacity": "29Gbps",
                    "percentage": 0,
                    "color": "#0D8ECF"
                }],
                "valueAxes": [{
                    "position": "left",
                    "title": "Percentage",
                    "labelFunction": function (value) {
                        return value + "%";
                    }
                }],
                "depth3D": 20,
                "angle": 30,
                "graphs": [{
                    "balloonText": "[[category]]: <b>[[value]]%</b>",
                    "fillColorsField": "color",
                    "fillAlphas": 1,
                    "lineAlpha": 0.1,
                    "type": "column",
                    "valueField": "percentage"
                    // "labelFunction": 
                }],
                "chartCursor": {
                    "categoryBalloonEnabled": false,
                    "cursorAlpha": 0,
                    "zoomable": false
                },
                "rotate": true,
                "categoryField": "link_capacity",
                "categoryAxis": {
                    "gridPosition": "start",
                    "title": "Link Capacity"
                },
                "export": {
                    "enabled": true
                }

            }
        };
        let configValue = config.bar;
        const packetLoss = linkCapacityData();
        for (let [packetLossKey, packetLossValue] of Object.entries(configValue)) {
            if (packetLossKey == "dataProvider") {
                for (let data = 0; data < packetLossValue.length; data++) {
                    packetLossValue[data].percentage = packetLoss[data];
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


export default LinkCapacity;
