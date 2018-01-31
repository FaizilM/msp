import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import AmCharts from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';

import { Container, Row, Col } from 'reactstrap';

import { Map } from './Map'
import { BussinessImpactEvent } from './BussinessImpactEvent'

import Sites from '../admin/Sites';
import PacketLoss from '../admin/PacketLoss';
import LinkCapacity from '../admin/LinkCapacity';
import LatencyRatio from '../admin/LatencyRatio';
import JitterRatio from '../admin/JitterRatio';
import SiteAvailability from '../admin/SiteAvailability';
import Filter from './Filter';
import ApplicationClassMetrics from './ApplicationClassMetrics';
import { Tabs, TabList, DragTabList, Tab, DragTab, PanelList, Panel, ExtraButton } from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bootstrap';
import { connect } from 'react-redux';


class Dashboard extends React.Component {

  render() {



    return (
      <div className="app_container">
        <Row className="well">
          <Col xs="12" sm="12" md="12" lg="6" xl="12">
          </Col>
        </Row>
        <Tabs customStyle={customStyle}>
          <TabList>
            <Tab>Dashboard</Tab>
            <Tab>Filter</Tab>
          </TabList>
          <PanelList>
            <Panel>
              <Row>
                <Map />
              </Row>
              <Row>
                <JitterRatio />
                <SiteAvailability />
              </Row>
              <Row>
                <LatencyRatio />
                <PacketLoss />
              </Row>
              <Row>
                <BussinessImpactEvent />
              </Row>
            </Panel>
            <Panel>
              <Row>
                <Col xs="12" sm="12" md="12" lg="12" xl="12">
                  <div className="panel panel-default">
                    <div className="panel-heading">
                      <i className=""></i>
                      <h4> Filter</h4>
                    </div>
                    <div className="panel-body">
                      <div className="list-group">
                        <Filter />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Panel>
          </PanelList>
        </Tabs>
      </div>
    );
  }
}

export { Dashboard };
