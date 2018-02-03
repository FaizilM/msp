import jsonQuery from 'json-query';
import { Chart } from '../';
import metricsData from '../../metricsData.json';
import { color } from '../../_constants';
import { Container, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';
import { userConstants } from '../../_constants';

let getMPLSLinkUtilization = (user) => {
    let percent = [0, 0, 0, 0];
    let data = {};

    if (user.role == userConstants.ROLE_ADMIN) {
        data["customers"] = metricsData
    } else {
        data["customers"] = metricsData
        data["customers"] = jsonQuery('customers[username =' + user.username + ']', {
            data: data
        }).value
    }
    let linkDetails = jsonQuery('customers.sites.links.mpls.utilization', {
        data: data
    }).value
    if (linkDetails != undefined) {
        for (let index = 0; index < linkDetails.length; index++) {
            if (linkDetails[index] < 25) {
                percent[0] += 1;
            } else if (linkDetails[index] < 50) {
                percent[1] += 1;
            } else if (linkDetails[index] < 75) {
                percent[2] += 1;
            } else {
                percent[3] += 1;
            }
        }
        return { "total_links": linkDetails.length, "percentage": percent }
    }
}

class MPLSLinkUtilization extends React.Component {

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
                    "balloonText": "Links: <b>[[value]]</b>",
                    "fillColorsField": "color",
                    "fillAlphas": 1,
                    "precision": 0,
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

        let user = this.props.authentication.user;
        let mplsLinkUtilization = getMPLSLinkUtilization(user);

        if (user.role == userConstants.ROLE_ADMIN) {
            configValue.dataProvider.push(
                { "name": "Quartile 25%", "percentage": mplsLinkUtilization.percentage[0], "color": color.GREEN_COLOR },
                { "name": "Quartile 25-50%", "percentage": mplsLinkUtilization.percentage[1], "color": color.YELLOW_COLOR },
                { "name": "Quartile 50-75%", "percentage": mplsLinkUtilization.percentage[2], "color": color.ORANGE_COLOR },
                { "name": "Quartile >75%", "percentage": mplsLinkUtilization.percentage[3], "color": color.BLUE_COLOR }
            );
            configValue.legend.data.push(
                { "title": "Quartile 25%", "color": color.GREEN_COLOR },
                { "title": "Quartile 25-50%", "color": color.YELLOW_COLOR },
                { "title": "Quartile 50-75%", "color": color.ORANGE_COLOR },
                { "title": "Quartile >75%", "color": color.BLUE_COLOR }
            );
            configValue.valueAxes.maximum = mplsLinkUtilization.total_links;
            configValue.valueAxes.gridCount = mplsLinkUtilization.total_links;
        }


        return (
            <Col xs="12" sm="12" md="6" lg="6" xl="6">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <i className=""></i>
                        <h3> MPLS Link Utilization-Quartile </h3>
                    </div>
                    <div className="panel-body">
                        <div className="list-group">
                            <div className="table-responsive">
                                <Chart config={configValue} />
                            </div>
                        </div>
                    </div>
                </div>
            </Col >

        );

    }
}

function mapStateToProps(state) {
    const { authentication } = state;

    return {
        authentication
    };
}


const connectedMPLSLinkUtilization = connect(mapStateToProps)(MPLSLinkUtilization);
export { connectedMPLSLinkUtilization as MPLSLinkUtilization };