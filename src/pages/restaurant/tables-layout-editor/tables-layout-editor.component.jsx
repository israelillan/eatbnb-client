import React, {useState} from 'react';
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {DndProvider} from "react-dnd";

import {Table, TableContainer, TablesLayoutEditorContainer} from "./tables-layout-editor.styles";

import {createTableStart, deleteTableStart, updateTableStart} from "../../../redux/table/table.actions";
import {selectTables} from "../../../redux/table/table.selectors";
import {Button, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import {HTML5Backend} from "react-dnd-html5-backend";
import DraggableLayoutTable from "../../../components/DraggableLayoutTable/draggable-layout-table.component";
import TableLayoutCell from "../../../components/table-layout-cell/table-layout-cell.component";

const TablesLayoutEditorPage = ({layout, createTable, updateTable, deleteTable}) => {
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);
    const [tableSeats, setTableSeats] = useState(4);
    const cellClicked = (x, y) => {
        setSelectedCell({x, y, table: null});
        setOpenCreate(true);
    };
    const tableClicked = (table) => {
        setSelectedCell({x: table.x, y: table.y, table});
        setTableSeats(table.seats);
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

    const tableDropped = (x, y, table) => {
        updateTable(table, x, y, table.seats);
    };

    const layoutMap = layout.reduce((a, table) => ({...a, [`${table.x},${table.y}`]: table}), {})

    const cells = [];
    const MAX_COLS = 15;
    const MAX_ROWS = 10;
    for (let j = 0; j < MAX_ROWS; j++) {
        for (let i = 0; i < MAX_COLS; i++) {
            const index = `${i},${j}`;
            const table = index in layoutMap ? layoutMap[index] : null;
            cells.push(
                <TableLayoutCell x={i} y={j} key={i * MAX_ROWS + j} rows={MAX_ROWS} cols={MAX_COLS} table={table}
                                 onTableDropped={(x, y, table) => tableDropped(x, y, table)}
                                 onCellClicked={table ? null : cellClicked}>
                    {table
                        ? <DraggableLayoutTable x={i} y={j} table={table}
                                                onTableClick={tableClicked}/>
                        : null}
                </TableLayoutCell>
            );
        }
    }

    return (
        <TablesLayoutEditorContainer>
            <span>Set up your restaurant tables layout</span>
            <DndProvider backend={HTML5Backend}>
                <TableContainer aspect={MAX_COLS / MAX_ROWS}>
                    <Table>
                        {cells}
                    </Table>
                </TableContainer>
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
