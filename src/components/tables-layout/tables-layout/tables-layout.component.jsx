import React from 'react';
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {Table, TablesLayoutContainer} from "./tables-layout.styles";
import TablesLayoutCell from "../tables-layout-cell/tables-layout-cell.component";
import TablesLayoutTable from "../tables-layout-table/tables-layout-table.component";
import {selectTables} from "../../../redux/table/table.selectors";

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
                <TablesLayoutCell x={i} y={j} key={i * MAX_ROWS + j} rows={MAX_ROWS} cols={MAX_COLS} table={table}
                                  onTableDropped={onTableDropped}
                                  onCellClicked={table ? null : onCellClicked}>
                    {table
                        ? <TablesLayoutTable x={i} y={j} table={table}
                                             allowDragging={!!onTableDropped}
                                             onTableClick={onTableClicked}/>
                        : null}
                </TablesLayoutCell>
            );
        }
    }

    return <TablesLayoutContainer aspect={MAX_COLS / MAX_ROWS}>
        <DndProvider backend={HTML5Backend}>
            <Table>
                {cells}
            </Table>
        </DndProvider>
    </TablesLayoutContainer>;
}

export default connect(
    createStructuredSelector({
        layout: selectTables
    })
)(TablesLayout);