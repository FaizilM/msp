import React, { Component } from 'react';
import '../../assets/css/App.css';

import { Link, Events } from 'react-scroll';

class Sites extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    };
    componentDidMount() {

        Events.scrollEvent.register('begin', function () {
          console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function () {
          console.log("end", arguments);
        });

      }

      componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
      }


    handleClick() {
        console.log("Event tiggered");
    }


    render() {

        return (
            <div style={{ display: 'flex', justifyContent:'space-around'}}>
                <div style={{ float: 'left'}}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="black" strokeWidth="3" fill="#32CD32" />
                        <Link activeClass="active" className="testing1" to="testing1" spy={true} smooth={true} duration={500} >
                            <text x="45" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>12485</text>
                        </Link>
                    </svg>
                </div>
                <div style={{ float: 'right' }}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="black" strokeWidth="3" fill="#FFD700" />
                        <Link activeClass="active" className="testing1" to="testing1" spy={true} smooth={true} duration={500} >
                            <text x="50" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>56</text>
                        </Link>
                    </svg>
                </div>
                <div style={{ float: 'right'}}>
                    <svg height="120" width="120">
                        <circle cx="60" cy="60" r="50" stroke="black" strokeWidth="3" fill="#FF4500" />
                        <Link activeClass="active" className="testing1" to="testing1" spy={true} smooth={true} duration={500} >
                            <text x="55" y="60" fill="#191970" onClick={this.handleClick} style={{ textDecoration: 'underline' }}>1</text>
                        </Link>
                    </svg>
                </div>
            </div>

        );
    }
}

export default Sites;
