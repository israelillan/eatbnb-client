import React from 'react';
import {TableCellContainer} from "./table-layout-cell.styles";
import {useDrop} from "react-dnd";
import {TABLE_DRAG_TYPE} from "../DraggableLayoutTable/draggable-layout-table.component";

const TableLayoutCell = ({x, y, cols, rows, table, onTableDropped, onCellClicked, children}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: TABLE_DRAG_TYPE,
        drop: (item) => {
            onTableDropped(x, y, item);
        },
        canDrop: () => !table,
        collect: monitor => ({
            isOver: !!monitor.isOver()
        }),
    }), [x, y])

    return <TableCellContainer cols={cols} rows={rows} ref={drop} isOver={isOver} onClick={()=> onCellClicked ? onCellClicked(x, y) : null}>
        {children}
    </TableCellContainer>
};

export default TableLayoutCell;