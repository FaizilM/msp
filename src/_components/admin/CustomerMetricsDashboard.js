import React, { Component } from 'react';
import '../../assets/css/App.css';
import metricsData from '../../metricsData.json';
import { indexOf } from 'lodash';

let customerMetricsDashboardData = () => {
  let customerMetricsData = [];

  for (let index = 0; index < metricsData.length; index++) {
    let customerData = {};

    customerData["customer"] = metricsData[index].customer;
    customerData["sites"] = metricsData[index].sites.length;
    customerData["app_route_policy"] = 0;
    customerData["app_route_change"] = 0;
    customerData["no_app_route"] = 0;
    customerData["utilization"] = 0;
    customerData["jitter"] = 0;
    customerData["latency"] = 0;
    customerData["packet_loss"] = 0;
    customerData["availability"] = 0;
    for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData[index].sites)) {
      customerData["app_route_policy"] = metricsDataValue.app_route_policy ? customerData["app_route_policy"] += 1 : 0;
      customerData["app_route_change"] = metricsDataValue.app_route_change ? customerData["app_route_change"] += 1 : 0;
      customerData["no_app_route"] = metricsDataValue.no_app_route ? customerData["no_app_route"] += 1 : 0;
      customerData["availability"] = metricsDataValue.no_app_route ? customerData["availability"] += 1 : 0;;
      let loss = 0;
      let latency = 0;
      let jitter = 0;
      let utilization = 0;
      let links = metricsDataValue.links
      for (let link = 0; link < links.length; link++) {
        let linkStatus = links[link];
        for (let [linkKey, linkValue] of Object.entries(linkStatus)) {
          if (linkValue.utilization < 75) {
            utilization++;
          }
          if (linkValue.jitter > 22) {
            jitter++;
          }
          if (linkValue.latency > 250) {
            latency++;
          }
          if (linkValue.packet_loss > 2.5) {
            latency++;
          }
        }
      }
      if (utilization >= 1) {
        customerData["utilization"] += 1;
      }
      if (jitter >= 1) {
        customerData["jitter"] += 1;
      }
      if (latency >= 1) {
        customerData["latency"] += 1;
      }
      if (loss >= 1) {
        customerData["packet_loss"] += 1;
      }
    }
    customerMetricsData.push(customerData);
  }

  return customerMetricsData;
};
class CustomerMetricsDashboard extends Component {

  render() {
    let customerData = customerMetricsDashboardData();
    let index = 0;
    let customerMetricsData = [];
    let tableData;
    for (let index = 0; index < customerData.length; index++) {
      tableData = [];
      for (let [k, value] of Object.entries(customerData[index])) {
        if (value == 0) {
          value = "-";
        }
        tableData.push(<td>{value}</td>);
      }
      customerMetricsData.push(<tr key={index}>{tableData}</tr>);
    }

    return (
                    <table width="100%" class="table table-striped table-bordered table-hover" id="dataTables-example">
                      <thead>
                          <tr>
                          <th>Customer</th>
                          <th>No of Sites</th>
                          <th>Sites with App Route Policy</th>
                          <th>Sites with No App Route</th>
                          <th>Sites with App Route Change</th>
                          <th>Sites with Utilization below 75%</th>
                          <th>Sites with Packet Loss above 2.5%</th>
                          <th>Sites with Jitter above 22ms</th>
                          <th>Sites with Latency above 250ms</th>
                          <th>Sites with Availability above 96%</th>
                          </tr>
                      </thead>
                      <tbody>
                          {customerMetricsData}

                      </tbody>
                  </table>














    );
  }
};

export default CustomerMetricsDashboard;
