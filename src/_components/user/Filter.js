import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Container, Row, Col, select } from 'reactstrap';
import metricsData from '../../metricsData.json';
import { indexOf } from 'lodash';

class Filter extends Component {


  render() {


let sitesName = (selectedSite) => {
  let siteName = [];
  let sitekey = [];
  for (let index = 0; index < metricsData.length; index++) {
    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {

      let sitename = metricsDataValue.name;
      if (sitekey.indexOf(sitename) == -1) {
        sitekey.push(sitename);
        siteName.push(<option key={sitename}>{sitename}</option>);
      }
    }
  }
  return siteName;
}
    let siteGroup = () => {
      let sitesgroup = [];
      let sitegroupkey = [];
      for (let index = 0; index < metricsData.length; index++) {
        for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {
          let site = metricsDataValue.sitesgroup;
          if (sitegroupkey.indexOf(site) == -1) {
            sitegroupkey.push(site);
            sitesgroup.push(<option key={site}>{site}</option>);
          }
        }
      }
      return sitesgroup;
    }


    let linksData = () => {

      let linkName = [];
      let linkkey = [];

      for (let index = 0; index < metricsData.length; index++) {
        for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {

          let links = metricsDataValue.links
          for (let link = 0; link < links.length; link++) {
            let linkData = links[link];
            for (let [linkKey, linkValue] of Object.entries(linkData)) {
              if (linkkey.indexOf(linkKey) == -1) {
                linkkey.push(linkKey);
                linkName.push(<option key={linkKey}>{linkKey}</option>);
              }
            }
          }
        }
        return linkName;
      }
    }
    let applicationsData = () => {

      let applicationName = [];
      let applicationkey = [];
      for (let index = 0; index < metricsData.length; index++) {
        for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {

          let application = metricsDataValue.application
          for (let index = 0; index < application.length; application++) {
            let applicationData = application[index];
            for (let [appKey, appValue] of Object.entries(applicationData)) {
              if (applicationkey.indexOf(appKey) == -1) {
                applicationkey.push(appKey);
                applicationName.push(<option key={appKey}>{appKey}</option>);
              }
            }
          }
        }
      }
      return applicationName;
    }

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
            <select className="form-control" id="siteGroup" onChange ={() =>this.sitesName(this.itemSelected)}>
              <option>All Site Group</option>
              {siteGroup()}
            </select>
          </div>
        </Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
          <div className="form-group">
            <select className="form-control" id="site">
              <option>All Sites</option>
              {sitesName()}
            </select>
          </div>
        </Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
          <div className="form-group">
            <select className="form-control" id="link">
              <option>All Links</option>
              {linksData()}
            </select>
          </div>
        </Col>
        <Col xs="6" sm="6" md="2" lg="2" xl="2">
          <div className="form-group">
            <select className="form-control" id="application">
              <option>All Applications</option>
              {applicationsData()}
            </select>
          </div>
        </Col>
        <Col lg="1"></Col>
      </Row>

    );
  }
}

export default Filter;


//India,Paris,Havana,Loss Angeles,Toronto
