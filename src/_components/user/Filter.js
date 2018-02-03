import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Container, Row, Col, select } from 'reactstrap';
import metricsData from '../../metricsData.json';
import { indexOf } from 'lodash';
import { ApplicationDetails, LinkCapacity, LatencyRatio, JitterRatio, PacketLoss, ApplicationClassMetrics, Bandwidth } from '../';

class Filter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      all_site: [],
      all_link: [],
      all_application: [],
      siteGroup: "",
      siteName: "",
      linkName: "",
      applicationName: "",
      duration: "",
      toFilter: ""
    }

    this.siteGroup = this.siteGroup.bind(this);
    this.allSites = this.allSites.bind(this);
    this.linksData = this.linksData.bind(this);
    this.applicationsData = this.applicationsData.bind(this);
    this.changeData = this.changeData.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
    this.changeLink = this.changeLink.bind(this);
    this.changeApplication = this.changeApplication.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
  }

  componentDidMount() {

    if (this.state.all_site.length == 0) {
      this.allSites();
    }

    if (this.state.all_link.length == 0) {
      this.linksData();
    }

    if (this.state.all_application.length == 0) {
      this.applicationsData();
    }

  }

  siteGroup() {

    this.state.siteName = undefined;
    this.state.linkName = undefined;
    this.state.applicationName = undefined;
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

  allSites(selectedSite) {

    this.state.linkName = undefined;
    this.state.applicationName = undefined;

    let siteName = [];
    let sitekey = [];
    let metrics = [];
    let siteGroup;

    if (selectedSite != undefined) {
      this.setState({ siteGroup: selectedSite.target.value });
      siteGroup = selectedSite.target.value;
      metrics.push(metricsData[0]);
    } else {
      metrics.push(metricsData[0]);
    }

    for (let index = 0; index < metrics.length; index++) {

      for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics[index].sites)) {
        let sitename;

        if (siteGroup == undefined || siteGroup == "All Site Group") {
          sitename = metricsDataValue.name;
        }

        else if (metricsDataValue.sitesgroup == siteGroup) {

          sitename = metricsDataValue.name;
        }

        if (sitename != undefined && sitekey.indexOf(sitename) == -1) {
          sitekey.push(sitename);
          siteName.push(<option key={sitename}>{sitename}</option>);
        }
      }
    }
    this.setState({ all_site: siteName });
  }

  linksData(selectedSite) {

    let linkName = [];
    let linkkey = [];
    let metrics = [];
    let siteName;

    if (selectedSite != undefined) {
      siteName = selectedSite.target.value;
      metrics.push(metricsData[0]);
    } else {
      metrics.push(metricsData[0]);
    }

    for (let index = 0; index < metrics.length; index++) {

      for (let [metricsKey, metricsValue] of Object.entries(metrics[index].sites)) {

        if ((siteName == undefined || siteName == "All Sites") || (siteName != undefined && metricsValue.name == siteName)) {
          let links = metricsValue.links

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
      }
    }

    this.setState({ all_link: linkName });
  }

  applicationsData(selectedSite) {

    let applicationName = [];
    let applicationkey = [];
    let metrics = [];
    let siteName;

    if (selectedSite != undefined) {
      siteName = selectedSite.target.value;
      metrics.push(metricsData[0]);
    } else {
      metrics.push(metricsData[0]);
    }

    for (let index = 0; index < metricsData.length; index++) {

      for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {

        if ((siteName == undefined || siteName == "All Sites") || (siteName != undefined && metricsDataValue.name == siteName)) {
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
    }

    this.setState({ all_application: applicationName });
    return applicationName;
  }

  changeData(selectedSite) {
    this.linksData(selectedSite);
    this.applicationsData(selectedSite);
    this.setState({ siteName: selectedSite.target.value });
  }

  changeLink(selectedSite) {
    this.setState({ linkName: selectedSite.target.value });
  }

  changeApplication(selectedSite) {
    this.setState({ applicationName: selectedSite.target.value });
  }

  changeDuration(selectedSite) {
    this.setState({ duration: selectedSite.target.value });
  }

  handlePrint() {
    let filter = {
      "duration": this.state.duration,
      "siteName": this.state.siteName,
      "siteGroup": this.state.siteGroup,
      "linkName": this.state.linkName,
      "applicationName": this.state.applicationName
    }

    this.setState({ toFilter: filter });

  }

  render() {

    return (
      <Col xs="12" sm="12" md="12" lg="12" xl="12">
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className=""></i>
            <h4> Filter</h4>
          </div>
          <div className="panel-body">
            <div className="list-group">
              <Row>
                <Col xs="6" sm="6" md="2" lg="2" xl="2">
                  <div className="form-group">
                    <select className="form-control" id="time" onChange={this.changeDuration}>
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
                    <select className="form-control" id="siteGroup" onChange={this.allSites}>
                      <option>All Site Group</option>
                      {this.siteGroup()}
                    </select>
                  </div>
                </Col>
                <Col xs="6" sm="6" md="2" lg="2" xl="2">
                  <div className="form-group">
                    <select className="form-control" id="site" onChange={this.changeData}>
                      <option>All Sites</option>
                      {this.state.all_site}
                    </select>
                  </div>
                </Col>
                <Col xs="6" sm="6" md="2" lg="2" xl="2">
                  <div className="form-group">
                    <select className="form-control" id="link" onChange={this.changeLink}>
                      <option>All Links</option>
                      {this.state.all_link}
                    </select>
                  </div>
                </Col>
                <Col xs="6" sm="6" md="2" lg="2" xl="2">
                  <div className="form-group">
                    <select className="form-control" id="application" onChange={this.changeApplication}>
                      <option>All Applications</option>
                      {this.state.all_application}
                    </select>
                  </div>
                </Col>
                <Col lg="2">
                  <button className="btn btn-primary btn-block"
                    onClick={this.handlePrint}> Filter </button>
                </Col>
              </Row>
              <Row>
                <ApplicationClassMetrics filter={this.state.toFilter} customer="customer" />
                <Bandwidth filter={this.state.toFilter} customer="customer" />
              </Row>
              <Row>
                <LinkCapacity filter={this.state.toFilter} customer="customer" />
                <LatencyRatio filter={this.state.toFilter} customer="customer" />
              </Row>
              <Row>
                <JitterRatio filter={this.state.toFilter} customer="customer" />
                <PacketLoss filter={this.state.toFilter} customer="customer" />
              </Row>
              <Row>
                <ApplicationDetails />
              </Row>


            </div>
          </div>
        </div>
      </Col>

    );
  }
}

export { Filter };
