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
        customerData["availability"] = customerData["availability"]  + 1;

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
      if (latency > 0 && latency / latencylength > 50) {
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


class CustomerMetricsDashboard extends Component {

    sorting (column) {
      var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("dataTables-example");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 1].getElementsByTagName("TD")[column];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
    };

  render() {
    let customerData = customerMetricsDashboardData();
    let index = 0;
    let customerMetricsData = [];
    let tableData;
    for (let index = 0; index < customerData.length; index++) {
      tableData = [];
      for (let [key, value] of Object.entries(customerData[index])) {
        if (value == 0) {
          value = "-";
        }
        tableData.push(<td key={key}>{value}</td>);
      }
      customerMetricsData.push(<tr key={index}>{tableData}</tr>);
    }



    return (

      <table width="100%" className="table table-striped table-bordered table-hover" id="dataTables-example">

<thead>
<tr>

            <th onClick={ () => this.sorting(0)}>Customer</th>
            <th onClick={ () => this.sorting(1)}>No of Sites</th>
            <th onClick={ () => this.sorting(2)}>Sites with App Route Policy</th>
            <th onClick={ () => this.sorting(3)}>Sites with No App Route</th>
            <th onClick={ () => this.sorting(4)}>Sites with App Route Change</th>
            <th onClick={ () => this.sorting(5)}>Sites with Utilization above 75%</th>
            <th onClick={ () => this.sorting(6)}>Sites with Packet Loss above 2.5%</th>
            <th onClick={ () => this.sorting(7)}>Sites with Jitter above 22ms</th>
            <th onClick={ () => this.sorting(8)}>Sites with Latency above 250ms</th>
            <th onClick={ () => this.sorting(9)}>Sites with Availability above 96%</th>
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
