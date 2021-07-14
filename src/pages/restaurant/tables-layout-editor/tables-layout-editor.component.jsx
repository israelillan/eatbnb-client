import React, {useState} from 'react';
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {Table, TableBody, TableRow, TablesLayoutEditorContainer} from "./tables-layout-editor.styles";
import {createTableStart, deleteTableStart, updateTableStart} from "../../../redux/table/table.actions";
import {selectTables} from "../../../redux/table/table.selectors";
import LayoutCell from "../../../components/LayoutCell/layout-cell.component";
import {Button, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";

const TablesLayoutEditorPage = ({layout, createTable, updateTable, deleteTable}) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [tableSeats, setTableSeats] = useState(4);
    const cellClicked = (x, y, table) => {
        setSelectedCell({x, y, table});
        if (table) {
            setTableSeats(table.seats);
        }
        setOpenCreate(true);
    };
    const createOrUpdateCell = () => {
        if (selectedCell) {
            if (selectedCell.table) {
                updateTable(selectedCell.table, selectedCell.x, selectedCell.y, tableSeats);
            } else {
                createTable(selectedCell.x, selectedCell.y, tableSeats);
            }
        }
        closeModal();
    };
    const deleteCell = () => {
        if (selectedCell) {
            if (selectedCell.table) {
                deleteTable(selectedCell.table);
            }
        }
        closeModal();
    };
    const closeModal = () => {
        setOpenCreate(false);
    };

    const rows = [];
    const layoutMap = layout.reduce((a,table) => ({...a, [`${table.x},${table.y}`]: table}), {})

    for (let i = 0; i < 15; i++) {
        const cols = [];
        for (let j = 0; j < 10; j++) {
            const index = `${i},${j}`;
            const table = index in layoutMap ? layoutMap[index] : null;
            cols.push(<LayoutCell key={i * 100 + j} x={i} y={j} table={table} onClick={cellClicked}/>);
        }
        rows.push(<TableRow key={i * 100 + 99}>{cols}</TableRow>);
    }

    return (
        <TablesLayoutEditorContainer>
            <span>Set up your restaurant tables layout</span>
            <Table>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
            <Modal show={openCreate} onHide={closeModal} backdrop='static' keyboard='false' centered>
                <Modal.Body>
                    <h4>Enter number of seats</h4>
                    <input type='number' min='1' step='1'
                           onChange={event => setTableSeats(Math.max(1, event.target.value))} value={tableSeats} />
                </Modal.Body>
                <Modal.Footer>
                    {selectedCell?.table ? <Button onClick={deleteCell}>Delete</Button> : null}
                    <Button onClick={createOrUpdateCell}>Accept</Button>
                    <Button onClick={closeModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Link to='/restaurant/'>Done</Link>
        </TablesLayoutEditorContainer>
    );
};

export default connect(
    createStructuredSelector({
        layout: selectTables
    }),
    dispatch => ({
        createTable: (x, y, seats) => dispatch(createTableStart(x, y, seats)),
        updateTable: (table, x, y, seats) => dispatch(updateTableStart(table, x, y, seats)),
        deleteTable: (table) => dispatch(deleteTableStart(table))
    })
)(TablesLayoutEditorPage);
