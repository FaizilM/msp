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
        this.handleClick = this.handleClick.bind(this);
    };
    componentDidMount() {

        Events.scrollEvent.register('begin', function () {
            console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function () {
            console.log("end", arguments);
        });

    }

    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }


    handleClick() {
        console.log("Event tiggered");
    }


    render() {
        let availability = siteAvailabilityData();
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ float: 'left' }}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="black" strokeWidth="3" fill={color.GREEN_COLOR} />
                        <Link activeClass="active" className="customerData" to="customerData" spy={true} smooth={true} offset={50} duration={500}>
                            <text x="60" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>{availability[0]}</text>
                        </Link>
                    </svg>
                    <div><h4>App Route Policy</h4></div>
                </div>
                <div style={{ float: 'right' }}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="black" strokeWidth="3" fill={color.YELLOW_COLOR} />
                        <Link activeClass="active" className="customerData" to="customerData" spy={true} smooth={true} duration={500} >
                            <text x="60" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>{availability[1]}</text>
                        </Link>
                    </svg>
                    <div><h4>App Route Change</h4></div>
                </div>
                <div style={{ float: 'right' }}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="black" strokeWidth="3" fill={color.ORANGE_COLOR} />
                        <Link activeClass="active" className="customerData" to="customerData" spy={true} smooth={true} duration={500} >
                            <text x="60" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>{availability[2]}</text>
                        </Link>
                    </svg>
                    <div><h4>No App Route</h4></div>
                </div>

            </div>
        );
    }
}

export default Sites;
