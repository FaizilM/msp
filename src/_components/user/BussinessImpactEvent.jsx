import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import  AmCharts  from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';

import { Container, Row, Col } from 'reactstrap';

import  { Map }   from './Map'

class BussinessImpactEvent extends React.Component {

    render() {
        return (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Number of Application Paths</th>
                <th>Degraded Paths</th>
                <th>No Viable Paths</th>

              </tr>
            </thead>
            <tbody>
              <tr>
                <td>75412</td>
                <td>5487</td>
                <td>54</td>

              </tr>
            </tbody>
          </table>
          </div>

        );
    }
}


export { BussinessImpactEvent };
