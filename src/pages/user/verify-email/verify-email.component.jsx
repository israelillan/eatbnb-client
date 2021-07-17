import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {checkUserSession} from "../../../redux/user/user.actions";
import {CenteredContainer} from "../../../components/common-styles/common.styles";
import {Col, Row} from "react-bootstrap";
import Typography from "@material-ui/core/Typography";

const VerifyEmailPage = ({checkUserSession}) => {
    useEffect(() => {
        const timer = setInterval(() => {
            checkUserSession();
        }, 1000);
        return function () {
            clearInterval(timer);
        };
    }, [checkUserSession]);


    return (
        <CenteredContainer>
            <Row>
                <Col>
                    <Typography textAlign='center' variant='h5'>Please check your email to verify your account</Typography>
                </Col>
            </Row>
        </CenteredContainer>
    );
};

export default connect(null,
    dispatch => ({checkUserSession: () => dispatch(checkUserSession())})
)(VerifyEmailPage);