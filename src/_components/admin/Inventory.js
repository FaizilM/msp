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

      <div className="table-responsive">
 <table className="table">

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
