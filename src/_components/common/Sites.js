import React, { Component } from 'react';
import '../../assets/css/App.css';
import metricsData from '../../metricsData.json';
import { Link, Events } from 'react-scroll';
import { color } from '../../_constants';
import { userConstants } from '../../_constants';
import { connect } from 'react-redux';
import jsonQuery from 'json-query';
import { Container, Row, Col, select } from 'reactstrap';
import { tabActions } from '../../_actions';

let siteAvailabilityData = (user) => {
    let totalSite = 0;
    let availability = [0, 0, 0];
    let metrics = [];

    if (userConstants.ROLE_ADMIN == user.role) {
        metrics = metricsData;
    } else if (user.role == userConstants.ROLE_USER) {
        let data = {};
        data["customers"] = metricsData
        data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
            data: data
        }).value;
        metrics.push(data["customers"]);
    }

    for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics)) {
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
        this.gotoCustomerMetrics = this.gotoCustomerMetrics.bind(this);
    };

    gotoCustomerMetrics() {
        this.props.clickevent(2);
    }

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

    render() {
        let user = this.props.authentication.user;
        let availability = siteAvailabilityData(user);
        let viewSites = [];
        let site_admin ="userSite"
        let  app_route = []
        let  change_route = []
        let  no_route = []



            if (userConstants.ROLE_ADMIN == user.role) {
                viewSites.push( <button onClick={this.gotoCustomerMetrics} className="btn btn-primary btn-block" style={{ width: "50%", marginLeft: "25%", marginBottom: "5%" }}>
                    <a style={{ color: "white" }}><label>View All Sites</label></a>
                </button>);


                app_route.push(
                  <Link activeClass="active" to="customerData" spy={true} smooth={true} offset={50} duration={500}  onClick={this.gotoCustomerMetrics} id="app_route" >
                      <text textAnchor="middle" x="60" y="60" fill="#191970" style={{ textDecoration: 'underline', justifyContent: 'center' }}>{availability[0]}</text>
                  </Link>
                )

                app_route.push(
                    <Link activeClass="active" to="customerData" spy={true} smooth={true} offset={50} duration={500}  onClick={this.gotoCustomerMetrics} id="app_route_change" >
                        <text textAnchor="middle" x="60" y="60" fill="#191970" style={{ textDecoration: 'underline', justifyContent: 'center' }}>{availability[1]}</text>
                    </Link>
                )

                app_route.push(
                  <Link activeClass="active" to="customerData" spy={true} smooth={true} offset={50} duration={500}  id="no_route" onClick={this.gotoCustomerMetrics}  >
                      <text textAnchor="middle" x="60" y="60" fill="#191970" style={{ textDecoration: 'underline', justifyContent: 'center' }}>{availability[2]}</text>
                  </Link>
                )

                site_admin ="adminSite"
            } else {

                app_route.push(
                  <Link activeClass="active" to="customerData" spy={true} smooth={true} offset={50} duration={500} id="app_route"  >
                      <text textAnchor="middle" x="60" y="60" fill="#191970" style={{ justifyContent: 'center' }}>{availability[0]}</text>
                  </Link>
              )

              app_route.push(
                <Link activeClass="active" to="customerData" spy={true} smooth={true} offset={50} duration={500}  id="app_route_change"  >
                    <text textAnchor="middle" x="60" y="60" fill="#191970" style={{ justifyContent: 'center' }}>{availability[1]}</text>
                </Link>
              )

              app_route.push(
                <Link activeClass="active" to="customerData" spy={true} smooth={true} offset={50} duration={500}  id="no_route" >
                    <text textAnchor="middle" x="60" y="60" fill="#191970" style={{ justifyContent: 'center' }}>{availability[2]}</text>
                </Link>
              )
            }


        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <i className=""></i>
                    <h3>Sites</h3>
                </div>
                <div className="panel-body">
                    <div className="list-group">
                        <div  className= {site_admin} >
                            <div style={{ float: 'left' }}>
                                <svg height="120" width="120">
                                    <circle cx="60" cy="60" r="50" stroke={color.GREEN_COLOR} strokeWidth="5" fill="white" />
                                    {app_route[0]}
                                </svg>
                                <div><h4>App Route Policy</h4></div>
                            </div>
                            <div style={{ float: 'right' }}>
                                <svg height="120" width="120">
                                    <circle cx="60" cy="60" r="50" stroke="#FFFF00" strokeWidth="5" fill="white" />
                                    {app_route[1]}

                                </svg>
                                <div><h4>App Route Change</h4></div>
                            </div>
                            <div style={{ float: 'right' }}>
                                <svg height="120" width="120">
                                    <circle cx="60" cy="60" r="50" stroke="#ff0011" strokeWidth="5" fill="white" />
                                    {app_route[2]}

                                </svg>
                                <div><h4>No App Route</h4></div>
                            </div>

                        </div>
                    </div>

                    {viewSites}

                </div>
            </div>

        );
    }
}

function mapStateToProps(state) {
    const { authentication, tabChange } = state;

    return {
        authentication
    };
}

const connectedSites = connect(mapStateToProps)(Sites);
export { connectedSites as Sites };
