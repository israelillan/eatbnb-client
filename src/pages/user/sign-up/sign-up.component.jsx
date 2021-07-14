import React, { useState } from 'react';
import { connect } from 'react-redux';
import {signUpStart} from "../../../redux/user/user.actions";
import { SignUpContainer } from './sign-up.styles';
import FormInput from "../../../components/form-input/form-input.component";
import CustomButton from "../../../components/custom-button/curtom-button.component";
import {Link} from "react-router-dom";

const SignUp = ({signUpStart}) => {
    const [userCredentials, setUserCredentials] = useState({
        managerName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const { managerName, email, password, confirmPassword } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert("passwords don't match");
            return;
        }

        signUpStart(email, password, managerName);
    };

    const handleChange = event => {
        const {name, value} = event.target;

        setUserCredentials({...userCredentials, [name]: value});
    };

    return (
        <SignUpContainer>
            <span>Sign up with your email and password</span>
            <Link to='/sign-in'>I already have an account</Link>
            <form className='sign-up-form' onSubmit={handleSubmit}>
                <FormInput
                    type='text'
                    name='managerName'
                    value={managerName}
                    onChange={handleChange}
                    label='Display Name'
                    required
                />
                <FormInput
                    type='email'
                    name='email'
                    value={email}
                    onChange={handleChange}
                    label='Email'
                    required
                />
                <FormInput
                    type='password'
                    name='password'
                    value={password}
                    onChange={handleChange}
                    label='Password'
                    required
                />
                <FormInput
                    type='password'
                    name='confirmPassword'
                    value={confirmPassword}
                    onChange={handleChange}
                    label='Confirm Password'
                    required
                />
                <CustomButton type='submit'>Sign up</CustomButton>
            </form>
        </SignUpContainer>
    );
}

export default connect(
    null,
    (dispatch) => ({
        signUpStart: (email, password, managerName) => dispatch(signUpStart(email, password, managerName))
    })
)(SignUp);
