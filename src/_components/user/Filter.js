import React, { Component } from 'react';
import '../../assets/css/App.css';
import { Container, Row, Col, select } from 'reactstrap';
import metricsData from '../../metricsData.json';
import { indexOf } from 'lodash';
import { LinkCapacity, Sites, ApplicationClassMetrics, Bandwidth, PacketLoss, LatencyRatio, JitterRatio, SiteAvailability, ApplicationDetails } from '../';
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
      cpeValue: "",
      sourceSite: "",
      applicationName: "",
      duration: "HOUR",
      toFilter: "",
      destinationSite: "",
      appFamilies: ""
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
    this.applicationFamily = this.applicationFamily.bind(this);
    this.changeCpe = this.changeCpe.bind(this);
    this.changeSource = this.changeSource.bind(this);
    this.handleDashBoardData = this.handleDashBoardData.bind(this);
    this.allDestinationSite = this.allDestinationSite.bind(this);
    this.changeDestination = this.changeDestination.bind(this);
    this.applicationLink = this.applicationLink.bind(this);
    this.application = this.application.bind(this);
    this.changeAppFamily = this.changeAppFamily.bind(this);
    this.applicationDetailsFilter = this.applicationDetailsFilter.bind(this);
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
    let sourceSite;
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
    let query;
    sourceSite = this.state.sourceSite;
    if (sourceSite == undefined || sourceSite == "" || sourceSite == "All Source") {
      query = 'deviceData[sites].devices';
    } else {
      query = 'deviceData[sites][**][name=' + sourceSite + '].devices';
    }

    data["deviceData"] = jsonQuery(query, {
      data: data
    }).value;
    metrics = [];
    if (data["deviceData"] != null) {
      metrics.push(data["deviceData"]);
    }

    for (let device = 0; device < metrics.length; device++) {
      for (let [metricsDataKey, metricsDataValue] of Object.entries(metrics[device])) {
        for (let [key, value] of Object.entries(metricsDataValue)) {
          cpe.push(<option key={key}>{key}</option>);
        }
      }
    }
    // this.setState({cpeValue: cpe});
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

  allDestinationSite() {

    let siteName = [];
    let sitekey = [];
    let metrics = [];
    let data = {};
    let cpe = this.state.cpeValue;
    let source = this.state.sourceSite;

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
    data = {};
    data["deviceData"] = metrics;
    let query;
    if (source == undefined || source == "" || source == "All Source") {
      query = "deviceData[sites].devices";
    } else {
      query = 'deviceData[sites][**][name=' + source + '].devices'
    }

    data["deviceData"] = jsonQuery(query, {
      data: data
    }).value;
    metrics = [];
    metrics = data["deviceData"]
    let deviceQuery;
    let cpedata = {};
    for (let index = 0; index < metrics.length; index++) {
      for (let [key, value] of Object.entries(metrics[index])) {
        cpedata[key] = value;
      }
    }
    metrics = [];
    metrics.push(cpedata);
    if (cpe == undefined || cpe == "" || cpe == "All CPE") {
      deviceQuery = 'deviceList[**][0][**].applications_details';
    } else {
      deviceQuery = 'deviceList[**][0][' + cpe + '].applications_details';
    }

    data = {};
    data["deviceList"] = metrics;

    data["deviceList"] = jsonQuery(deviceQuery, {
      data: data
    }).value;
    metrics = [];
    metrics = data["deviceList"]
    for (let index = 0; metrics != undefined && index < metrics.length; index++) {
      let sitename;

      data = {};
      data["device"] = metrics[index];
      data["device"] = jsonQuery('device[**].destination', {
        data: data
      }).value;
      let destination = data.device;
      for (let i = 0; destination != undefined && i < destination.length; i++) {

        if (destination[i] != undefined && sitekey.indexOf(destination[i]) == -1) {
          sitekey.push(destination[i]);
          siteName.push(<option key={destination[i]}>{destination[i]}</option>);
        }
      }


    }
    return siteName;
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
      query = "deviceData[sites].name";
    }
    else {
      query = 'deviceData[sites][**][sitesgroup=' + siteGroup + '].name'
    }
    data["deviceData"] = jsonQuery(query, {
      data: data
    }).value;
    metrics = [];
    if (siteGroup != undefined) {
      metrics.push(data["deviceData"]);
    } else {
      metrics = data["deviceData"]
    }
    for (let index = 0; index < metrics.length; index++) {
      if (metrics[index] != undefined && sitekey.indexOf(metrics[index]) == -1) {
        sitekey.push(metrics[index]);
        siteName.push(<option key={metrics[index]}>{metrics[index]}</option>);
      }
    }
    this.setState({ all_site: siteName });
  }

  applicationLink() {

    let linkName = [];
    let metrics = [];
    let link = [];
    let data = {};
    let user = this.props.authentication.user;
    if (user.role == userConstants.ROLE_USER) {
      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    }
    data = {};
    data["deviceData"] = metrics;
    let query;
    let source = this.state.siteName;
    if (source == undefined || source == "" || source == "All Source") {
      query = "deviceData[sites].devices";
    } else {
      query = 'deviceData[sites][**][name=' + source + '].devices'
    }
    data["deviceData"] = jsonQuery(query, {
      data: data
    }).value;
    metrics = [];
    metrics = data["deviceData"]
    let deviceQuery;
    let cpe = this.state.cpe;
    data["deviceList"] = metrics;
    let cpedata = {};
    for (let index = 0; index < metrics.length; index++) {
      for (let [key, value] of Object.entries(metrics[index])) {
        cpedata[key] = value;
      }
    }
    metrics = [];
    metrics.push(cpedata);
    if (cpe == undefined || cpe == "" || cpe == "All CPE") {
      deviceQuery = 'deviceList[**][0][**].applications_details';
    } else {
      deviceQuery = 'deviceList[**][0][' + cpe + '].applications_details';
    }
    data["deviceList"] = jsonQuery(deviceQuery, {
      data: data
    }).value;
    metrics = [];
    metrics = data["deviceList"]

    if (cpe == undefined || cpe == "" || cpe == "All Sites") {
      metrics = data["deviceList"]
    } else {
      metrics.push(data["deviceList"]);
    }

    let destination = this.state.destinationSite;
    for (let index = 0; index < metrics.length; index++) {
      let sitename;
      for (let [linkKey, linkValue] of Object.entries(metrics[index])) {
        if (destination == undefined || destination == "" || destination == "All Sites") {
          if (linkKey != undefined && link.indexOf(linkKey) == -1) {
            link.push(linkKey);
            linkName.push(<option key={linkKey}>{linkKey}</option>);
          }
        } else {
          if (linkValue["destination"] == destination) {
            if (linkKey != undefined && link.indexOf(linkKey) == -1) {
              link.push(linkKey);
              linkName.push(<option key={linkKey}>{linkKey}</option>);
            }
          }
        }
      }
    }
    return linkName;
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

  applicationFamily() {

    let linkName = [];
    let metrics = [];
    let data = {};
    let appFamilies = [];
    let user = this.props.authentication.user;
    if (user.role == userConstants.ROLE_USER) {
      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    }
    data = {};
    data["deviceData"] = metrics;
    let query;
    let source = this.state.siteName;
    if (source == undefined || source == "" || source == "All Source") {
      query = "deviceData[sites].devices";
    } else {
      query = 'deviceData[sites][**][name=' + source + '].devices'
    }
    data["deviceData"] = jsonQuery(query, {
      data: data
    }).value;
    metrics = [];
    metrics = data["deviceData"]
    let cpedata = {};
    for (let index = 0; index < metrics.length; index++) {
      for (let [key, value] of Object.entries(metrics[index])) {
        cpedata[key] = value;
      }
    }
    metrics = [];
    metrics.push(cpedata);
    let deviceQuery;
    let cpe = this.state.cpe;
    if (cpe == undefined || cpe == "" || cpe == "All CPE") {
      deviceQuery = 'deviceList[**][0][**].applications_details';
    } else {
      deviceQuery = 'deviceList[**][0][' + cpe + '].applications_details';
    }

    data = {};
    data["deviceList"] = metrics;
    data["deviceList"] = jsonQuery(deviceQuery, {
      data: data
    }).value;
    metrics = [];
    if (cpe == undefined || cpe == "" || cpe == "All CPE") {
      metrics = data["deviceList"];
    } else {
      metrics.push(data["deviceList"]);
    }
    let link = this.state.linkName;
    deviceQuery = {};
    data = {};
    data["appFamily"] = metrics;
    if (link == undefined || link == "" || link == "All Links") {
      deviceQuery = 'appFamily[0][**].app_family'
    } else {
      deviceQuery = 'appFamily[0][' + link + '].app_family'
    }

    data["appFamily"] = jsonQuery(deviceQuery, {
      data: data
    }).value;
    metrics = [];

    if (link == undefined || link == "" || link == "All Links") {
      metrics = data["appFamily"];
    } else {
      metrics.push(data["appFamily"]);
    }
    for (let index = 0; index < metrics.length; index++) {
      if (metrics[index] != undefined && linkName.indexOf(metrics[index]) == -1) {
        linkName.push(metrics[index]);
        appFamilies.push(<option key={metrics[index]}>{metrics[index]}</option>);
      }
    }
    return appFamilies;
  }
  application() {

    let appFamily = [];
    let metrics = [];
    let data = {};
    let application = [];
    let user = this.props.authentication.user;
    if (user.role == userConstants.ROLE_USER) {
      data["customers"] = metricsData
      data["customers"] = jsonQuery('customers[username=' + user.username + ']', {
        data: data
      }).value;
      metrics.push(data["customers"]);
    }
    data = {};
    data["deviceData"] = metrics;
    let query;
    let source = this.state.siteName;
    if (source == undefined || source == "" || source == "All Source") {
      query = "deviceData[sites].devices";
    } else {
      query = 'deviceData[sites][**][name=' + source + '].devices'
    }
    data["deviceData"] = jsonQuery(query, {
      data: data
    }).value;
    metrics = [];
    metrics = data["deviceData"]
    let cpedata = {};
    for (let index = 0; index < metrics.length; index++) {
      for (let [key, value] of Object.entries(metrics[index])) {
        cpedata[key] = value;
      }
    }
    metrics = [];
    metrics.push(cpedata);
    let deviceQuery;
    let cpe = this.state.cpe;
    if (cpe == undefined || cpe == "" || cpe == "All CPE") {
      deviceQuery = 'deviceList[**][0][**].applications_details';
    } else {
      deviceQuery = 'deviceList[**][0][' + cpe + '].applications_details';
    }

    data = {};
    data["deviceList"] = metrics;
    data["deviceList"] = jsonQuery(deviceQuery, {
      data: data
    }).value;
    metrics = [];
    if (cpe == undefined || cpe == "" || cpe == "All CPE") {
      metrics = data["deviceList"];
    } else {
      metrics.push(data["deviceList"]);
    }
    let link = this.state.linkName;
    deviceQuery = {};
    let deviceData = [];
    for (let index = 0; index < metrics.length; index++) {
      data = {};
      data["appFamily"] = metrics[index];
      if (link == undefined || link == "" || link == "All Links") {
        deviceQuery = 'appFamily[**]'
      } else {
        deviceQuery = 'appFamily[' + link + ']'
      }

      data["appFamily"] = jsonQuery(deviceQuery, {
        data: data
      }).value;
      if (link == undefined || link == "" || link == "All Links") {
        for (let i = 0; i < data["appFamily"].length; i++) {
          deviceData.push(data["appFamily"][i]);
        }
      } else {
        deviceData.push(data["appFamily"]);
      }

    }
    metrics = deviceData;
    let appFamilies = this.state.appFamilies;
    deviceQuery = {};
    data = {};
    data["applicationData"] = metrics;

    let destination = this.state.destinationSite;
    if ((appFamilies == undefined || appFamilies == "" || appFamilies == "All Application Family") && (destination == undefined || destination == "" || destination == "All Sites")) {
      deviceQuery = 'applicationData.application'
    } else if ((appFamilies != undefined && appFamilies != "" && appFamilies != "All Application Family") && (destination != undefined && destination != "" && destination != "All Sites")) {
      deviceQuery = 'applicationData[*app_family=' + appFamilies + '][*destination=' + destination + '].application';
    } else if ((appFamilies != undefined && appFamilies != "" && appFamilies != "All Application Family")) {
      deviceQuery = 'applicationData[*app_family=' + appFamilies + '].application';
    } else if (destination != undefined && destination != "" && destination != "All Sites") {
      deviceQuery = 'applicationData[*destination=' + destination + '].application';
    }
    data["applicationData"] = jsonQuery(deviceQuery, {
      data: data
    }).value;
    metrics = [];
    metrics = data["applicationData"];

    for (let index = 0; index < metrics.length; index++) {
      if (metrics[index] != undefined && appFamily.indexOf(metrics[index]) == -1) {
        appFamily.push(metrics[index]);
        application.push(<option key={metrics[index]}>{metrics[index]}</option>);
      }
    }
    return application;

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

  changeDestination(selectedSite) {
    this.setState({ destinationSite: selectedSite.target.value });
  }
  changeAppFamily(selectedSite) {
    this.setState({ appFamilies: selectedSite.target.value });
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

  applicationDetailsFilter() {
    let filter = {
      "duration": this.state.duration,
      "sourceSite": this.state.sourceSite,
      "cpeValue": this.state.cpeValue,
      "destinationSite": this.state.destinationSite,
      "linkName": this.state.linkName,
      "appFamilies": this.state.appFamilies,
      "application": this.state.applicationName
    }
    this.setState({ toFilter: filter });
  }
  render() {
    let user = this.props.authentication.user;
    if (userConstants.ROLE_USER == user.role && this.props.type != "visualization" && this.props.type != "applicationDetails") {
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
                      <select className="form-control" id="site" onChange={this.changeDestination}>
                        <option>All Sites</option>
                        {this.allDestinationSite()}
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
                  <LinkCapacity filter={this.state.toFilter} type="visualization" />
                  <LatencyRatio filter={this.state.toFilter} type="visualization" />
                </Row>
                <Row>
                  <JitterRatio filter={this.state.toFilter} type="visualization" />
                  <PacketLoss filter={this.state.toFilter} type="visualization" />
                </Row>
                <Row>
                  <ApplicationClassMetrics filter={this.state.toFilter} type="visualization" />
                  <Bandwidth filter={this.state.toFilter} type="visualization" />
                </Row>
              </div>
            </div>
          </div>
        </Col>

      );
    } else if (userConstants.ROLE_USER == user.role && this.props.type == "applicationDetails") {
      return (
        <Row>
          <Col xs="12" sm="12" md="12" lg="12" xl="12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <i className=""></i>
                <h4> Filter</h4>
              </div>
              <div className="panel-body">
                <div className="list-group">
                  <Row>
                    <Col xs="6" sm="6" md="2" lg="1" xl="1">
                      <h5>Duration</h5>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="1" xl="1">
                      <h5>Source Site</h5>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="1" xl="1">
                      <h5>CPE</h5>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="2" xl="2">
                      <h5>Destination Site</h5>
                    </Col>
                    <Col xs="6" sm="6" md="1" lg="1" xl="1">
                      <h5>Links</h5>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="2" xl="2">
                      <h5>Application Family</h5>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="2" xl="2">
                      <h5>Application</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs="6" sm="6" md="2" lg="1" xl="1">
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
                    <Col xs="6" sm="6" md="2" lg="1" xl="1">
                      <div className="form-group">
                        <select className="form-control" id="source" onChange={this.changeSource}>
                          <option>All Source</option>
                          {this.sourceSite()}
                        </select>
                      </div>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="1" xl="1">
                      <div className="form-group">
                        <select className="form-control" id="cpe" onChange={this.changeCpe}>
                          <option>All CPE</option>
                          {this.cpeData()}
                        </select>
                      </div>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="2" xl="2">
                      <div className="form-group">
                        <select className="form-control" id="site" onChange={this.changeDestination}>
                          <option>All Sites</option>
                          {this.allDestinationSite()}
                        </select>
                      </div>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="1" xl="1">
                      <div className="form-group">
                        <select className="form-control" id="link" onChange={this.changeLink}>
                          <option>All Links</option>
                          {this.applicationLink()}
                        </select>
                      </div>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="2" xl="2">
                      <div className="form-group">
                        <select className="form-control" id="application" onChange={this.changeAppFamily}>
                          <option>All Application Family</option>
                          {this.applicationFamily()}
                        </select>

                      </div>
                    </Col>
                    <Col xs="6" sm="6" md="2" lg="2" xl="2">
                      <div className="form-group">
                        <select className="form-control" id="application" onChange={this.changeApplication}>
                          <option>All Applications</option>
                          {this.application()}
                        </select>

                      </div>
                    </Col>
                    <Col lg="2">
                      <button className="btn btn-primary btn-block"
                        onClick={this.applicationDetailsFilter}> Filter </button>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
          <ApplicationDetails filter={this.state.toFilter} type="applicationDetails" />
        </Row>
      )
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

