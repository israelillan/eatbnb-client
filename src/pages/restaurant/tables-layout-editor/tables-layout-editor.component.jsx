import React, {useState} from 'react';
import {connect} from "react-redux";
import {DndProvider} from "react-dnd";

import {TablesLayoutEditorContainer} from "./tables-layout-editor.styles";

import {createTableStart, deleteTableStart, updateTableStart} from "../../../redux/table/table.actions";
import {Button, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import {HTML5Backend} from "react-dnd-html5-backend";
import TablesLayout from "../../../components/tables-layout/tables-layout/tables-layout.component";

const TablesLayoutEditorPage = ({dispatchCreateTable, dispatchUpdateTable, dispatchDeleteTable}) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [tableSeats, setTableSeats] = useState(4)

    const cellClicked = (x, y) => {
        console.log('cell clicked');
        setSelectedCell({x, y, table: null});
        setOpenCreate(true);
    };
    const tableClicked = (table) => {
        console.log('table clicked');
        setSelectedCell({x: table.x, y: table.y, table});
        setTableSeats(table.seats);
        setOpenCreate(true);
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
        setOpenCreate(false);
    };
    const tableDropped = (x, y, table) => {
        dispatchUpdateTable(table, x, y, table.seats);
    };


    return (
        <TablesLayoutEditorContainer>
            <span>Set up your restaurant tables layout</span>
            <DndProvider backend={HTML5Backend}>
                <TablesLayout onCellClicked={cellClicked} onTableClicked={tableClicked} onTableDropped={tableDropped} />
            </DndProvider>
            <Modal show={openCreate} onHide={closeModal} backdrop='static' keyboard='false' centered>
                <Modal.Body>
                    <h4>Enter number of seats</h4>
                    <input type='number' min='1' step='1'
                           onChange={event => setTableSeats(Math.max(1, event.target.value))} value={tableSeats}/>
                </Modal.Body>
                <Modal.Footer>
                    {selectedCell?.table ? <Button onClick={deleteCell}>Delete</Button> : null}
                    <Button onClick={createOrUpdateCell}>Accept</Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <br />
            <Link to='/restaurant/'>Done</Link>
        </TablesLayoutEditorContainer>
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
