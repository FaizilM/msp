import React, { Component } from 'react';
import '../../assets/css/App.css';
import metricsDatas from '../../metricsData.json';
import { Link, Events } from 'react-scroll';
import { color } from '../../_constants';

let siteAvailabilityData = () => {
    let totalSite = 0;
    let availability = [0, 0, 0];
    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsDatas)) {
        totalSite += metricsDataValue.sites.length;
        let sites = metricsDataValue.sites;
        for (let site = 0; site < sites.length; site++) {
            if (sites[site].app_route_policy == true) {
                availability[0] += 1;
            }

            if (sites[site].app_route_change == true) {
                availability[1] += 1;
            }
            if (sites[site].no_app_route == true) {
                availability[2] += 1;
            }

        }
    }

    return availability;
};
class Sites extends Component {
    constructor(props) {
        super(props);
        this.state =
            {
                data: {
                    'app_route_policy': 12500,
                    'app_route_change': 60,
                    'no_app_route': 7
                }

            }
    };

    render() {
        let availability = siteAvailabilityData();
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ float: 'left' }}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke={color.GREEN_COLOR} strokeWidth="5" fill="white" />
                        <a href="#customerData" style={{ color: "white", textDecoration: 'underline' }}>
                            <text textAnchor="middle" x="60" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline', justifyContent: 'center' }}>{this.state.data.app_route_policy}</text>
                        </a>
                    </svg>
                    <div><h4>App Route Policy</h4></div>
                </div>
                <div style={{ float: 'right' }}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="#FFFF00" strokeWidth="5" fill="white" />
                        <a href="#customerData" style={{ color: "white", textDecoration: 'underline' }}>
                            <text textAnchor="middle" x="60" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>{this.state.data.app_route_change}</text>
                        </a>
                    </svg>
                    <div><h4>App Route Change</h4></div>
                </div>
                <div style={{ float: 'right' }}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="#ff0011" strokeWidth="5" fill="white" />
                        <a href="#customerData" style={{ color: "white", textDecoration: 'underline' }}>
                            <text textAnchor="middle" x="60" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>{this.state.data.no_app_route}</text>
                        </a>
                    </svg>
                    <div><h4>No App Route</h4></div>
                </div>

            </div>
        );
    }
}

export default Sites;
