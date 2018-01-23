import React, { Component } from 'react';
import AmCharts from "@amcharts/amcharts3-react";




class PacketLoss extends Component {

  render() {
    let config = [];
    return (

        <div name="testing1" className="element1" style={{width:'100%', height:'40%'}} >
          <div style={{ width: "50%", height: "100%", display: "inline-block" }}>
            <AmCharts.React options={config} style={{ width: "50%", height: "350px" }} />
          </div>
        </div>

    );
  }
}

export default PacketLoss;
