import React from 'react';
import {TablesCellContainer} from "./tables-layout-cell.styles";
import {useDrop} from "react-dnd";
import {TABLE_DRAG_TYPE} from "../tables-layout-table/tables-layout-table.component";

const TablesLayoutCell = ({x, y, cols, rows, table, onTableDropped, onCellClicked, children}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: TABLE_DRAG_TYPE,
        drop: (item) => {
            if (onTableDropped) {
                onTableDropped(x, y, item);
            }
        },
        canDrop: () => !table,
        collect: monitor => ({
            isOver: !!monitor.isOver()
        }),
    }), [x, y])

    return <TablesCellContainer cols={cols} rows={rows} ref={drop} isOver={isOver} onClick={()=> onCellClicked ? onCellClicked(x, y) : null}>
        {children}
    </TablesCellContainer>
};

export default TablesLayoutCell;