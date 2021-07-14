import React, {useState} from 'react';
import {RestaurantNameContainer} from "./restaurant-name.styles";
import FormInput from "../../../components/form-input/form-input.component";
import CustomButton from "../../../components/custom-button/curtom-button.component";
import {connect} from "react-redux";
import {setRestaurantNameStart} from "../../../redux/user/user.actions";

const RestaurantNamePage = ({setRestaurantNameStart}) => {
    const [getRestaurantName, setRestaurantName] = useState({
        restaurantName: ''
    });

    const {restaurantName} = getRestaurantName;

    const handleSubmit = async event => {
        event.preventDefault();

        setRestaurantNameStart(restaurantName);
    };

    const handleChange = event => {
        const {value} = event.target;

        setRestaurantName({restaurantName: value});
    };

    return (
        <RestaurantNameContainer>
            <span>Enter your restaurantName</span>
            <form onSubmit={handleSubmit}>
                <FormInput
                    name='restaurantName'
                    handleChange={handleChange}
                    value={restaurantName}
                    label='restaurantName'
                    required
                />
                <CustomButton type='submit'>Save</CustomButton>
            </form>
        </RestaurantNameContainer>
    );
};

export default connect(
    null,
    dispatch => ({
        setRestaurantNameStart: (restaurantName) => dispatch(setRestaurantNameStart(restaurantName))
    })
)(RestaurantNamePage);