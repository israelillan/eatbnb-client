import React, {useState} from 'react';
import {connect} from "react-redux";
import {setRestaurantNameStart} from "../../../redux/user/user.actions";
import {Button, TextField, Typography} from "@material-ui/core";
import {CenteredContainer} from "../../../components/common-styles/common.styles";
import {Col, Row} from "react-bootstrap";

const RestaurantNamePage = ({doSetRestaurantName}) => {
    const [restaurantName, setRestaurantName] = useState('');

    const sendRestaurantName = () => {
        if(restaurantName) {
            doSetRestaurantName(restaurantName);
        }
    };

    const valueChanged = event => {
        const {value} = event.target;

        setRestaurantName(value);
    };

    return (
        <CenteredContainer>
            <Row>
                <Col>
                    <Typography variant='h6'>Enter your restaurant name</Typography>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TextField
                        margin='normal'
                        fullWidth
                        name='restaurantName'
                        onChange={valueChanged}
                        value={restaurantName}
                        label='restaurantName'
                        required
                    />
                </Col>
            </Row>
            <Row>
                <Col align='center'>
                    <Button onClick={sendRestaurantName} disabled={!restaurantName}>Save</Button>
                </Col>
            </Row>
        </CenteredContainer>
    );
};

export default connect(
    null,
    dispatch => ({
        doSetRestaurantName: (restaurantName) => dispatch(setRestaurantNameStart(restaurantName))
    })
)(RestaurantNamePage);