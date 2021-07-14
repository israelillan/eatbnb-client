import React from 'react';
import {createStructuredSelector} from "reselect";
import {connect} from "react-redux";

import {HeaderContainer} from "./header.styles";

import {selectCurrentUser} from "../../redux/user/user.selectors";
import {Link} from "react-router-dom";
import {signOutStart} from "../../redux/user/user.actions";

const Header = ({currentUser, signOut}) => {
    return (
        <HeaderContainer>
            {currentUser ? (<button onClick={signOut}>Sign out</button>) :
                (
                    <div>
                        <Link to='/sign-in'>Sign in</Link>
                    </div>
                )}
        </HeaderContainer>
    );
};

export default connect(
    createStructuredSelector({
        currentUser: selectCurrentUser
    }),
    dispatch => ({signOut: () => dispatch(signOutStart())})
)(Header);
