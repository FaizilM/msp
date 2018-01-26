import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Container, Row, Col, select } from 'reactstrap';

class Filter extends Component {


  render() {

    return (

      <Row>
        <Col lg="1"></Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
          <div className="form-group">
            <select className="form-control" id="time">
              <option>1Hour</option>
              <option>1Day</option>
              <option>1Week</option>
              <option>1Month</option>
              <option>1Year</option>
            </select>
          </div>
        </Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
        <div className="form-group">
            <select cclassNamelass="form-control" id="siteGroup">
            <option>All Site Groups</option>
            <option>ATM</option>
            <option>Domestic Sites</option>
            <option>International Sites</option>
            <option>Regional HQ</option>
          </select>
          </div>
        </Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
        <div className="form-group">
            <select className="form-control" id="site">
            <option>All Sites</option>
            <option>Boston</option>
            <option>Chicago</option>
            <option>Denver</option>
            <option>Everglade</option>
            <option>Frankfurt</option>
          </select>
          </div>
        </Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
        <div className="form-group">
            <select className="form-control" id="link">
            <option>All Links</option>
            <option>MPLS</option>
            <option>Broadband</option>
            <option>4G/LTE</option>
          </select>
          </div>
        </Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
        <div className="form-group">
            <select className="form-control" id="application">
            <option>All Applications</option>
            <option>Voice</option>
            <option>Video</option>
            <option>Class 3</option>
            <option>Class 4</option>
            <option>Class 5</option>
            <option>Class 6</option>
            <option>Class 7</option>
            <option>Class 8</option>
          </select>
          </div>
        </Col>
        <Col lg="1"></Col>
      </Row>

    );
  }
}

export default Filter;
