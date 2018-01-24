import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import  AmCharts  from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';

import { Container, Row, Col } from 'reactstrap';

import  { Map }   from './Map'
import  { BussinessImpactEvent }   from './BussinessImpactEvent'

class Dashboard extends React.Component {

    render() {
        return (

 <Container>
    <Row className="well">
       <Map />
    </Row>
    <Row className="well">
       <Col xs="6" md="6">
        <BussinessImpactEvent />
       </Col>
       <Col xs="6" md="6">
       </Col>
    </Row>
 </Container>

        );
    }
}


export { Dashboard };
