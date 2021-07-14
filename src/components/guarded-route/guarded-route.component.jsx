import React from 'react';
import { Route, Redirect } from "react-router-dom";

const GuardedRoute = ({ component: Component, currentUser, ...rest }) => (
    <Route {...rest} render={(props) => {
        if (!currentUser) {
            return <Redirect to='/' />;
        } else if (!currentUser.emailVerified) {
            return <Redirect to='/restaurant/verifyEmail' />;
        } else if (!currentUser.restaurantName) {
            return <Redirect to='/restaurant/restaurantName' />;
        } else {
            return <Component {...props} />;
        }
    }} />
)

export default GuardedRoute;