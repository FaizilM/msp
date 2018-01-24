import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';
import '../assets/css/main.css';
import '../assets/css/util.css';

import footerLogo from '../assets/images/logo-footer.png';


class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
        this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password } = this.state;

        const { dispatch } = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        }
    }

    render() {
        const { loggingIn } = this.props;

        const { alert } = this.props;
        const { username, password, submitted } = this.state;
        return (
        <div className="limiter">

           <div className="container-login100">

              <div className="wrap-login100 p-l-85 p-r-85 p-t-55 p-b-55">

              {alert.message &&
                  <div className={`alert ${alert.type}`} col-sm-4 col-sm-offset-4>{alert.message}</div>
              }
                 <form className="login100-form validate-form flex-sb flex-w" onSubmit={this.handleSubmit}>

                    <span className="login100-form-title p-b-32">
                    Account Login
                    </span>
                    <span className="txt1 p-b-11">
                    Username
                    </span>
                    <div className="wrap-input100 validate-input m-b-36" data-validate = "Username is required">
                       <input type="text" className="input100" name="username" value={username} onChange={this.handleChange} />
                       {submitted && !username &&
                       <div className="alert-danger">Username is required</div>
                       }
                       <span className="focus-input100"></span>
                    </div>
                    <span className="txt1 p-b-11">
                    Password
                    </span>
                    <div className="wrap-input100 validate-input m-b-12" data-validate = "Password is required">
                       <span className="btn-show-pass">
                       <i className="fa fa-eye"></i>
                       </span>
                       <input type="password" className="input100" name="password" value={password} onChange={this.handleChange} />
                       {submitted && !password &&
                       <div className="alert-danger">Password is required</div>
                       }
                       <span className="focus-input100"></span>
                    </div>
                    <div className="flex-sb-m w-full p-b-48">
                       <div className="contact100-form-checkbox">

                       </div>
                       <div>
                       </div>
                    </div>
                    <div className="container-login100-form-btn">
                       <button className="login100-form-btn">
                       Login
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>

        );
    }
}



function mapStateToProps(state) {

    const { alert } = state;
    const { loggingIn } = state.authentication;
    return {
        alert,
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };
