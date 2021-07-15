import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import DateTimePicker from "react-datetime-picker";
import {createReservationStart} from "../../../redux/reservation/reservation.actions";
import {connect} from "react-redux";
import {ReservationsForTableCreateContainer} from "./reservations-for-table-create.styles";
import {createStructuredSelector} from "reselect";
import {selectReservations} from "../../../redux/reservation/reservation.selectors";
import {roundToHour} from "../../../utils/date";

const ReservationsForTableCreate = ({table, reservations, doCreateReservation}) => {
    const emptyReservation = {
        dateAndTime: roundToHour(new Date()),
        customerName: '',
        customerPhone: ''
    };
    const [openModal, setOpenModal] = useState(false);
    const [reservationDetails, setReservationDetails] = useState(emptyReservation);
    const createReservation = () => {
        doCreateReservation(table,
            reservationDetails.dateAndTime, reservationDetails.customerName, reservationDetails.customerPhone);
        setOpenModal(false);
    }
    const isReservationValid = () => {
        const existingReservation = reservations.find(r => (
            r.dateAndTime.getTime() === reservationDetails.dateAndTime.getTime()
        ));
        console.log(reservations);
        console.log(reservationDetails);
        return !existingReservation &&
            reservationDetails.dateAndTime &&
            reservationDetails.customerName &&
            reservationDetails.customerPhone;
    };

    return <ReservationsForTableCreateContainer><Button onClick={() => {
        setReservationDetails(emptyReservation);
        setOpenModal(true);
    }}>Create reservation</Button>
        <Modal show={openModal} onHide={() => setOpenModal(false)} backdrop='static' keyboard='false' centered>
            <Modal.Body>
                <h4>Enter reservation details</h4>
                <DateTimePicker closeWidgets={false} maxDetail='hour' minDate={new Date()} required clearIcon={null}
                                onChange={v =>
                                    setReservationDetails({
                                        ...reservationDetails,
                                        dateAndTime: roundToHour(v)
                                    })
                                }
                                value={reservationDetails.dateAndTime}
                />
                <Form.Group>
                    <Form.Label>Customer name</Form.Label>
                    <Form.Control type='text' placeholder='Customer name'
                                  onChange={event => setReservationDetails({
                                      ...reservationDetails,
                                      customerName: event.target.value
                                  })}
                                  value={reservationDetails.customerName}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Customer contact</Form.Label>
                    <Form.Control type='text' placeholder='Customer contact'
                                  onChange={event => setReservationDetails({
                                      ...reservationDetails,
                                      customerPhone: event.target.value
                                  })}
                                  value={reservationDetails.customerPhone}/>

                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={createReservation}
                        disabled={!isReservationValid()}>Accept</Button>
                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </ReservationsForTableCreateContainer>;
};

export default connect(
    createStructuredSelector({
        reservations: selectReservations
    }),
    dispatch => ({
        doCreateReservation: (table, dateAndTime, customerName, customerPhone) => dispatch(createReservationStart(table, dateAndTime, customerName, customerPhone)),
    })
)(ReservationsForTableCreate);