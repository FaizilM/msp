import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';
import { Container, Row, Col } from 'reactstrap';
import { Map } from './Map'

class BussinessImpactEvent extends React.Component {

  render() {

    return (

      <Col xs="12" sm="12" md="6" lg="6" xl="6">
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className=""></i> <h4> Bussiness Impacting Events</h4>
          </div>
          <div className="panel-body">
            <div className="list-group">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className="buss_impact_eve_table green_color">Number of Application Paths</th>
                      <th className="buss_impact_eve_table yellow_color">Degraded Paths</th>
                      <th className="buss_impact_eve_table red_color">No Viable Paths</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="buss_impact_eve_table green_color">45638</td>
                      <td className="buss_impact_eve_table yellow_color">12545</td>
                      <td className="buss_impact_eve_table red_color">6</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Col>

    );
  }
}

export { BussinessImpactEvent };
