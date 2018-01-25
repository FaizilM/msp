import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';

import { Container, Row, Col } from 'reactstrap';

import { Map } from './Map'

class BussinessImpactEvent extends React.Component {

  render() {
    return (
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

    );
  }
}


export { BussinessImpactEvent };
