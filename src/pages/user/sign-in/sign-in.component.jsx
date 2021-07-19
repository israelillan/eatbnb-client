import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import {signInStart} from '../../../redux/user/user.actions'

import {Button, TextField, Typography} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import {CenteredContainer} from "../../../components/common-styles/common.styles";

const SignIn = ({signInStart}) => {
    const [userCredentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const {email, password} = userCredentials;

    const signIn = () => {
        signInStart(email, password);
    };

    const valueChanged = (event) => {
        const {value, name} = event.target;

        setCredentials({...userCredentials, [name]: value});
    };

    return (
        <CenteredContainer>
            <Row>
                <Col>
                    <Typography variant='h6'>Sign in with your email and password</Typography>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField
                        margin='normal'
                        fullWidth
                        name='email'
                        type='email'
                        onChange={valueChanged}
                        value={email}
                        label='email'
                        required
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField
                        margin='normal'
                        fullWidth
                        name='password'
                        type='password'
                        value={password}
                        onChange={valueChanged}
                        label='password'
                        required
                    />
                </Col>
            </Row>
            <Row>
                <Col align='center'>
                    <Button onClick={signIn} variant='outlined'>Sign in</Button>
                </Col>
            </Row>
            <Row>
                <Col align='right'>
                    <Link to='/sign-up'>
                        <Typography variant='caption'>
                            Create an account
                        </Typography>
                    </Link>
                </Col>
            </Row>
        </CenteredContainer>
    );
};

export default connect(
    null,
    (dispatch) => ({
        signInStart: (email, password) => dispatch(signInStart(email, password))
    })
)(SignIn);