import React, {useEffect} from 'react';
import {VerifyEmailContainer} from "./verify-email.styles";
import {connect} from "react-redux";
import {checkUserSession} from "../../../redux/user/user.actions";

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
        <VerifyEmailContainer>
            <span>Please check your email to verify your account</span>
        </VerifyEmailContainer>
    );
};

export default connect(null,
    dispatch => ({checkUserSession: ()=> dispatch(checkUserSession())})
)(VerifyEmailPage);