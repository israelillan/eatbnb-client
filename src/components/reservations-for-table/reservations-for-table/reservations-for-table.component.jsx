import React from 'react';

import {ReservationsPageContainer} from "../../../pages/restaurant/reservations/reservations.styles";
import ReservationsForTableCreate from "../reservations-for-table-create/reservations-for-table-create.component";

const ReservationsForTable = ({table}) => {
    return <ReservationsPageContainer>
        <span>{`Reservations for table #${table.reference} [${table.seats}]`}</span>
        <br/>
        <ReservationsForTableCreate table={table} />
    </ReservationsPageContainer>;
};

export default ReservationsForTable;
