import React from 'react';
import {RestaurantContainer} from "./restaurant-homepage.styles";
import {Link} from "react-router-dom";

const RestaurantHomePage = () => (<RestaurantContainer>
    <Link to='/restaurant/tablesLayout'>Edit tables layout</Link>
</RestaurantContainer>);

export default RestaurantHomePage;