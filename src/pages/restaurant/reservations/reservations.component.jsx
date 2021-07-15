import React, {useState} from 'react';
import {ReservationsPageContainer} from "./reservations.styles";
import {Link} from "react-router-dom";
import TablesLayout from "../../../components/tables-layout/tables-layout/tables-layout.component";
import {Modal} from "react-bootstrap";

const ReservationsPage = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);

    const tableClicked = (table) => {
        setSelectedTable(table);
        setOpenModal(true);
    };
    const closeModal = () => {
        setOpenModal(false);
    };

    return <ReservationsPageContainer>
        <span>Check reservations per table</span>
        <TablesLayout onTableClicked={tableClicked}/>
        <Modal show={openModal} onHide={closeModal} backdrop='static' keyboard='false' centered>
            <Modal.Header closeButton>
                <Modal.Title>Reservations for table #{selectedTable.reference} [{selectedTable.seats} seats]</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/*<input type='number' min='1' step='1'*/}
                {/*       onChange={event => setTableSeats(Math.max(1, event.target.value))} value={tableSeats}/>*/}
            </Modal.Body>
        </Modal>
        <br/>
        <Link to='/restaurant/'>Done</Link>
    </ReservationsPageContainer>;
}

export default ReservationsPage;