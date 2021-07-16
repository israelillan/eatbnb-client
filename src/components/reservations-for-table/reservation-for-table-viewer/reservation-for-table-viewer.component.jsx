import React from 'react';
import {ReservationForTableViewerContainer} from "./reservation-for-table-viewer.styles";
import {Form, Modal} from "react-bootstrap";
import {roundToHour} from "../../../utils/date";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {selectReservations} from "../../../redux/reservation/reservation.selectors";
import {DateTimePicker} from "@material-ui/lab";
import {Button, TextField} from "@material-ui/core";

const ReservationForTableViewer = ({reservation, setReservationDetails, onHide, onAccept, onDelete, reservations}) => {
    const isReservationValid = () => {
        if (!reservation) {
            return false;
        }

        const existingReservation = reservations.find(r => {
            if (reservation.backendObject) {
                return r.dateAndTime.getTime() === reservation.dateAndTime.getTime() &&
                    r.backendObject.id !== reservation.backendObject.id;
            } else {
                return r.dateAndTime.getTime() === reservation.dateAndTime.getTime()
            }
        });
        return !existingReservation &&
            reservation.dateAndTime &&
            reservation.customerName &&
            reservation.customerPhone;
    };

    const deleteButton = onDelete ?
        <Button color="error" onClick={() => onDelete(reservation)}>Delete</Button>
        : null;
    if(!reservation) {
        return null;
    } else {
        return <ReservationForTableViewerContainer>
            <Modal show={!!reservation} onHide={onHide} backdrop='static' keyboard='false' centered>
                <Modal.Body>
                    <h4>Reservation details</h4>
                    <DateTimePicker
                        disablePast
                        minutesStep={60}
                        views={['year', 'month', 'day', 'hours']}
                        renderInput={(props) => <TextField {...props} />}
                        label=""
                        value={roundToHour(reservation.dateAndTime)}
                        onChange={(v) => {
                            setReservationDetails({
                               ...reservation,
                               dateAndTime: roundToHour(v)
                            });
                        }}
                        minDateTime={reservation.backendObject ? reservation.dateAndTime : roundToHour(new Date())}
                    />
                    <Form.Group>
                        <Form.Label>Customer name</Form.Label>
                        <Form.Control type='text' placeholder='Customer name'
                                      onChange={event => setReservationDetails({
                                          ...reservation,
                                          customerName: event.target.value
                                      })}
                                      value={reservation.customerName}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Customer contact</Form.Label>
                        <Form.Control type='text' placeholder='Customer contact'
                                      onChange={event => setReservationDetails({
                                          ...reservation,
                                          customerPhone: event.target.value
                                      })}
                                      value={reservation.customerPhone}/>

                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    { deleteButton }
                    <Button onClick={() => onAccept(reservation)}
                            disabled={!isReservationValid()}>Accept</Button>
                    <Button onClick={onHide}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </ReservationForTableViewerContainer>;
    }
}

export default connect(
    createStructuredSelector({
        reservations: selectReservations
    }))(ReservationForTableViewer);