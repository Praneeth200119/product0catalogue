import React ,{ Component } from "react";
import PropTypes from 'prop-types';
import Cookies from 'js-cookie'
import { useNavigate,} from 'react-router-dom';
import withTokenCheck from "../HighOrderComp";

import './styles.css'


class LoginForm extends Component{
    state={
        username:'',
        password:'',
        showErro:false,
        errorMsg:""
    }

    onChangeUserName = (event) =>{
        this.setState({username:event.target.value});
    }

    onChangePassword = (event) =>{
        this.setState({password:event.target.value});
    }

    onSubmitSuccess = (data) => {
        const {navigate} = this.props
        Cookies.set('jwt_token', data.jwtToken, {expires: 1})
        this.setState({showError:false, errorMsg:""})
        navigate('/')
    }

    onSubmitFail = (data) =>{
        this.setState({showError:true, errorMsg:data.error})
    }
    

    onSubmitLoginFrom = async (event) =>{
        event.preventDefault();
        const{username, password} = this.state
        const userDetails = {
            username:username,
            password:password
        }
        const loginUrl = `http://localhost:3000/login`;
        const options = {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(userDetails)
        }

        const response = await fetch(loginUrl, options)
        const data = await response.json()
        if (response.ok === true) {
            this.onSubmitSuccess(data)
          }else{
            this.onSubmitFail(data)
          }
    }

    render(){
        const{username,password,showError,errorMsg} = this.state
        return(
            <div className="login-page-container">
                <div className="login-page-image-container">
                    <img src="https://res.cloudinary.com/dbwmdblhs/image/upload/v1715758260/wreuu6dpeigidojc4cyp.jpg" className="login-page-image" alt="login-img"/>
                </div>
                <div className="form-contianer-login">
                    <form className="form-container" onSubmit={this.onSubmitLoginFrom}>
                        <div className="form-item-single-field">
                            <label htmlFor="username" className="login-form-label">USERNAME</label>
                            <input type="text" id="username" value={username} className="login-input-field" placeholder="USERNAME" onChange={this.onChangeUserName}/>
                        </div>
                        <div className="form-item-single-field">
                            <label htmlFor="password" className="login-form-label">PASSWORD</label>
                            <input type="password" id="password" value={password} className="login-input-field" placeholder="PASSWORD" onChange={this.onChangePassword}/>
                        </div>
                        {showError && <p className="error-msg">{errorMsg}</p>}
                        <button className="login-button" type="submit">Login</button>
                    </form>
                </div>
                
            </div>
        )
    }
}

LoginForm.propTypes = {
    navigate: PropTypes.func.isRequired // Validate navigate prop as a function
};
const LoginWrapper = (props) => {
    const navigate = useNavigate();

    return <LoginForm {...props} navigate={navigate} />;
};





export default withTokenCheck(LoginWrapper)