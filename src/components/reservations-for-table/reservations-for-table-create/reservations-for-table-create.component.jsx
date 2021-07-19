import React, {useState} from 'react';
import {createReservationStart} from "../../../redux/reservation/reservation.actions";
import {connect} from "react-redux";
import {roundToHour} from "../../../utils/date";
import ReservationForTableViewer from "../reservation-for-table-viewer/reservation-for-table-viewer.component";
import {Button} from "@material-ui/core";

const ReservationsForTableCreate = ({table, doCreateReservation}) => {
    const [reservationToBeCreated, setReservationToBeCreated] = useState(null);
    const createReservation = (reservation) => {
        doCreateReservation(table,
            reservation.dateAndTime, reservation.customerName, reservation.customerPhone);
        setReservationToBeCreated(null);
    }

    return <>
        <Button onClick={() => {
            setReservationToBeCreated({
                dateAndTime: roundToHour(new Date()),
                customerName: '',
                customerPhone: ''
            });
        }}>Create reservation</Button>
        <ReservationForTableViewer
            reservation={reservationToBeCreated}
            setReservationDetails={setReservationToBeCreated}
            onHide={() => setReservationToBeCreated(null)}
            onAccept={createReservation}
        />
    </>;
};

export default connect(
    null,
    dispatch => ({
        doCreateReservation: (table, dateAndTime, customerName, customerPhone) => dispatch(createReservationStart(table, dateAndTime, customerName, customerPhone)),
    })
)(ReservationsForTableCreate);