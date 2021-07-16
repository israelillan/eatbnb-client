import React, {useState} from 'react';
import {connect} from "react-redux";
import {Box, ListItemButton} from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {FixedSizeList} from 'react-window';
import {format} from 'date-fns';


import {ReservationsForTableContainer} from "./reservations-for-table.styles";

import ReservationsForTableCreate from "../reservations-for-table-create/reservations-for-table-create.component";
import {createStructuredSelector} from "reselect";
import {selectReservations} from "../../../redux/reservation/reservation.selectors";
import ReservationForTableViewer from "../reservation-for-table-viewer/reservation-for-table-viewer.component";
import {deleteReservationStart, updateReservationStart} from "../../../redux/reservation/reservation.actions";

const ReservationsForTable = ({table, reservations, doUpdateReservation, doDeleteReservation}) => {
    const [reservationBeingEdited, setReservationBeingEdited] = useState(null);

    const reservationClicked = (reservation) => {
        setReservationBeingEdited(reservation);
    };
    const updateReservation = (reservation) => {
        doUpdateReservation(reservation,
            reservationBeingEdited.table,
            reservationBeingEdited.dateAndTime,
            reservationBeingEdited.customerName,
            reservationBeingEdited.customerPhone);
        setReservationBeingEdited(null);
    };

    const renderRow = ({index, style}) => {
        const reservation = reservations[index];
        return (
            <ListItem style={style} key={reservation.backendObject.id} alignItems='flex-start'>
                <ListItemButton onClick={() => reservationClicked(reservation)}>
                    <ListItemText
                        primary={`${format(reservation.dateAndTime, 'kk:mm:ss dd/MM/yyyy')}`}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{display: 'inline'}}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    {`${reservation.customerName}`}
                                </Typography>
                                {` - ${reservation.customerPhone}`}
                            </React.Fragment>
                        }
                    />
                </ListItemButton>
            </ListItem>
        );
    };

    return <ReservationsForTableContainer>
        <span>{`Reservations for table #${table.reference} [${table.seats}]`}</span>
        <br/>
        <ReservationsForTableCreate table={table}/>
        <Box
            sx={{width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper'}}
        >
            <FixedSizeList
                height={400}
                width={'100%'}
                itemSize={80}
                itemCount={reservations.length}
                overscanCount={5}
            >
                {renderRow}
            </FixedSizeList>
        </Box>
        <ReservationForTableViewer
            reservation={reservationBeingEdited}
            setReservationDetails={setReservationBeingEdited}
            onHide={() => {
                setReservationBeingEdited(null)
            }}
            onAccept={updateReservation}
            onDelete={(r) => {
                doDeleteReservation(r);
                setReservationBeingEdited(null);
            }}
        />

    </ReservationsForTableContainer>;
};

export default connect(
    createStructuredSelector({
        reservations: selectReservations
    }),
    dispatch => ({
        doUpdateReservation: (reservation, table, dateAndTime, customerName, customerPhone) => dispatch(updateReservationStart(reservation, table, dateAndTime, customerName, customerPhone)),
        doDeleteReservation: (reservation) => dispatch(deleteReservationStart(reservation))
    }))
(ReservationsForTable);
