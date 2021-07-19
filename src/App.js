import React, {lazy, Suspense, useEffect} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {createStructuredSelector} from "reselect";
import {connect} from "react-redux";

import Spinner from "./components/spinner/spinner.component";
import {selectCurrentUser} from "./redux/user/user.selectors";
import GuardedRoute from "./components/guarded-route/guarded-route.component";

import { checkUserSession } from './redux/user/user.actions';
import Header from "./components/header/header.component";
import TablesLayoutEditorPage from "./pages/restaurant/tables-layout-editor/tables-layout-editor.component";
import LoadingFromBackend from "./components/loading/loading-component";

const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const SignUpPage = lazy(() => import('./pages/user/sign-up/sign-up.component'));
const SignInPage = lazy(() => import('./pages/user/sign-in/sign-in.component'));
const VerifyEmailPage = lazy(() => import("./pages/user/verify-email/verify-email.component"));
const RestaurantHomePage = lazy(() => import("./pages/restaurant/restaurant-homepage/restaurant-homepage.component"));
const RestaurantNamePage = lazy(() => import("./pages/restaurant/restaurant-name/restaurant-name.component"));
const ReservationsPage = lazy(() => import("./pages/restaurant/reservations/reservations.component"));

const App = ({checkUserSession, currentUser}) => {
    useEffect(() => {
        checkUserSession();
    }, [checkUserSession]);

    return (
        <div>
            <Header />
            <Switch>
                <Suspense fallback={<Spinner/>}>
                    <Route exact path='/' render={() =>
                        currentUser ? <Redirect to='/restaurant'/> : <HomePage/>
                    }/>
                    <Route exact path='/sign-up' render={() =>
                        currentUser ? <Redirect to='/restaurant'/> : <SignUpPage/>
                    }/>
                    <Route exact path='/sign-in' render={() =>
                        currentUser ? <Redirect to='/restaurant'/> : <SignInPage/>
                    }/>
                    <Route exact path='/restaurant/v' render={() => {
                        return !currentUser ? <span>NO CURRENT USER</span> : <VerifyEmailPage/>;
                    }}/>
                    <Route exact path='/restaurant/verifyEmail' render={() =>
                        !currentUser ? <Redirect to='/'/> :
                            (currentUser.emailVerified ?
                                <Redirect to='/restaurant/'/> :
                                <VerifyEmailPage/>)
                    }/>
                    <Route exact path='/restaurant/restaurantName' render={() =>
                        !currentUser ? <Redirect to='/'/> : currentUser.restaurantName ? <Redirect to='/restaurant/'/> :
                            <RestaurantNamePage/>
                    }/>
                    <GuardedRoute exact path='/restaurant' component={RestaurantHomePage} currentUser={currentUser}/>
                    <GuardedRoute exact path='/restaurant/tablesLayout' component={TablesLayoutEditorPage} currentUser={currentUser}/>
                    <GuardedRoute exact path='/restaurant/reservations' component={ReservationsPage} currentUser={currentUser}/>
                </Suspense>
            </Switch>
            <LoadingFromBackend />
        </div>
    );
};

export default connect(
    createStructuredSelector({
        currentUser: selectCurrentUser
    }),
    dispatch => ({checkUserSession: () => dispatch(checkUserSession())})
)(App);
