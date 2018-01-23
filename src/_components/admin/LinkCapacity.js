import React from 'react';
// import the core library.
import ReactEchartsCore from 'echarts-for-react/lib/core';
// then import echarts modules those you have used manually.
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ReactBootstrap from 'react-bootstrap';
import config from '../chart/index';
import Chart from '../chart/chart';
import metricsDatas from '../../metricsData.json';
class LinkCapacity extends React.Component {


    constructor(props) {
        super(props);
    
    
        
        this.state = {
            test : props
      // color: props.initialColor
          // color: props.initialColor
        };
    
    
        console.log("Link capacity state", this.state)
        
      }

    render() {

        let configValue = config.bar;
        
        
        return (

            <div>

                <Chart config={configValue} />
            </div>


        );
    }
}


export default LinkCapacity;
