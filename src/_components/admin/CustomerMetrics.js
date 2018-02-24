import React, { Component } from 'react';
import '../../assets/css/App.css';
import metricsData from '../../metricsData.json';
import { indexOf, replace } from 'lodash';
import { Container, Row, Col } from 'reactstrap';
import SortableTbl from 'react-sort-search-table';
import ImageLoader from 'react-imageloader';
import sortJsonArray from 'sort-json-array';


let customerMetricsDashboardData = () => {
  let customerMetricsData = [];

  for (let index = 0; index < metricsData.length; index++) {

    let customerData = {};

    customerData["customer"] = metricsData[index].customer;
    customerData["sites"] = metricsData[index].sites.length;
    customerData["app_route_policy"] = 0;
    customerData["no_app_route"] = 0;
    customerData["app_route_change"] = 0;
    customerData["utilization"] = 0;
    customerData["packet_loss"] = 0;
    customerData["jitter"] = 0;
    customerData["latency"] = 0;
    customerData["availability"] = 0;

    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {


      if (metricsDataValue.app_route_policy) {
        customerData["app_route_policy"] = customerData["app_route_policy"] + 1;
      }

      if (metricsDataValue.app_route_change) {
        customerData["app_route_change"] = customerData["app_route_change"] + 1;
      }

      if (metricsDataValue.no_app_route) {
        customerData["no_app_route"] = customerData["no_app_route"] + 1;
        customerData["availability"] = customerData["availability"] + 1;
      }

      let loss = 0;
      let latency = 0;
      let jitter = 0;
      let utilization = 0;
      let utilizationlength = 0;
      let jitterlength = 0;
      let latencylength = 0;
      let packetlength = 0;
      let commonLength = 0;
      let links = metricsDataValue.links

      for (let link = 0; link < links.length; link++) {

        let linkStatus = links[link];

        for (let [linkKey, linkValue] of Object.entries(linkStatus)) {
          commonLength++;

          if (linkValue.utilization != undefined) {
            utilizationlength++;
            utilization += linkValue.utilization;
          }

          if (linkValue.jitter != undefined) {
            jitterlength++;
            jitter += linkValue.jitter;
          }

          if (linkValue.latency != undefined) {
            latencylength++;
            latency += linkValue.latency;
          }

          if (linkValue.packet_loss != undefined) {
            packetlength++;
            loss += linkValue.packet_loss;
          }
        }
      }

      if (utilization > 0 && utilization / utilizationlength > 75) {
        customerData["utilization"] += 1;
      }

      if (loss > 0 && loss / packetlength > 2.5) {
        customerData["packet_loss"] += 1;
      }

      utilization = 0;
      utilizationlength = 0;

      if (jitter > 0 && jitter / jitterlength > 7) {
        customerData["jitter"] += 1;
      }

      jitterlength = 0;
      jitter = 0;

      if (latency > 0 && latency / latencylength > 150) {
        customerData["latency"] += 1;
      }

      latency = 0;
      latencylength = 0;
      loss = 0;
      packetlength = 0;
    }
    customerMetricsData.push(customerData);

  }

  return customerMetricsData;
};

let col = [

  "customer",
  "sites",
  "app_route_policy",
  "no_app_route",
  "app_route_change",
  "utilization",
  "packet_loss",
  "jitter",
  "latency",
  "availability",

];
let tHead = [

  "Customer",
  "No of Sites",
  "Sites with App Route Policy",
  "Sites with No App Route",
  "Sites with App Route Change",
  "Sites with Utilization above 75%",
  "Sites with Packet Loss above 2.5%",
  "Sites with Jitter above 22ms",
  "Sites with Latency above 150ms",
  "Sites with Availability above 96%",
];

class CustomerMetrics extends Component {

  componentDidMount() {
    let content = document.querySelector("#customer_metrics_table > div > div > div.form-group > div.desc.col-sm-5.col-xs-12 > div").textContent;
    content = replace(content, new RegExp("totlas", "g"), "total");
    document.querySelector("#customer_metrics_table > div > div > div.form-group > div.desc.col-sm-5.col-xs-12 > div").textContent = content;
  }
  render() {

    let customerData = customerMetricsDashboardData();
    customerData = sortJsonArray(customerData, 'customer');
    customerData = sortJsonArray(customerData, 'app_route_change', 'des');
    customerData = sortJsonArray(customerData, 'no_app_route', 'des');
    for (let index = 0; index < customerData.length; index++) {
      if (customerData[index]["no_app_route"] > 0 || customerData[index]["app_route_change"] > 0) {
        let noApp = customerData[index]["no_app_route"];
        let changeApp = customerData[index]["app_route_change"];
        for (let [customerDataKey, customerDataValue] of Object.entries(customerData[index])) {
          if (customerDataKey != "customer" && customerDataKey != "sites" && customerDataKey != "app_route_policy") {
            if (changeApp > 0) {
              customerData[index][customerDataKey] = <span style={{ color: "orange", fontWeight:"bold" }}>{customerDataValue}</span>
            }
            if (noApp > 0 && customerDataKey != "app_route_change") {
                customerData[index][customerDataKey] = <span style={{ color: "red", fontWeight:"bold" }}>{customerDataValue}</span>
            }
            
          }
        }
      }
    }



    return (
      <Col xs="12" sm="12" md="12" lg="12" xl="12">
        <div className="panel panel-default">
          <div className="panel-heading">
            <i className=""></i>
            <h3>Customer Metrics</h3>
          </div>
          <div className="panel-body">
            <div className="list-group" id="customer_metrics_table">
              <SortableTbl tblData={customerData}
                tHead={tHead}
                dKey={col}
              />
            </div>
          </div>
        </div>
      </Col>

    );
  }
};

export { CustomerMetrics };
