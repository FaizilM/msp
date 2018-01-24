import React from 'react';
// import the core library.
import ReactEchartsCore from 'echarts-for-react/lib/core';
// then import echarts modules those you have used manually.
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import ReactBootstrap from 'react-bootstrap';
import '../../assets/css/App.css';

class LinkCapacity extends React.Component {

    render() {

        let option = {

            title: {
                text: 'Bar chart'
            },
            tooltip: {
                trigger: 'axis',
                formatter : function (params) {
                 return '<div><div>Latency Time: '+params[0].name+'</div><div> Latency Percentage: '+(params[0].value*100)+'%</div></div>';
                }
            },
            legend: {
                data: ['<30ms', '<50ms', '>150ms'],
                show: true,
                align: 'left',
                left: 10
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            calculable: true,
            //     type: 'value',
            //     axisLabel: {
            //         formatter: '{value} %'
            //     }
            // }
            xAxis: [
                {
                    name: 'Latency Ratio',
                    show: true,
                    type: 'value',
                    boundaryGap: [0, 0.05],
                    min: 0,
                    max: 1,
                    axisTick: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    name: 'Percentage',
                    show: true,
                    type: 'category',
                    data: ['<30ms', '<50ms', '>150ms'],
                    axisTick: {
                        show: false
                    }
                }
            ],

            series: [
                {
                    name: 'utility',
                    type: 'bar',
                    data: ['0.27', '0.67', '0.06'],
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                // build a color map as your need.
                                var colorList = [
                                    'blue', 'green', 'red'
                                ];
                                return colorList[params.dataIndex]
                            },

                        }
                    },
                }

            ]
        };

        return (

            <div>
                <ReactEchartsCore
                    echarts={echarts}
                    option={option}
                    notMerge={true}
                    lazyUpdate={true}
                    theme={"theme_name"}
                />
            </div>


        );
    }
}


export default LinkCapacity;
