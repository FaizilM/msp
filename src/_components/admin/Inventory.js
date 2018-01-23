import React, { Component } from 'react';
import './App.css';


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
    let tableData = [];
    for (let [k, value] of Object.entries(this.state.data)) {
      tableData.push(<tr key={k}><td>{k}</td><td>{value}</td></tr>);
    }
    return (
      <div>
        <table style={{ border: '1px solid', position: 'relative', height: '50%', width: '70%', marginLeft: '5%', marginTop: '1%' }}>
          <tbody>
            {tableData}
          </tbody>
        </table>
      </div>

    );
  }
}

export default Inventory;