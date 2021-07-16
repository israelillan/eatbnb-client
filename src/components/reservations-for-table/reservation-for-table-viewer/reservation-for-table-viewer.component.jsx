import React from 'react';
import {ReservationForTableViewerContainer} from "./reservation-for-table-viewer.styles";
import {Button, Form, Modal} from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import {roundToHour} from "../../../utils/date";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {selectReservations} from "../../../redux/reservation/reservation.selectors";

const ReservationForTableViewer = ({reservation, setReservationDetails, onHide, onAccept, reservations}) => {
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

    if(!reservation) {
        return null;
    } else {
        return <ReservationForTableViewerContainer>
            <Modal show={!!reservation} onHide={onHide} backdrop='static' keyboard='false' centered>
                <Modal.Body>
                    <h4>Reservation details</h4>
                    <DateTimePicker closeWidgets={false} maxDetail='hour' minDate={new Date()} required clearIcon={null}
                                    onChange={v =>
                                        setReservationDetails({
                                            ...reservation,
                                            dateAndTime: roundToHour(v)
                                        })
                                    }
                                    value={reservation.dateAndTime}
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