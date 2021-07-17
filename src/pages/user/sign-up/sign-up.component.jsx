import React, {useState} from 'react';
import {connect} from 'react-redux';
import {signUpStart} from "../../../redux/user/user.actions";
import {Link} from "react-router-dom";
import {Button, TextField, Typography} from "@material-ui/core";
import {CenteredContainer} from "../../../components/common-styles/common.styles";
import {Col, Row} from "react-bootstrap";
import {createStructuredSelector} from "reselect";
import {selectError} from "../../../redux/user/user.selectors";

const SignUp = ({userError, signUpStart}) => {
    const [userCredentials, setUserCredentials] = useState({
        managerName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const {managerName, email, password, confirmPassword} = userCredentials;

    const signUp = () => {
        if (password !== confirmPassword) {
            return;
        }

        signUpStart(email, password, managerName);
    };

    const valueChanged = event => {
        const {name, value} = event.target;
        setUserCredentials({...userCredentials, [name]: value});
    };

    return (
        <CenteredContainer>
            <Row>
                <Col>
                    <Typography variant='h6'>Create a new account</Typography>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField
                        margin='normal'
                        fullWidth
                        type='text'
                        name='managerName'
                        value={managerName}
                        onChange={valueChanged}
                        label='Manager name'
                        required
                        error={!!userError}
                        helperText={userError ? `${userError}` : ''}
                    />
                    <TextField
                        margin='normal'
                        fullWidth
                        type='email'
                        name='email'
                        value={email}
                        onChange={valueChanged}
                        label='Email'
                        required
                        error={!!userError}
                        helperText={userError ? `${userError}` : ''}
                    />
                    <TextField
                        margin='normal'
                        fullWidth
                        type='password'
                        name='password'
                        value={password}
                        onChange={valueChanged}
                        label='Password'
                        required
                        error={password !== confirmPassword}
                    />
                    <TextField
                        margin='normal'
                        fullWidth
                        type='password'
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={valueChanged}
                        label='Confirm Password'
                        required
                        error={password !== confirmPassword}
                        helperText={(password !== confirmPassword) ? 'Passwords don\'t match' : ''}
                    />
                </Col>
            </Row>
            <Row>
                <Col align='center'>
                    <Button onClick={signUp}>Sign up</Button>
                </Col>
            </Row>
            <Row>
                <Col align='right'>
                    <Typography variant='caption'>
                        <Link to='/sign-in'>I already have an account</Link>
                    </Typography>
                </Col>
            </Row>
        </CenteredContainer>
    );
}

export default connect(
    createStructuredSelector({
        userError: selectError
    }),
    (dispatch) => ({
        signUpStart: (email, password, managerName) => dispatch(signUpStart(email, password, managerName))
    })
)(SignUp);
