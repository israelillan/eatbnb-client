import React, {useState} from 'react';
import {connect} from "react-redux";

import TablesLayout from "../../../components/tables-layout/tables-layout/tables-layout.component";
import ReservationsForTable
    from "../../../components/reservations-for-table/reservations-for-table/reservations-for-table.component";
import {getReservationsStart} from "../../../redux/reservation/reservation.actions";
import {BigCenteredContainer} from "../../../components/common-styles/common.styles";
import {Col, Row} from "react-bootstrap";
import {Typography} from "@material-ui/core";

const ReservationsPage = ({dispatchGetReservations}) => {
    const [selectedTable, setSelectedTable] = useState(null);
    const tableClicked = (table) => {
        if (table !== selectedTable) {
            setSelectedTable(table);
            dispatchGetReservations(table);
        }
    };

    return <BigCenteredContainer>
        <Row>
            <Col>
                <Typography variant='h6'>Check reservations per table</Typography>
            </Col>
        </Row>
        <Row>
            <Col>
                <TablesLayout onTableClicked={tableClicked}/>
            </Col>
        </Row>
        <Row>
            <Col>
                {selectedTable ? <ReservationsForTable table={selectedTable}/> :
                    <Typography variant='subtitle1' align='center'>Select a table to see it's reservations</Typography>}
            </Col>
        </Row>
    </BigCenteredContainer>;
}

export default connect(
    null,
    dispatch => ({
        dispatchGetReservations: (table) => dispatch(getReservationsStart(table)),
    })
)(ReservationsPage);