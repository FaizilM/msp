import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import  AmCharts  from '@amcharts/amcharts3-react';
import 'ammap3/ammap/ammap.js';

import  { Map }   from './Map'

class Dashboard extends React.Component {

    render() {
        return (
          <div className="container-fluid">
              <div className="row well">
                <Map />
                </div>
          </div>
        );
    }
}


export { Dashboard };
