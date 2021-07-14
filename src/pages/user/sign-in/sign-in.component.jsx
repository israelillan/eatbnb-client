import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import {SignInContainer} from "./sign-in.styles";

import {signInStart} from '../../../redux/user/user.actions'

import FormInput from "../../../components/form-input/form-input.component";
import CustomButton from "../../../components/custom-button/curtom-button.component";

const SignIn = ({signInStart}) => {
    const [userCredentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const { email, password } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();

        signInStart(email, password);
    };

    const handleChange = event => {
        const { value, name } = event.target;

        setCredentials({ ...userCredentials, [name]: value });
    };

    return (
        <SignInContainer>
            <span>Sign in with your email and password</span>
            <Link to='/sign-up'>Create an account</Link>
            <form onSubmit={handleSubmit}>
                <FormInput
                    name='email'
                    type='email'
                    handleChange={handleChange}
                    value={email}
                    label='email'
                    required
                />
                <FormInput
                    name='password'
                    type='password'
                    value={password}
                    handleChange={handleChange}
                    label='password'
                    required
                />
                <CustomButton type='submit'>Sign in</CustomButton>
            </form>
        </SignInContainer>
    )
};

export default connect(
    null,
    (dispatch) => ({
        signInStart: (email, password) => dispatch(signInStart(email, password))
    })
)(SignIn);