import React, { Component } from 'react';
import '../../assets/css/App.css';
import metricsData from '../../metricsData.json';


let inventoryData = () => {
  let inventory = {};
  inventory["total_customers"] = metricsData.length;
  let managedsites = 0;
  let managedCPE = 0;
  let links = 0;
  let applicationPath = 0;
  let availability = [0, 0, 0];
  for (let [metricsDataKey, metricsDataValue] of Object.entries(metricsData)) {
    managedsites = metricsDataValue.sites.length;
    let sites = metricsDataValue.sites;
    for (let site = 0; site < sites.length; site++) {
      
      links += sites[site].links.length;
      managedCPE += sites[site].managed_CPE;
    }
   }
  inventory["managed_sites"] = managedsites;
  inventory["links"] = links;
  inventory["managed_CPE"] = managedCPE;

  return inventory;
};
class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state =
      {
        data: {
          'Total Customers': 15,
          'Managed Sites': 12567,
          'Managed CPE': 17911,
          'Links': 27345,
          'Application Paths': 123456
        }

      }

  }

  render() {
    let inventory = inventoryData();
    let index = 0;
    let tableData = [];
    let displayData = ['Total Customers', 'Managed Sites', 'Managed CPE', 'Links', 'Application Paths'];
    for (let [k, value] of Object.entries(this.state.data)) {
      tableData.push(<tr key={k}><td>{displayData[index++]}</td><td>{value}</td></tr>);
    }
    return (

      <div>

        <div className="table-responsive">
          <table className="inventory table">

            <tbody>
              {tableData}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Inventory;
