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
    <Row>
     <Col xs="12" md="12">
    <div class="panel panel-default">
    <div class="panel-heading">
       <i class="fa fa-bell fa-fw"></i> <h3>Dashboard</h3>
    </div>
    <div class="panel-body">
       <div class="list-group">
        <Map />

       </div>
    </div>
    </div>
    </Col>
    </Row>
    <Row>

       <Col xs="6" md="6">

<div class="panel panel-default">
<div class="panel-heading">
   <i class="fa fa-bell fa-fw"></i> <h4> Bussiness Impacting Events</h4>
</div>
<div class="panel-body">
   <div class="list-group">
      <BussinessImpactEvent />
   </div>
</div>
</div>
<Col xs="6" md="6">

</Col>

       </Col>
    </Row>
 </Container>

        );
    }
}


export { Dashboard };
