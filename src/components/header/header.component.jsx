import React, {useState} from 'react';
import { withRouter } from 'react-router-dom';
import {createStructuredSelector} from "reselect";
import {connect} from "react-redux";
import {Button, Container, Navbar} from "react-bootstrap";
import MenuIcon from '@material-ui/icons/Menu';
import AssessmentIcon from '@material-ui/icons/Assessment';

import {selectCurrentUser} from "../../redux/user/user.selectors";
import {Link} from "react-router-dom";
import {signOutStart} from "../../redux/user/user.actions";
import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography} from "@material-ui/core";

const Header = ({history, currentUser, signOut}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const menuIcon = (currentUser ?
        <div>
            <IconButton onClick={handleClick}>
                <MenuIcon color='primary' fontSize="large"/>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={() => {
                    history.push('/restaurant');
                    handleClose();
                }}>
                    <ListItemIcon><AssessmentIcon />></ListItemIcon>
                    <ListItemText>Reservations report</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    history.push('/restaurant/tablesLayout');
                    handleClose();
                }}>
                    <ListItemIcon><AssessmentIcon />></ListItemIcon>
                    <ListItemText>Edit tables layout</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    history.push('/restaurant/reservations');
                    handleClose();
                }}>
                    <ListItemIcon><AssessmentIcon />></ListItemIcon>
                    <ListItemText>Manage reservations</ListItemText>
                </MenuItem>
            </Menu>
        </div> : null);

    return (
        <>
            <Navbar sticky='top' bg='dark' variant='dark'>
                <Container>
                    {menuIcon}
                    <Navbar.Brand>
                        <Typography variant='h5'>
                            {currentUser ? currentUser.restaurantName : `Eat BnB`}
                        </Typography>
                    </Navbar.Brand>
                    <Navbar.Collapse className='justify-content-end'>
                        <Navbar.Text>
                            {currentUser ? (<Button onClick={signOut}>Sign out</Button>) :
                                (
                                    <Typography variant='subtitle1'><Link to='/sign-in'>Sign in</Link> or <Link
                                        to='/sign-up'>Sign up</Link></Typography>
                                )}
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default withRouter(connect(
    createStructuredSelector({
        currentUser: selectCurrentUser
    }),
    dispatch => ({signOut: () => dispatch(signOutStart())})
)(Header));
