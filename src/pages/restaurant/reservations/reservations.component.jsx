import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";

import {ReservationsPageContainer} from "./reservations.styles";
import TablesLayout from "../../../components/tables-layout/tables-layout/tables-layout.component";
import ReservationsForTable from "../../../components/reservations-for-table/reservations-for-table/reservations-for-table.component";
import {getReservationsStart} from "../../../redux/reservation/reservation.actions";

const ReservationsPage = ({dispatchGetReservations}) => {
    const [selectedTable, setSelectedTable] = useState(null);
    const tableClicked = (table) => {
        if (table !== selectedTable) {
            setSelectedTable(table);
            dispatchGetReservations(table);
        }
    };

    return <ReservationsPageContainer>
        <span>Check reservations per table</span>
        <br />
        <Link to='/restaurant/'>Back</Link>
        <TablesLayout onTableClicked={tableClicked}/>
        <br/>
        {selectedTable ? <ReservationsForTable table={selectedTable}/> :
            <span>Select a table to see it's reservations</span>}
    </ReservationsPageContainer>;
}

export default connect(
    null,
    dispatch => ({
        dispatchGetReservations: (table) => dispatch(getReservationsStart(table)),
    })
)(ReservationsPage);