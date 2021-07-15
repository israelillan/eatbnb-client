import React from 'react';
import {ReservationsPageContainer} from "./reservations.styles";
import {Link} from "react-router-dom";

const ReservationsPage = () => {
    return <ReservationsPageContainer>
        <span>Check reservations per table</span>
        <br />
        <Link to='/restaurant/'>Done</Link>
    </ReservationsPageContainer>;
}

export default ReservationsPage;