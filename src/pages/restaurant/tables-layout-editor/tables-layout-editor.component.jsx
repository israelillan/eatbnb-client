import React, {useState} from 'react';
import {connect} from "react-redux";

import {createTableStart, deleteTableStart, updateTableStart} from "../../../redux/table/table.actions";
import {Button, Col, Modal, Row} from "react-bootstrap";
import TablesLayout from "../../../components/tables-layout/tables-layout/tables-layout.component";
import {BigCenteredContainer} from "../../../components/common-styles/common.styles";
import {Typography} from "@material-ui/core";

const TablesLayoutEditorPage = ({dispatchCreateTable, dispatchUpdateTable, dispatchDeleteTable}) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [tableSeats, setTableSeats] = useState(4)

    const cellClicked = (x, y) => {
        setSelectedCell({x, y, table: null});
        setOpenModal(true);
    };
    const tableClicked = (table) => {
        setSelectedCell({x: table.x, y: table.y, table});
        setTableSeats(table.seats);
        setOpenModal(true);
    };
    const createOrUpdateCell = () => {
        if (selectedCell) {
            if (selectedCell.table) {
                dispatchUpdateTable(selectedCell.table, selectedCell.x, selectedCell.y, tableSeats);
            } else {
                dispatchCreateTable(selectedCell.x, selectedCell.y, tableSeats);
            }
        }
        closeModal();
    };
    const deleteCell = () => {
        if (selectedCell) {
            if (selectedCell.table) {
                dispatchDeleteTable(selectedCell.table);
            }
        }
        closeModal();
    };
    const closeModal = () => {
        setOpenModal(false);
    };
    const tableDropped = (x, y, table) => {
        dispatchUpdateTable(table, x, y, table.seats);
    };


    return (
        <BigCenteredContainer>
            <Row>
                <Col>
                    <Typography variant='h6'>Set up your restaurant tables layout</Typography>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TablesLayout onCellClicked={cellClicked} onTableClicked={tableClicked}
                                  onTableDropped={tableDropped}/>
                </Col>
            </Row>
            <Modal show={openModal} onHide={closeModal} backdrop='static' keyboard='false' centered>
                <Modal.Body>
                    <h4>Enter number of seats</h4>
                    <input type='number' min='1' step='1'
                           onChange={event => setTableSeats(Math.max(1, parseInt(event.target.value)))} value={tableSeats}/>
                </Modal.Body>
                <Modal.Footer>
                    {selectedCell?.table ? <Button onClick={deleteCell}>Delete</Button> : null}
                    <Button onClick={createOrUpdateCell}>Accept</Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </BigCenteredContainer>
    );
};

export default connect(
    null,
    dispatch => ({
        dispatchCreateTable: (x, y, seats) => dispatch(createTableStart(x, y, seats)),
        dispatchUpdateTable: (table, x, y, seats) => dispatch(updateTableStart(table, x, y, seats)),
        dispatchDeleteTable: (table) => dispatch(deleteTableStart(table))
    })
)(TablesLayoutEditorPage);
