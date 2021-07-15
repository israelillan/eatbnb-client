import React from 'react';
import {RestaurantPageContainer} from "./restaurant-homepage.styles";
import {Link} from "react-router-dom";

const RestaurantHomePage = () => (<RestaurantPageContainer>
    <Link to='/restaurant/tablesLayout'>Edit tables layout</Link>
    <br />
    <Link to='/restaurant/reservations'>Reservations</Link>
</RestaurantPageContainer>);

export default RestaurantHomePage;