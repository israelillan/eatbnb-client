import React from 'react';
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Grid} from "@material-ui/core";

import EmptyCell from "../empty-cell/empty-cell.component";
import {selectTables} from "../../../redux/table/table.selectors";
import TableCell from "../table-cell/table-cell.component";

const TablesLayout = ({layout, onCellClicked, onTableClicked, onTableDropped}) => {
    const MAX_COLS = 15;
    const MAX_ROWS = 10;

    const layoutMap = layout.reduce((a, table) => ({...a, [`${table.x},${table.y}`]: table}), {})

    const cells = [];
    for (let j = 0; j < MAX_ROWS; j++) {
        for (let i = 0; i < MAX_COLS; i++) {
            const index = `${i},${j}`;
            const table = index in layoutMap ? layoutMap[index] : null;
            cells.push(
                <Grid key={i * MAX_ROWS + j} item xs={1} onClick={table ? null : () => onCellClicked(i, j)}>
                    {table ?
                        <TableCell sx={{minHeight: 30, minWidth: 30}} table={table} allowDragging={true}
                                   onTableClick={onTableClicked} /> :
                        <EmptyCell sx={{minHeight: 30, minWidth: 30}} x={i} y={j}
                                   onClick={onCellClicked}
                                   onTableDropped={onTableDropped} />}
                </Grid>
            );
        }
    }

    return <DndProvider backend={HTML5Backend}>
        <Grid columns={MAX_COLS} container
              direction="row"
              justifyContent="flex-end"
              spacing={1}
        >
            {cells}
        </Grid>
    </DndProvider>;
};

export default connect(
    createStructuredSelector({
        layout: selectTables
    })
)(TablesLayout);