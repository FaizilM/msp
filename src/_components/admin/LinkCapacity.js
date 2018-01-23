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

    render() {

        let option = config.bar;
        return (

            <div style={{ width: '70%', height: '100%', overflow:'auto'}}>
        
                 <AmCharts.React options={option} style={{ width: "50%", height: "350px" }}/>
            </div>


        );
    }
}


export default LinkCapacity;
