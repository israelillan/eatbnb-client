import React from 'react';
import { withRouter } from 'react-router-dom';

import {ReservationsPageContainer} from "./reservations.styles";
import {Link} from "react-router-dom";
import TablesLayout from "../../../components/tables-layout/tables-layout/tables-layout.component";

const ReservationsPage = ({history}) => {
    const tableClicked = (table) => {
        history.push(`reservationsForTable/${table.reference}`)
    };

    return <ReservationsPageContainer>
        <span>Check reservations per table</span>
        <TablesLayout onTableClicked={tableClicked}/>
        <br/>
        <Link to='/restaurant/'>Done</Link>
    </ReservationsPageContainer>;
}

export default withRouter(ReservationsPage);