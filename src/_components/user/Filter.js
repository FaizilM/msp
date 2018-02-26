import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Container, Row, Col, select } from 'reactstrap';
import metricsData from '../../metricsData.json';
import { indexOf } from 'lodash';
import { LinkCapacity, Sites, ApplicationClassMetrics, Bandwidth, PacketLoss, LatencyRatio, JitterRatio, SiteAvailability } from '../';
import jsonQuery from 'json-query';
import { connect } from 'react-redux';
import { userConstants } from '../../_constants';

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
      cpeValue:"",
      sourceSite:"",
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
    this.sourceSite = this.sourceSite.bind(this);
    this.cpeData = this.cpeData.bind(this);
    this.familyApplication = this.familyApplication.bind(this);
    this.changeCpe = this.changeCpe.bind(this);
    this.changeSource = this.changeSource.bind(this);
    this.handleDashBoardData =this.handleDashBoardData.bind(this);
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

  sourceSite() {
    let user = this.props.authentication.user;
    let data = {};
    let metrics = [];
    let source = [];
    if (user.role == userConstants.ROLE_USER) {
      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    }
    for (let index = 0; index < metrics.length; index++) {
      for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {
        source.push(<option key={metricsDataValue.name}>{metricsDataValue.name}</option>);
      }
    }
    return source;
  }
  cpeData() {

    let cpe = [];
    let user = this.props.authentication.user;
    let data = {};
    let metrics = [];
    if (user.role == userConstants.ROLE_USER) {

      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    }

    data = {};
    data["deviceData"] = metrics;

    data["deviceData"] = jsonQuery('deviceData[sites].devices', {
      data: data
    }).value;
    metrics = [];
    metrics.push(data["deviceData"]);

    for (let device = 0; device < metrics.length; device++) {
      for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics[device])) {
        for (let [key, value] of Object.entries(metricsDataValue)) {
          cpe.push(<option key={key}>{key}</option>);
        }
      }
    }
    return cpe;
  }

  siteGroup() {

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

    let siteName = [];
    let sitekey = [];
    let metrics = [];
    let siteGroup;
    let data = {};

    let user = this.props.authentication.user;
    if (user.role == userConstants.ROLE_USER) {
      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    } else {
      metrics.push(metricsData);
    }

    if (selectedSite != undefined) {
      this.setState({ siteGroup: selectedSite.target.value });
      siteGroup = selectedSite.target.value;
    }
    data = {};
    data["deviceData"] = metrics;
let query;
if (siteGroup == "" || siteGroup == undefined || siteGroup == "All Site Group") {
  query = "deviceData[sites]";
}
else if (metricsDataValue.sitesgroup == siteGroup) {
  query = 'deviceData[sites][**][sitesgroup='+siteGroup+']'
}
    data["deviceData"] = jsonQuery(query, {
      data: data
    }).value;
    metrics =[];
    metrics = data["deviceData"]
    data["deviceList"] = metrics
    data["deviceList"] = jsonQuery('deviceList.devices[0][**].applications', {
      data: data
    }).value;
    metrics = data["deviceList"]
    console.log(metrics);
    for (let index = 0; index < metrics.length; index++) {
        let sitename;
        data = {};
        data["sitegroup"] = metrics[index];
        data["device"] = jsonQuery('device[**][0].destination', {
          data: data
        }).value;
        
        data = {};
        data["device"] = metrics[index];
        data["device"] = jsonQuery('device[**][0].destination', {
          data: data
        }).value;
        
       

        if (sitename != undefined && sitekey.indexOf(sitename) == -1) {
          sitekey.push(sitename);
          siteName.push(<option key={sitename}>{sitename}</option>);
      }
    }
    this.setState({ all_site: siteName });
  }

  linksData(selectedSite) {

    let linkName = [];
    let linkkey = [];
    let metrics = [];
    let siteName;
    let data = {};


    let user = this.props.authentication.user;
    if (user.role == userConstants.ROLE_USER) {
      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    }

    if (selectedSite != undefined) {
      siteName = selectedSite.target.value;
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
  familyApplication() {

  }
  applicationsData(selectedSite) {

    let applicationName = [];
    let applicationkey = [];
    let metrics = [];
    let siteName;
    let data = {};

    let user = this.props.authentication.user;
    if (user.role == userConstants.ROLE_USER) {
      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    }

    if (selectedSite != undefined) {
      siteName = selectedSite.target.value;
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
  }

  changeData(selectedSite) {
    this.setState({ siteName: selectedSite.target.value });
    this.linksData(selectedSite);
    this.applicationsData(selectedSite);
  }
 changeCpe(selectedSite) {
  this.setState({ cpeValue: selectedSite.target.value });
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

  changeSource(selectedSite) {
    this.setState({ sourceSite: selectedSite.target.value });
  }

  handlePrint() {
    let filter = {
      "duration": this.state.duration,
      "siteGroup": this.state.siteGroup,
      "siteName": this.state.siteName,
      "linkName": this.state.linkName,
      "applicationName": this.state.applicationName,
      "cpeValue": this.state.cpeValue
    }
    this.setState({ toFilter: filter });

  }
  handleDashBoardData() {
    let filter = {
      "duration": this.state.duration,
      "sourceSite": this.state.sourceSite,
      "cpeValue": this.state.cpeValue,
      "siteName": this.state.siteName,
      "linkName": this.state.linkName
     
    }
    this.setState({ toFilter: filter });

  }

  render() {
    let user = this.props.authentication.user;

    if (userConstants.ROLE_USER == user.role && this.props.type != "visualization") {
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
                        <option value={"HOUR"}>Hour</option>
                        <option value={"DAY"}>Day</option>
                        <option value={"WEEK"}>Week</option>
                        <option value={"MONTH"}>Month</option>
                        <option value={"YEAR"}>Year</option>
                      </select>
                    </div>
                  </Col>
                  <Col xs="6" sm="6" md="2" lg="2" xl="2">
                    <div className="form-group">
                      <select className="form-control" id="source" onChange={this.changeSource}>
                        <option>All Source</option>
                        {this.sourceSite()}
                      </select>
                    </div>
                  </Col>
                  <Col xs="6" sm="6" md="2" lg="2" xl="2">
                    <div className="form-group">
                      <select className="form-control" id="cpe" onChange={this.changeCpe}>
                        <option>All CPE</option>
                        {this.cpeData()}
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
                  <Col lg="2">
                    <button className="btn btn-primary btn-block"
                      onClick={this.handleDashBoardData}> Filter </button>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12" xl="12">
                    <Sites />
                  </Col>
                </Row>
                <Row>
                  <JitterRatio filter={this.state.toFilter} type="dashboard" />
                  <SiteAvailability filter={this.state.toFilter} type="dashboard" />
                </Row>
                <Row>
                  <LatencyRatio filter={this.state.toFilter} type="dashboard" />
                  <PacketLoss filter={this.state.toFilter} type="dashboard" />
                </Row>
              </div>
            </div>
          </div>
        </Col>

      );

    } else if (userConstants.ROLE_USER == user.role && this.props.type == "visualization") {
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
                        <option value={"HOUR"}>Hour</option>
                        <option value={"DAY"}>Day</option>
                        <option value={"WEEK"}>Week</option>
                        <option value={"MONTH"}>Month</option>
                        <option value={"YEAR"}>Year</option>
                      </select>
                    </div>
                  </Col>
                  <Col xs="6" sm="6" md="2" lg="2" xl="2">
                    <div className="form-group">
                      <select className="form-control" id="source" onChange={this.allSites}>
                        <option>All Source</option>
                        {this.sourceSite()}
                      </select>
                    </div>
                  </Col>
                  <Col xs="6" sm="6" md="2" lg="2" xl="2">
                    <div className="form-group">
                      <select className="form-control" id="cpe" onChange={this.allSites}>
                        <option>All CPE</option>
                        {this.cpeData()}
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
                      <select className="form-control" id="link" onChange={this.changeLink}>
                        <option>Application Family</option>
                        {this.familyApplication()}
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
                  <LinkCapacity filter={this.state.toFilter} />
                  <LatencyRatio filter={this.state.toFilter} />
                </Row>
                <Row>
                  <JitterRatio filter={this.state.toFilter} />
                  <PacketLoss filter={this.state.toFilter} />
                </Row>
                <Row>
                  <ApplicationClassMetrics filter={this.state.toFilter} />
                  <Bandwidth filter={this.state.toFilter} />
                </Row>
              </div>
            </div>
          </div>
        </Col>

      );
    }
  }
}

function mapStateToProps(state) {
  const { authentication } = state;

  return {
    authentication
  };
}

const connectedFilter = connect(mapStateToProps)(Filter);
export { connectedFilter as Filter };

