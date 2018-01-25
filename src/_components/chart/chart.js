import React, { Component } from 'react';
import AmCharts from "@amcharts/amcharts3-react";


class PacketLoss extends Component {

  render() {
    let config = [];
    return (

        <div >
          <div >
            <AmCharts.React options={this.props.config} style={{ width: "100%", height: "350px"}}/>
          </div>
        </div>

    );
  }
}

export default PacketLoss;
